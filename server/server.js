// server.js or app.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import paymentRouter from "./routes/paymentRouter.js";
import messageRouter from "./routes/messageRouter.js";
import adminAppointmentRouter from "./routes/adminAppointmentRouter.js";
import adminDashboardRouter from "./routes/adminDashboardRouter.js";
import doctorAppointmentRouter from "./routes/doctorAppointmentRouter.js";
import doctorDashboardRouter from "./routes/doctorDashboardRouter.js";

// ! app config
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB once at startup (not on every request)
connectDB().catch(console.error);

// ! middlewares
app.use(express.json());
app.use(cors());

// ! api endpoints
app.get("/", (req, res) => {
  res.send("Server is running 🚀🚀");
});

app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/message", messageRouter);
app.use("/api/admin/appointments", adminAppointmentRouter);
app.use("/api/admin/dashboard", adminDashboardRouter);
app.use("/api/doctor/appointments", doctorAppointmentRouter);
app.use("/api/doctor/dashboard", doctorDashboardRouter);

// ! Error handler
app.use(notFound);
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
  });
}

// Export for Vercel serverless
export default app;
