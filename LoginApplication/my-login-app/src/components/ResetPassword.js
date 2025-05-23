import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import logo from '../MKTA tennis acedemy logo.jpg';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    // Validate inputs
    if (!newPassword) {
      setMessage("Please enter a new password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    setStatus("submitting");
    setMessage("Resetting your password...");

    try {
      await axios.post("http://localhost:8000/reset-password/", {
        token,
        new_password: newPassword
      });
      
      setStatus("success");
      setMessage("Your password has been reset successfully!");
    } catch (error) {
      console.error("Password reset error:", error);
      setStatus("error");
      setMessage(
        error.response && error.response.data && error.response.data.detail
          ? error.response.data.detail
          : "Invalid or expired reset link. Please request a new one."
      );
    }
  };

  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-300">
        <div className="text-center">
          <img src={logo} alt="MKTA Tennis Academy Logo" style={{ width: '90px', margin: '0 auto 16px auto', display: 'block' }} />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
          <p className="text-gray-500">Enter your new password below</p>
        </div>
        
        {status === "success" ? (
          <div className="text-center">
            <div className="my-6 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={handleGoToLogin}
              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            >
              Go to Login
            </button>
          </div>
        ) : status === "error" ? (
          <div className="text-center">
            <div className="my-6 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-600 mb-6">{message}</p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            >
              Request New Reset Link
            </button>
            <button
              onClick={handleGoToLogin}
              className="w-full mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-100"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={status === "submitting"}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={status === "submitting"}
                />
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={status === "submitting" || !newPassword || !confirmPassword}
              className={`w-full py-3 px-4 ${
                status === "submitting" || !newPassword || !confirmPassword
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              } text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300`}
            >
              {status === "submitting" ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>

            <button
              onClick={handleGoToLogin}
              className="w-full mt-2 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-100"
            >
              Back to Login
            </button>

            {message && status !== "success" && status !== "error" && (
              <p className="text-center mt-4 text-red-500">
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
