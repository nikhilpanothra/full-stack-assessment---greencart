import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiTruck } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Custom function for NavLink className to add active styles
  const navLinkClass = ({ isActive }) =>
    `hover:text-yellow-300 transition duration-300 ${
      isActive ? "text-yellow-400 font-bold" : ""
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block text-white font-semibold text-lg hover:text-yellow-300 transition duration-300 ${
      isActive ? "text-yellow-400 font-bold" : ""
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink
            to="/dashboard"
            className="flex items-center text-white font-extrabold text-2xl tracking-wide hover:text-yellow-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            <FiTruck className="mr-2" size={28} />
            DeliverySim
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 text-white font-semibold">
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/simulation", label: "Simulation" },
              { to: "/drivers", label: "Drivers" },
              { to: "/routes", label: "Routes" },
              { to: "/orders", label: "Orders" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Logout Button Desktop */}
          <button
            onClick={logout}
            className="hidden md:flex items-center bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-lg shadow-md font-semibold"
            title="Logout"
          >
            <FiLogOut size={20} className="mr-2" />
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-600 via-purple-700 to-pink-600 px-5 py-6 space-y-5 shadow-lg">
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/simulation", label: "Simulation" },
            { to: "/drivers", label: "Drivers" },
            { to: "/routes", label: "Routes" },
            { to: "/orders", label: "Orders" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={mobileNavLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
            className="w-full mt-3 flex items-center justify-center bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-lg font-semibold shadow-md"
          >
            <FiLogOut size={22} className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
