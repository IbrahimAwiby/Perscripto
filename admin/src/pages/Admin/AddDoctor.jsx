// pages/admin/AddDoctor.jsx
import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaUserMd,
  FaEnvelope,
  FaLock,
  FaBriefcase,
  FaDollarSign,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaFileAlt,
  FaUpload,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaRegClock,
  FaCamera,
} from "react-icons/fa";

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    docImg: null,
    name: "",
    email: "",
    password: "",
    experience: "1 Year",
    fees: "",
    about: "",
    speciality: "General physician",
    degree: "",
    address1: "",
    address2: "",
  });

  const { backendUrl, aToken } = useContext(AdminContext);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.fees || formData.fees <= 0)
      newErrors.fees = "Valid fees amount is required";
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.address1.trim())
      newErrors.address1 = "Address line 1 is required";
    if (!formData.about.trim()) newErrors.about = "About section is required";
    if (!formData.docImg) newErrors.docImg = "Doctor image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        docImg: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear image error
      if (errors.docImg) {
        setErrors((prev) => ({ ...prev, docImg: undefined }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("fees", formData.fees);
      formDataToSend.append("about", formData.about);
      formDataToSend.append("speciality", formData.speciality);
      formDataToSend.append("degree", formData.degree);

      const address = {
        line1: formData.address1,
        line2: formData.address2,
      };
      formDataToSend.append("address", JSON.stringify(address));
      formDataToSend.append("image", formData.docImg);

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${aToken}`,
          },
        },
      );

      if (data.success) {
        toast.success("Doctor added successfully! 🎉");

        setFormData({
          docImg: null,
          name: "",
          email: "",
          password: "",
          experience: "1 Year",
          fees: "",
          about: "",
          speciality: "General physician",
          degree: "",
          address1: "",
          address2: "",
        });
        setPreviewUrl(null);
        setErrors({});

        document.getElementById("doc-img").value = "";
      } else {
        toast.error(data.message || "Failed to add doctor");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Add New <span className="text-[#5f6fff]">Doctor</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details to register a new doctor
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-linear-to-r from-[#5f6fff] to-blue-400 px-8 py-6 max-sm:px-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <FaUserMd className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Doctor Information
              </h2>
              <p className="text-white/90 text-sm">
                Enter the doctor's personal and professional details
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 max-sm:p-4">
          {/* Image Upload Section */}
          <div className="mb-8">
            <label className="block text-gray-700 font-semibold mb-3">
              Doctor Picture <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <div
                  className={`w-32 h-32 rounded-2xl overflow-hidden border-4 
                  ${errors.docImg ? "border-red-500" : "border-gray-200"} 
                  group-hover:border-[#5f6fff] transition-all duration-300`}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FaUserMd className="text-5xl text-gray-400" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="doc-img"
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#5f6fff] rounded-full 
                    flex items-center justify-center text-white cursor-pointer shadow-lg 
                    hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                >
                  <FaCamera className="text-lg" />
                </label>
                <input
                  type="file"
                  id="doc-img"
                  name="docImg"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Requirements:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" /> JPG, JPEG, or
                    PNG format
                  </li>
                  <li className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" /> Max file size:
                    5MB
                  </li>
                  <li className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" /> Square image
                    recommended
                  </li>
                </ul>
                {errors.docImg && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <FaTimesCircle /> {errors.docImg}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 
                    focus:ring-[#5f6fff] focus:border-transparent transition
                    ${errors.name ? "border-red-500" : "border-gray-200"}`}
                  placeholder="Dr. John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 
                    focus:ring-[#5f6fff] focus:border-transparent transition
                    ${errors.email ? "border-red-500" : "border-gray-200"}`}
                  placeholder="doctor@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 
                    focus:ring-[#5f6fff] focus:border-transparent transition
                    ${errors.password ? "border-red-500" : "border-gray-200"}`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Experience <span className="text-red-500">*</span>
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                    focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option
                      key={num}
                      value={`${num} Year${num > 1 ? "s" : ""}`}
                    >
                      {num} Year{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Consultation Fees ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 
                    focus:ring-[#5f6fff] focus:border-transparent transition
                    ${errors.fees ? "border-red-500" : "border-gray-200"}`}
                  placeholder="500"
                  min="0"
                />
                {errors.fees && (
                  <p className="text-red-500 text-xs mt-1">{errors.fees}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Speciality <span className="text-red-500">*</span>
                </label>
                <select
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                    focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent bg-white"
                >
                  <option value="General physician">General Physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatricians">Pediatricians</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Education/Degree <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 
                    focus:ring-[#5f6fff] focus:border-transparent transition
                    ${errors.degree ? "border-red-500" : "border-gray-200"}`}
                  placeholder="MBBS, MD, PhD"
                />
                {errors.degree && (
                  <p className="text-red-500 text-xs mt-1">{errors.degree}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Clinic Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 
                    focus:ring-[#5f6fff] focus:border-transparent transition mb-3
                    ${errors.address1 ? "border-red-500" : "border-gray-200"}`}
                  placeholder="Address line 1"
                />
                {errors.address1 && (
                  <p className="text-red-500 text-xs mt-1">{errors.address1}</p>
                )}
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                    focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent"
                  placeholder="Address line 2"
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              About Doctor <span className="text-red-500">*</span>
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              rows="5"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 
                focus:ring-[#5f6fff] focus:border-transparent transition resize-none
                ${errors.about ? "border-red-500" : "border-gray-200"}`}
              placeholder="Write a brief description about the doctor's experience, expertise, and background..."
            />
            {errors.about && (
              <p className="text-red-500 text-xs mt-1">{errors.about}</p>
            )}
          </div>

          {/* Form Footer */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-8 pt-6 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#5f6fff] justify-center text-white rounded-xl font-semibold 
                hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 
                shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Adding Doctor...</span>
                </>
              ) : (
                <>
                  <FaUserMd />
                  <span>Add Doctor</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  docImg: null,
                  name: "",
                  email: "",
                  password: "",
                  experience: "1 Year",
                  fees: "",
                  about: "",
                  speciality: "General physician",
                  degree: "",
                  address1: "",
                  address2: "",
                });
                setPreviewUrl(null);
                setErrors({});
              }}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 
                hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
