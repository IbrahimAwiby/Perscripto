// context/AppContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false,
  );
  const [userData, setUserData] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    if (!token || loadingProfile) return;

    setLoadingProfile(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/user/profile", {
        headers: {
          token: token, // Make sure token is sent correctly
        },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        // If token is invalid, clear it
        if (
          data.message === "Not Authorized. Login again." ||
          data.message === "Invalid Token"
        ) {
          localStorage.removeItem("token");
          setToken(false);
          setUserData(false);
          toast.error("Session expired. Please login again.");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("Profile load error:", error);
      // If it's an auth error, clear token
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(false);
        setUserData(false);
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  // Load profile when token changes
  useEffect(() => {
    if (token) {
      // Add a small delay to ensure token is properly set
      const timer = setTimeout(() => {
        loadUserProfileData();
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setUserData(false);
    }
  }, [token]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
