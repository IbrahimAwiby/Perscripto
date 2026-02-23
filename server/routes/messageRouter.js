// routes/messageRouter.js
import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import { deleteMessage, getAllMessages, markAsRead, sendMessage } from "../controller/messageController.js";


const messageRouter = express.Router();

// Public route
messageRouter.post("/send", sendMessage);

// Admin routes
messageRouter.get("/admin/all", getAllMessages);
messageRouter.put("/admin/:id/read", markAsRead);
messageRouter.delete("/admin/:id", deleteMessage);

export default messageRouter;
