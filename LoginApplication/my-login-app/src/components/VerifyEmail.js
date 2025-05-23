import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../MKTA tennis acedemy logo.jpg';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(`http://localhost:8000/verify-email/${token}`);
        setStatus("success");
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-300 text-center">
        <img src={logo} alt="MKTA Tennis Academy Logo" style={{ width: '90px', margin: '0 auto 16px auto', display: 'block' }} />
        
        {status === "verifying" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Verifying Your Email</h2>
            <div className="flex justify-center my-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600">Email Verified!</h2>
            <div className="my-6 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">Your email has been successfully verified. You can now log in to your account.</p>
            <button
              onClick={handleGoToLogin}
              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <div className="my-6 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">The verification link is invalid or has expired. Please request a new verification link.</p>
            <button
              onClick={handleGoToLogin}
              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
