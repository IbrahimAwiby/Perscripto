// routes/adminAppointmentRouter.js
import express from "express";
import {
  getAllAppointments,
  getAppointmentDetails,
  updateAppointmentStatus,
  getAppointmentStats,
} from "../controller/adminAppointmentController.js";
import authAdmin from "../middleware/authAdmin.js";

const adminAppointmentRouter = express.Router();

// All routes require admin authentication
adminAppointmentRouter.use(authAdmin);

// Get all appointments with filters and pagination
adminAppointmentRouter.get("/", getAllAppointments);

// Get appointment statistics
adminAppointmentRouter.get("/stats", getAppointmentStats);

// Get single appointment details
adminAppointmentRouter.get("/:appointmentId", getAppointmentDetails);

// Update appointment status
adminAppointmentRouter.patch("/:appointmentId/status", updateAppointmentStatus);

export default adminAppointmentRouter;
