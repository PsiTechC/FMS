import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
const REACT_FE= process.env.REACT_APP_FE_BASE;

function Loginn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(
        `${REACT_FE}/api/login`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (res.status === 200) {
        const { token, role, clientId, username } = res.data;
  
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);
        if (role === "client") {
          localStorage.setItem("clientId", clientId);
        }
  
        Cookies.set("auth", role, { expires: 1 });
  
        if (role === "admin") {
          navigate("/dashboard");
        } else if (role === "client") {
          navigate(`/client-dashboard/${clientId}`);
        }
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };
  
  
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ minWidth: "350px", maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Login to FMS</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username or Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3 text-muted text-center" style={{ fontSize: "0.875rem" }}>
          © {new Date().getFullYear()} FMS System
        </p>
      </div>
    </div>
  );
}

export default Loginn;
