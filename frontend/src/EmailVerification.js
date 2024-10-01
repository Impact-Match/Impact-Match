import React from "react";
import { Link, useLocation } from "react-router-dom";
import LeftSection from "./LeftSection";
import emailIcon from "./assets/SendEmail.png";
import axios from "axios";
import { useState } from "react";

const EmailVerification = () => {
  const location = useLocation();
  const { account } = location.state || {}; // Get account from location.state
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleResendEmail = async (e) => {
    e.preventDefault();
    if (!account) {
      console.error("No account found in state");
      setError("No account information available.");
      return;
    }

    const user_data = { email: account };
    console.log("user_data:", user_data); // Check if this logs correctly

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/resend-email",
        user_data
      );

      console.log("response:", response); // Log the entire response object

      if (response.status === 200) {
        setSuccessMessage(
          "Registration successful! Please check your email to verify your account."
        );
        alert("Email sent successfully");
      }
    } catch (err) {
      console.error("Error in sending email:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError("Failed to resend email. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col md:flex-row w-full bg-white">
        {/* Left Section */}
        <LeftSection />
        {/* Right Section */}
        <div className="w-full md:w-2/3 p-10 flex flex-col items-center justify-center">
          <div className="w-[70%]">
            <h2 className="text-2xl text-black text-center mb-8">
              Please verify your email
            </h2>
            <p className="text-black text-sm text-center mb-8">
              We have sent a verification link to <span>{account}</span>.
            </p>
          </div>
          <div className="w-[100%] flex justify-center mb-8">
            <img
              src={emailIcon}
              alt="Email Verification"
              className="w-48 h-48 object-contain"
            />
          </div>
          <div className="w-[70%]">
            <p className="text-sm text-black text-center mb-6">
              Click on the link in your email to complete the verification
              process. You may need to check your spam folder.
            </p>
          </div>
          <div className="w-[60%] flex justify-between items-center mt-2 text-sm">
            <button
              type="button"
              onClick={handleResendEmail} // Call handleResendEmail function
              className="h-9 py-1.5 px-4 bg-darkBlue text-white rounded-3xl text-sm transition-shadow duration-150 hover:bg-blue-800 active:bg-blue-900 active:shadow-inner"
            >
              Resend Email
            </button>
            <Link
              to="/login"
              className="text-darkBlue hover:underline focus:underline active:text-blue-900 inline-block ml-1"
            >
              Return to Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
