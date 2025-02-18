import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar"; // Import the Navbar component

const ProtectedRoute = () => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar /> {/* Render the Navbar component */}
      <Outlet /> {/* Render the child routes */}
    </>
  );
};

export default ProtectedRoute;
