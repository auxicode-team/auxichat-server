import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ChatSchema } from "./chat.model";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Chat", schema: ChatSchema }])],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
