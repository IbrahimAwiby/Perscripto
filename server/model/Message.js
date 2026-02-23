// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;
