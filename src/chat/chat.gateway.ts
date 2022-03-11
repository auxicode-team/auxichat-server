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

@WebSocketGateway({
  namespace: "/chat",
  // cors: {
  //   origin: '*',
  // },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger("ChatGateway");

  afterInit(server: Server) {
    this.logger.log("ChatGateway Initialized!");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`${client.id} connected!`);
    this.logger.log(args);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`${client.id} disconnected!`);
  }

  @SubscribeMessage("chatToServer")
  handleMessage(
    client: Socket,
    message: { sender: string; room: string; message: string },
  ) {
    this.wss.to(message.room).emit("chatToClient", message);
  }
}
