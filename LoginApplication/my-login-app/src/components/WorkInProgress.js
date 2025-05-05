import React from "react";
import Navbar from "./Navbar";
import CrudPanel from "./CrudPanel";
import { useNavigate } from "react-router-dom";

const WorkInProgress = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8000/users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Account deleted successfully. You will be redirected to login.");
        localStorage.removeItem("access_token");
        navigate("/");
      } else {
        const data = await res.json();
        alert(data.detail || "Failed to delete account.");
      }
    } catch (err) {
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={handleLogout} onDelete={handleDeleteAccount} />
      <CrudPanel />
    </div>
  );
};

export default WorkInProgress;