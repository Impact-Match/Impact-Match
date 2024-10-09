import React, { useState } from "react";
import icon from "./assets/ImpactMatchLogo_Transparent.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { backend } from './services/service';

const Signup = () => {
  const [userType, setUserType] = useState("student");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    dob: "",
    companyName: "",
  });

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isAdult = (dateOfBirth) => {
    const now = new Date();
    const dob = new Date(dateOfBirth);
    const age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isAdult(formData.dateOfBirth) < 18) {
      setError("You must be at least 18 years old to register.");
      return;
    }
    setError("");
    const user_data = {
      email: formData.email,
      password: formData.password,
      full_name: formData.name,
      role: userType,
    };

    try {
      const endpoint = userType === "student" ? "/auth/register" : "/auth/register-ngo";
      const response = await axios.post(
        `${backend}${endpoint}`,
        user_data
      );
      console.log("response:" + JSON.stringify(response.data)); // create logger

      if (response.status === 201 && formData.email) {
        if (userType === "student") {
          setSuccessMessage("Registration successful! Please check your email to verify your account.");
        } else {
          setSuccessMessage("Registration successful! Please check your email for verification and await NGO admin approval.");
        }
        navigate("/email-verification", {
          state: { account: formData.email },
        });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError("Failed to register. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-grow flex flex-col">
        <div className="flex flex-col md:flex-row w-full h-full bg-white overflow-hidden">
          {/* Left Section */}
          <div className="w-full md:w-1/3 bg-darkBlue text-white p-10 flex flex-col justify-center items-center">
            <div className="flex mb-20 -mt-36">
              <button
                className={`w-32 py-1 rounded-sm font-inter ${
                  userType === "student" ? "bg-lightBlue" : "bg-gray-400"
                }`}
                onClick={() => handleUserTypeChange("student")}
              >
                Student
              </button>
              <button
                className={`w-32 py-1 rounded-sm ${
                  userType === "ngo" ? "bg-lightBlue" : "bg-gray-400"
                }`}
                onClick={() => handleUserTypeChange("ngo")}
              >
                Organization
              </button>
            </div>
            <img
              src={icon}
              alt="Impact Match Logo"
              className="w-32 h-32 mb-4"
            />
            <h1 className="text-2xl font-inter">Impact Match</h1>
          </div>
          {/* Right Section */}
          <div className="w-full md:w-2/3 p-10 flex flex-col items-center justify-center">
            <h2 className="text-2xl mb-6 text-gray-600 text-center font-inter">
              Create New Account
            </h2>
            <p className="text-sm mb-28 text-gray-400 text-center">
              Already Registered?{" "}
              <Link to="/login" className="text-lightBlue">
                Login
              </Link>
            </p>
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
            {userType === "student" ? (
              <form className="w-full space-y-4" onSubmit={handleFormSubmit}>
                <div className="flex flex-col items-center">
                  <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">
                    PLEASE ENTER YOUR NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100"
                    required
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">
                    PLEASE ENTER YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100"
                    required
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">
                    PLEASE ENTER YOUR PASSWORD
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100"
                    required
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">
                    PLEASE ENTER YOUR DATE OF BIRTH
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100 text-gray-200"
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-[17%] py-2 bg-lightBlue text-black rounded-2xl text-sm mt-6"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            ) : (
              <form className="w-full space-y-4" onSubmit={handleFormSubmit}>
                <div className="flex flex-col items-center">
                  <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">
                    PLEASE ENTER YOUR NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100"
                    required
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">
                    PLEASE ENTER YOUR COMPANY NAME
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100"
                    required
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">
                    PLEASE ENTER YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100"
                    required
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">
                    PLEASE ENTER YOUR PASSWORD
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100"
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-[17%] py-2 bg-lightBlue text-black rounded-2xl text-sm mt-6"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
