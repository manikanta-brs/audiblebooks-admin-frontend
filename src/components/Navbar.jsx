import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="col-span-5 bg-gray-800 text-white py-2 px-6 flex justify-between items-center h-16">
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-lg font-medium whitespace-nowrap">
          Welcome, {userData?.name}
        </span>
        <span className="text-gray-300 text-sm whitespace-nowrap">
          ({userData?.email})
        </span>
        <button
          className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
