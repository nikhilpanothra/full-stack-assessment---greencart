import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: "+"User not Found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-200 to-pink-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-10 space-y-8
          border border-gray-200
          transform transition duration-500 hover:scale-[1.02]"
      >
        <h2 className="text-4xl font-extrabold text-center text-gray-900 tracking-wide drop-shadow-md">
          Manager Login
        </h2>

        <div className="space-y-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none
              focus:ring-4 focus:ring-purple-400 focus:border-purple-600
              transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none
              focus:ring-4 focus:ring-purple-400 focus:border-purple-600
              transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-bold
            bg-gradient-to-r from-purple-600 via-pink-600 to-red-500
            hover:from-pink-600 hover:via-red-600 hover:to-purple-600
            shadow-lg transition duration-300
            flex justify-center items-center
            ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {loading ? (
            <svg
              className="animate-spin h-6 w-6 text-white mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : null}
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-600 font-medium">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-600 font-semibold hover:text-purple-800 underline transition"
          >
            Signup here
          </Link>
        </p>
      </form>
    </div>
  );
}
