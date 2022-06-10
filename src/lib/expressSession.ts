import * as session from "express-session";

import { redisStore } from "./redisStore";

export const expressSession = session({
  secret: process.env.SESSION_SECRET || "asdfghjkl",
  name: "chat.sid",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000,
    path: "/",
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    secure: process.env.NODE_ENV === "development" ? false : true,
  },
  store: redisStore,
} as session.SessionOptions);
