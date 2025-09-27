import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/upload");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100svh] mx-auto">
      <h1 className="text-2xl pb-3">Admin Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <label>
          Username:
          <input
            className="border-2 border-blue-800 rounded w-full p-1"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          Password:
          <input
            className="border-2 border-blue-800 rounded w-full p-1"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          className="mx-auto rounded p-2 bg-gray-300 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="error text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default AdminLogin;
