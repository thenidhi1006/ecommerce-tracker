import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

const res = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token); // 🔑 THIS IS CRITICAL
      navigate("/");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
  <div>
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>

    {/* 👇 ADD THIS BELOW THE FORM */}
    <p style={{ marginTop: "10px" }}>
      Don't have an account?{" "}
      <span
        onClick={() => navigate("/register")}
        style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
      >
        Register here
      </span>
    </p>
  </div>
);
}

export default Login;
