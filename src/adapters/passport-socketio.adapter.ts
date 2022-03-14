import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server } from "socket.io";
import * as passport from "passport";

import { expressSession } from "../lib/expressSession";

export default class PassportSocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);

    const wrap = (middleware: any) => (socket: any, next: any) =>
      middleware(socket.request, {}, next);
    server.use(wrap(expressSession));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));

    return server;
  }
}
