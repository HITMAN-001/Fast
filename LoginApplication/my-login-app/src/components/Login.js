import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../MKTA tennis acedemy logo.jpg';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    setUsername("");
    setPassword("");
    setMessage("");
  }, []);

  const handleLogin = async () => {
    try {
      // FastAPI expects x-www-form-urlencoded, not JSON
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      const response = await axios.post("http://localhost:8000/token", params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const token = response.data.access_token;
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        navigate("/home", { replace: true });
      }
      setMessage('Login successful!');
    } catch (error) {
      setMessage("Login failed. Try again.");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-300">
        <div className="text-center">
          <img src={logo} alt="MKTA Tennis Academy Logo" style={{ width: '90px', margin: '0 auto 16px auto', display: 'block' }} />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
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
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
        >
          Sign In
        </button>

        {message && (
          <p className={`text-center mt-4 ${message.includes('failed') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        <button
          onClick={() => navigate('/register')}
          className="w-full mt-2 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-100"
        >
          New user? Register here
        </button>
      </div>
    </div>
  );
};

export default Login;