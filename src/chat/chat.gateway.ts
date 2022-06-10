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
import { ChatService } from "./chat.service";

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

  constructor(private readonly chatService: ChatService) {}

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
  async handleMessage(
    client: any,
    payload: { receiver: string; message: string },
  ) {
    const newChat = {
      ...payload,
      sender: client.request.user._id,
    };

    const chat = await this.chatService.insertChat(newChat);
    this.wss.to(chat.receiver).emit("receiveMessage", chat);
    this.wss.to(chat.sender).emit("sentMessage", chat);

    return chat;
  }
}
