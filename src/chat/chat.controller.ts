import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(SessionAuthGuard)
  @Get("/latestChat")
  async getLatestChat(@Request() req: any, @Query() query: any) {
    const latestChat = await this.chatService.getLatestChat(
      `${req.user._id}`,
      query.personId,
    );

    return latestChat;
  }
}
