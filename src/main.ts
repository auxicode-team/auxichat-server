import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as session from "express-session";
import * as passport from "passport";
import * as Redis from "ioredis";
import * as connectRedis from "connect-redis";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const client = new Redis(process.env.REDIS_URI);
  client.on("connect", () => {
    console.log("Connected to Redis!");
  });
  client.on("error", console.error);
  const RedisStore = connectRedis(session);

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "asdfghjkl",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 },
      store: new RedisStore({ client } as any),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
