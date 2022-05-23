import { Schema, Document } from "mongoose";

export const ChatSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export interface Chat extends Document {
  sender: string;
  receiver: string;
  message: string;
}
