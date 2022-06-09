import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Chat } from "./chat.model";

@Injectable()
export class ChatService {
  constructor(@InjectModel("Chat") private readonly chatModel: Model<Chat>) {}

  async getLatestChat(userId: string, personId: string) {
    const data = await this.chatModel.aggregate([
      {
        $match: {
          $or: [
            {
              sender: userId,
              receiver: personId,
            },
            {
              sender: personId,
              receiver: userId,
            },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $limit: 10 },
    ]);

    return data;
  }

  insertChat(data: {
    sender: string;
    receiver: string;
    message: string;
  }): Promise<Chat> {
    const newChat = new this.chatModel(data);

    return newChat.save();
  }
}
