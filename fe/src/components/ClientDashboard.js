import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import WaterLevelChart from "./WaterLevelChart";

function ClientDashboard() {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("auth");
    Cookies.remove("clientId");
    navigate("/"); // back to login
  };

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/clients`);
        const data = res.data.find((c) => c._id === clientId);
        setClient(data);
      } catch (err) {
        console.error("Failed to load client info", err);
      }
    };

    fetchClient();
  }, [clientId]);

  if (!client) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Welcome, {client.username}</h2>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <p>Email: {client.email}</p>
      <p>Phone: {client.phone}</p>

      {/* ✅ Water Level Graph goes here */}
      <div className="mt-5">
        <WaterLevelChart deviceId="Device0" />
      </div>
    </div>
  );
}

export default ClientDashboard;
