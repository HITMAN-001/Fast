import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../MKTA tennis acedemy logo.jpg';

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const navigate = useNavigate();

  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setStatus("sending");
    setMessage("Sending verification link...");

    try {
      console.log("Sending verification request for:", email);
      const response = await axios.post("http://localhost:8000/resend-verification-email/", { email });
      console.log("Verification response:", response.data);
      
      setStatus("success");
      setMessage("If your email is registered and not verified, a new verification link has been sent to your inbox.");
    } catch (error) {
      console.error("Verification resend error:", error);
      setStatus("error");
      
      let errorMessage = "Something went wrong. Please try again later.";
      if (error.response) {
        console.log("Error response:", error.response);
        if (error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      
      setMessage(errorMessage);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-300">
        <div className="text-center">
          <img src={logo} alt="MKTA Tennis Academy Logo" style={{ width: '90px', margin: '0 auto 16px auto', display: 'block' }} />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Resend Verification Email</h2>
          <p className="text-gray-500">Enter your email to receive a new verification link</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending" || status === "success"}
            />
          </div>
        </div>

        {status === "success" ? (
          <div className="text-center">
            <div className="my-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={handleBack}
              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleResendVerification}
              disabled={status === "sending" || !email}
              className={`w-full py-3 px-4 ${
                status === "sending" || !email
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              } text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300`}
            >
              {status === "sending" ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Verification Link"
              )}
            </button>

            <button
              onClick={handleBack}
              className="w-full mt-2 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-100"
            >
              Back to Login
            </button>
          </>
        )}

        {message && status !== "success" && (
          <p className={`text-center mt-4 ${status === "error" ? "text-red-500" : "text-gray-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResendVerification;
