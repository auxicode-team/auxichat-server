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
    client.join(`${client.request.user._id}`);
    await this.emitOnlineUserIds();
  }

  async handleDisconnect(client: Socket & { request: { user: User } }) {
    client.leave("ONLINE_USERS");
    await this.emitOnlineUserIds();
  }

  @SubscribeMessage("sendMessage")
  handleMessage(
    client: any,
    payload: {
      messageHistory: { sender: string; receiver: string; message: string }[];
      messageToSent: { sender: string; receiver: string; message: string };
    },
  ) {
    this.wss.to(payload.messageToSent.receiver).emit("receiveMessage", [
      ...payload.messageHistory,
      {
        ...payload.messageToSent,
        sender: client.request.user._id,
      },
    ]);

    return [
      ...payload.messageHistory,
      {
        ...payload.messageToSent,
        sender: client.request.user._id,
      },
    ];
  }
}
