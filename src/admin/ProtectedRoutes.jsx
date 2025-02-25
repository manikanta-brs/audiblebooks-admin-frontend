import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar"; // Import the Navbar component

const ProtectedRoute = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  console.log(`%c Chuskovali kadha amma mari..`, "color:#00ff00"); // Debugging log

  if (!isLoggedIn) {
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
