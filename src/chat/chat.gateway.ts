import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "../users/user.model";

@WebSocketGateway({
  namespace: "/chat",
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger("ChatGateway");

  afterInit(server: Server) {
    this.logger.log("ChatGateway Initialized!");
  }

  async emitOnlineUserIds() {
    const sockets = await this.wss.in("ONLINE_USERS").fetchSockets();
    const onlineUserIds = new Set();
    for (const socket of sockets) {
      onlineUserIds.add((socket as any).request.user._id);
    }

    this.wss.to("ONLINE_USERS").emit("onlineUserIds", [...onlineUserIds]);
  }

  async handleConnection(
    client: Socket & { request: { user: User } },
    ...args: any[]
  ) {
    client.join("ONLINE_USERS");
    await this.emitOnlineUserIds();
  }

  async handleDisconnect(client: Socket & { request: { user: User } }) {
    client.leave("ONLINE_USERS");
    await this.emitOnlineUserIds();
  }

  @SubscribeMessage("chatToServer")
  handleMessage(
    client: any,
    message: { sender: string; room: string; message: string },
  ) {
    console.log(client.request.user);
    console.log(message);

    // this.wss.to(message.room).emit("chatToClient", message);
    return "yoyo"
  }
}
