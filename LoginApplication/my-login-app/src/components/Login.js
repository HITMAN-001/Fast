import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from '../MKTA tennis acedemy logo.jpg';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setUsername("");
    setPassword("");
    setMessage("");

    // Add event listener for Enter key on component mount
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleLogin();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
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
      
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user_id", response.data.user_id);
        setMessage('Login successful!');
        navigate("/home", { replace: true });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        if (error.response.data.detail.includes("verify")) {
          setMessage("Please verify your email before logging in. Need a new verification link? Click 'Resend Verification Email' below.");
        } else {
          setMessage(error.response.data.detail);
        }
      } else {
        setMessage("Login failed. Please check your credentials and try again.");
      }
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
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
        <div className="text-center text-sm mt-4">
          <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800 transition">
            Forgot password?
          </Link>
        </div>
        
        <button
          onClick={() => navigate('/register')}
          className="w-full mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-100"
        >
          New user? Register here
        </button>
      </div>
    </div>
  );
};

export default Login;