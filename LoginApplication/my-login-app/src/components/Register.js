import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [isSalaried, setIsSalaried] = useState(false);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:8000/users/", {
        email,
        password,
        birthdate: birthdate || null,  // Send null if no date is selected
        is_salaried: isSalaried,
        address: address || null  // Send null if no address is provided
      });
      setMessage("Registration successful! Redirecting to login...");
      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage(
        error.response && error.response.data && error.response.data.detail
          ? error.response.data.detail
          : "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-300">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-500">Sign up to get started</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Birth Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={isSalaried}
              onChange={(e) => setIsSalaried(e.target.checked)}
            />
            <label className="ml-2 block text-sm text-gray-700">Salaried Employee</label>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Address</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter your address"
              rows="3"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleRegister}
          className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
        >
          Register
        </button>
        <button
          onClick={handleBack}
          className="w-full mt-2 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-100"
        >
          Back to Login
        </button>
        {message && (
          <p className={`text-center mt-4 ${message.includes('failed') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
