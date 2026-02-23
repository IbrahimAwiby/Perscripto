// pages/DoctorProfile.jsx
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaEnvelope,
  FaGraduationCap,
  FaBriefcase,
  FaDollarSign,
  FaMapMarkerAlt,
  FaStethoscope,
  FaCamera,
  FaSave,
  FaEdit,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorProfile = () => {
  const { dToken, backendUrl } = useContext(DoctorContext);
  const navigate = useNavigate();

  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    degree: "",
    speciality: "",
    experience: "",
    fees: "",
    about: "",
    available: true,
    address: {
      line1: "",
      line2: "",
    },
  });

  // Fetch doctor profile
  const fetchDoctorProfile = async () => {
    if (!dToken) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { token: dToken },
      });

      if (data.success) {
        setDoctorData(data.doctor);
        setFormData({
          name: data.doctor.name || "",
          email: data.doctor.email || "",
          degree: data.doctor.degree || "",
          speciality: data.doctor.speciality || "",
          experience: data.doctor.experience || "",
          fees: data.doctor.fees || "",
          about: data.doctor.about || "",
          available: data.doctor.available ?? true,
          address: {
            line1: data.doctor.address?.line1 || "",
            line2: data.doctor.address?.line2 || "",
          },
        });
        setImagePreview(data.doctor.image || null);
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      fetchDoctorProfile();
    }
  }, [dToken]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle address changes
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

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setUpdating(true);

    try {
      const formDataToSend = new FormData();

      // Append all fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("degree", formData.degree);
      formDataToSend.append("speciality", formData.speciality);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("fees", formData.fees);
      formDataToSend.append("about", formData.about);
      formDataToSend.append("available", formData.available);

      // Append address
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
        `${backendUrl}/api/doctor/update-profile`,
        formDataToSend,
        {
          headers: {
            token: dToken,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        toast.success("Profile updated successfully!");
        setDoctorData(data.doctor);
        setIsEditing(false);
        setImageFile(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (doctorData) {
      setFormData({
        name: doctorData.name || "",
        email: doctorData.email || "",
        degree: doctorData.degree || "",
        speciality: doctorData.speciality || "",
        experience: doctorData.experience || "",
        fees: doctorData.fees || "",
        about: doctorData.about || "",
        available: doctorData.available ?? true,
        address: {
          line1: doctorData.address?.line1 || "",
          line2: doctorData.address?.line2 || "",
        },
      });
      setImagePreview(doctorData.image || null);
    }
    setImageFile(null);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#5f6fff] text-5xl mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Doctor <span className="text-[#5f6fff]">Profile</span>
          </h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 bg-linear-to-r from-[#5f6fff] to-blue-400"></div>

          {/* Profile Content */}
          <div className="relative px-6 pb-8">
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative -mt-18">
                <div className="relative group">
                  <img
                    src={imagePreview || "https://via.placeholder.com/150"}
                    alt={formData.name}
                    className="w-34 h-34 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
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
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Availability Toggle */}
              <div className="flex items-center justify-end gap-3">
                <span className="text-sm text-gray-600">Availability:</span>
                <button
                  type="button"
                  onClick={() =>
                    !isEditing
                      ? null
                      : setFormData((prev) => ({
                          ...prev,
                          available: !prev.available,
                        }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.available ? "bg-green-500" : "bg-gray-300"
                  } ${!isEditing && "cursor-default"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.available ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">
                        {formData.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">
                        {formData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">
                        {formData.degree}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speciality
                    </label>
                    {isEditing ? (
                      <select
                        name="speciality"
                        value={formData.speciality}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                      >
                        <option value="General physician">
                          General Physician
                        </option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Pediatricians">Pediatricians</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Gastroenterologist">
                          Gastroenterologist
                        </option>
                      </select>
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">
                        {formData.speciality}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">
                        {formData.experience}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee ($)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="fees"
                        value={formData.fees}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">
                        ${formData.fees}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="line1"
                        value={formData.address.line1}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">
                        {formData.address.line1 || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="line2"
                        value={formData.address.line2}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg">
                        {formData.address.line2 || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About
                </label>
                {isEditing ? (
                  <textarea
                    name="about"
                    rows="4"
                    value={formData.about}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5f6fff]"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg whitespace-pre-wrap">
                    {formData.about || "No information provided"}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-[#5f6fff] text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : isEditing ? (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <FaEdit />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
