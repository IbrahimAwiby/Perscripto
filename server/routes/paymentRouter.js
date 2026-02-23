// routes/paymentRouter.js
import express from "express";

import authUser from "../middleware/authUser.js";
import { createPaymentOrder, getPaymentStatus, handlePaymentCallback, handlePaymentResponse } from "../controller/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", authUser, createPaymentOrder);
paymentRouter.post("/callback", handlePaymentCallback); // Paymob webhook
paymentRouter.get("/response", handlePaymentResponse); // Return URL
paymentRouter.get("/status/:appointmentId", authUser, getPaymentStatus);

export default paymentRouter;
