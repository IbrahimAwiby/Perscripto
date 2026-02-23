// routes/doctorAppointmentRouter.js
import express from "express";
import {
  getAppointmentDetails,
  updateAppointmentStatus,
  getTodaySchedule,
  getDoctorAppointments,
} from "../controller/doctorAppointmentController.js";
import authDoctor from "../middleware/authDoctor.js";

const doctorAppointmentRouter = express.Router();

// All routes require doctor authentication
doctorAppointmentRouter.use(authDoctor);

// Get all appointments for the logged-in doctor
doctorAppointmentRouter.get("/", getDoctorAppointments);

// Get today's schedule
doctorAppointmentRouter.get("/today", getTodaySchedule);

// Get single appointment details
doctorAppointmentRouter.get("/:appointmentId", getAppointmentDetails);

// Update appointment status
doctorAppointmentRouter.patch(
  "/:appointmentId/status",
  updateAppointmentStatus,
);

export default doctorAppointmentRouter;
