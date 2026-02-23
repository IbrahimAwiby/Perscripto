// routes/doctorDashboardRouter.js
import express from "express";
import {
  getDoctorDashboardStats,
  getWeeklyTrends,
  getStatusDistribution,
  getRecentPatients,
} from "../controller/doctorDashboardController.js";
import authDoctor from "../middleware/authDoctor.js";

const doctorDashboardRouter = express.Router();

// All routes require doctor authentication
doctorDashboardRouter.use(authDoctor);

// Get all dashboard statistics
doctorDashboardRouter.get("/stats", getDoctorDashboardStats);

// Get weekly appointment trends
doctorDashboardRouter.get("/trends", getWeeklyTrends);

// Get appointment status distribution
doctorDashboardRouter.get("/distribution", getStatusDistribution);

// Get recent patients
doctorDashboardRouter.get("/recent-patients", getRecentPatients);

export default doctorDashboardRouter;
