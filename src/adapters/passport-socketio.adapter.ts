import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server } from "socket.io";
import * as passport from "passport";

import { expressSession } from "../lib/expressSession";
import { UnauthorizedException } from "@nestjs/common";

export default class PassportSocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);

    const wrap = (middleware: any) => (socket: any, next: any) =>
      middleware(socket.request, {}, next);
    server.of("/chat").use(wrap(expressSession));
    server.of("/chat").use(wrap(passport.initialize()));
    server.of("/chat").use(wrap(passport.session()));
    server.of("/chat").use((socket: any, next) => {
      if (socket.request.user) {
        next();
      } else {
        next(new UnauthorizedException("Please Login First!"));
      }
    });

    return server;
  }
}
