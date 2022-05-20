import * as dotenv from "dotenv";
dotenv.config();
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as passport from "passport";

import PassportSocketIoAdapter from "./adapters/passport-socketio.adapter";
import { AppModule } from "./app.module";
import { expressSession } from "./lib/expressSession";

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

  app.use(expressSession);

  app.use(passport.initialize());
  app.use(passport.session());

  const passportSocketIoAdapter = new PassportSocketIoAdapter(app);
  app.useWebSocketAdapter(passportSocketIoAdapter);

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
