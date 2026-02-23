import React, { useContext } from "react";
import Login from "./pages/Login";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import AllApointments from "./pages/Admin/AllApointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import AdminMessages from "./pages/Admin/AdminMessages";

// Doctor Pages
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

import NotFound from "./pages/NotFound";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  // If no one logged in
  if (!aToken && !dToken) {
    return (
      <>
        <Toaster position="top-right" />
        <Login />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fd]">
      <Toaster position="top-right" />
      <Navbar />

      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 ml-0 md:ml-64 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* ================= ADMIN ROUTES ================= */}
              {aToken && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/admin-dashboard" element={<Dashboard />} />
                  <Route
                    path="/all-appointments"
                    element={<AllApointments />}
                  />
                  <Route path="/add-doctor" element={<AddDoctor />} />
                  <Route path="/doctors-list" element={<DoctorsList />} />
                  <Route path="/admin-messages" element={<AdminMessages />} />
                </>
              )}

              {/* ================= DOCTOR ROUTES ================= */}
              {dToken && (
                <>
                  <Route path="/" element={<DoctorDashboard />} />
                  <Route
                    path="/doctor-dashboard"
                    element={<DoctorDashboard />}
                  />
                  <Route
                    path="/doctor-appointments"
                    element={<DoctorAppointments />}
                  />
                  <Route path="/doctor-profile" element={<DoctorProfile />} />
                </>
              )}

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
