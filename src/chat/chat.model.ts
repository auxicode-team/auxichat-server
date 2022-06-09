import { Schema, Document } from "mongoose";

export const ChatSchema = new Schema(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
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
