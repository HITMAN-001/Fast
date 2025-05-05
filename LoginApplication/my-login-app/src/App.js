import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import Home from "./components/Home";

// Navigation Guard Component
const NavigationGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Disable browser back button
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      // If user is logged in, keep them in users page
      if (localStorage.getItem('access_token')) {
        navigate('/users', { replace: true });
      } else {
        // If user is logged out, keep them in login page
        navigate('/', { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate, location]);

  return null;
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('access_token');

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

function App() {
  useEffect(() => {
    // Clear any existing tokens on app load
    if (!window.location.pathname.includes('/users')) {
      localStorage.removeItem('access_token');
    }
  }, []);

  return (
    <Router>
      <NavigationGuard />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <UserDetail />
            </ProtectedRoute>
          }
        />
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;