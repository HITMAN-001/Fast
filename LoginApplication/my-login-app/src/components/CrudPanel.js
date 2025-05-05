import React, { useEffect, useState } from "react";
import axios from "axios";

const CrudPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming the backend returns a list and the first user is the current user
      if (Array.isArray(res.data) && res.data.length > 0) {
        setEmail(res.data[0].email);
        setUserId(res.data[0].id);
      }
    } catch (err) {
      setMessage("Failed to fetch user details.");
    }
  };

  const handleUpdate = async () => {
    if (!email || !password) {
      setMessage("Please enter both email and password to update your account.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8000/users/${userId}`,
        { email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Account details updated successfully!");
    } catch (err) {
      setMessage("Failed to update account details.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-gray-200 rounded-xl shadow p-8 border border-gray-300">
      <h2 className="text-2xl font-bold mb-4 text-indigo-500">User Account Panel</h2>
      <div className="mb-4 text-gray-600 text-sm">
        This panel allows you to view and update your user account details.<br />
        <b>Instructions:</b>
        <ul className="list-disc ml-6 mt-2">
          <li>Your current email is shown below. You can update your email and password.</li>
          <li>To change your password, enter a new one and click Update.</li>
          <li>To delete your account, use the menu in the top right.</li>
        </ul>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Email</label>
        <input
          type="email"
          className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type="password"
          className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>
      <button
        className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
        onClick={handleUpdate}
      >
        Update Account
      </button>
      {message && (
        <p className={`mt-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
      )}
    </div>
  );
};

export default CrudPanel;
