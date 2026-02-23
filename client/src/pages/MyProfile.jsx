// pages/MyProfile.jsx
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaVenusMars,
  FaCamera,
  FaSave,
  FaEdit,
  FaTimes,
  FaIdCard,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const MyProfile = () => {
  const { token, backendUrl, userData, loadUserProfileData } =
    useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Local form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "Not Selected",
    dob: "",
    address: {
      line1: "",
      line2: "",
    },
  });

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        gender: userData.gender || "Not Selected",
        dob: userData.dob || "",
        address: {
          line1: userData.address?.line1 || "",
          line2: userData.address?.line2 || "",
        },
      });
      setImagePreview(userData.image || null);
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("dob", formData.dob);

      // Stringify the address object properly
      formDataToSend.append(
        "address",
        JSON.stringify({
          line1: formData.address.line1,
          line2: formData.address.line2,
        }),
      );

      // Append image if selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const { data } = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        formDataToSend,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        toast.success("Profile updated successfully!");
        await loadUserProfileData();
        setIsEditing(false);
        setImageFile(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        gender: userData.gender || "Not Selected",
        dob: userData.dob || "",
        address: {
          line1: userData.address?.line1 || "",
          line2: userData.address?.line2 || "",
        },
      });
      setImagePreview(userData.image || null);
    }
    setImageFile(null);
    setIsEditing(false);
  };

  // Show loading state
  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8  sm:py-12  lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Image & Quick Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
              {/* Profile Image Section */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
                <div className="relative inline-block">
                  <div className="relative group">
                    <img
                      src={imagePreview || userData.image}
                      alt={formData.name}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                    />
                    {isEditing && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300">
                        <FaCamera className="text-white text-2xl" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
                {!isEditing && (
                  <h2 className="text-xl font-semibold text-white mt-4">
                    {formData.name}
                  </h2>
                )}
              </div>

              {/* Quick Stats */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FaIdCard className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Member ID</p>
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {userData._id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <FaClock className="text-green-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {userData.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <FaCheckCircle className="text-purple-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Account Status</p>
                    <p className="text-sm font-semibold text-green-600">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Form (2 columns on desktop) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">
                  Personal Information
                </h3>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2 text-blue-500" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {formData.name}
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2 text-purple-500" />
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600">
                      {userData.email}
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2 text-green-500" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {formData.phone || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Gender Field */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaVenusMars className="inline mr-2 text-pink-500" />
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        <option value="Not Selected">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {formData.gender}
                      </div>
                    )}
                  </div>

                  {/* Date of Birth Field */}
                  <div className="col-span-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2 text-orange-500" />
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {formData.dob || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Address Fields - Full width on desktop */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                      Address
                    </label>
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="line1"
                          value={formData.address.line1}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Address line 1"
                        />
                        <input
                          type="text"
                          name="line2"
                          value={formData.address.line2}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Address line 2"
                        />
                      </div>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {formData.address.line1 || formData.address.line2 ? (
                          <div className="space-y-1">
                            {formData.address.line1 && (
                              <div>{formData.address.line1}</div>
                            )}
                            {formData.address.line2 && (
                              <div>{formData.address.line2}</div>
                            )}
                          </div>
                        ) : (
                          "No address provided"
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
                  {isEditing && (
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50 order-2 sm:order-1"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold 
                      flex items-center justify-center gap-2 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                      ${loading ? "opacity-70" : ""} order-1 sm:order-2`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        {isEditing ? <FaSave /> : <FaEdit />}
                        <span>
                          {isEditing ? "Save Changes" : "Edit Profile"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
