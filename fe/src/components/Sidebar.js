import React from 'react';
import axios from "axios";


function Sidebar({ isOpen, setActivePanel, setNextDeviceID }) {

  const handleDevicesClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/devices/next-device-id", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNextDeviceID(res.data.deviceID);
    } catch (error) {
      console.error("Failed to fetch next device ID", error);
    }

    setActivePanel("devices");
  };

  return (
    <div
      className="bg-dark text-white position-fixed start-0 p-4 shadow"
      style={{
        width: '250px',
        top: '60px',
        bottom: 0,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        zIndex: 1040,
      }}
    >
      <h4 className="mb-4">Menu</h4>
      <ul className="nav flex-column">
      <li className="nav-item ">
          <button className="nav-link text-white btn btn-link d-flex align-items-center gap-3" onClick={() => setActivePanel("dashboard")} style={{ paddingLeft: 0 }}>
          <img
              src="/gaugew.svg"
              alt="Gauge Icon"
              style={{ width: "14px", height: "14px", objectFit: "contain" }}
            />
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-white btn btn-link d-flex align-items-center gap-3" onClick={() => setActivePanel("clients")} style={{ paddingLeft: 0 }}>
          <img
              src="/userw.svg"
              alt="User Icon"
              style={{ width: "14px", height: "14px", objectFit: "contain" }}
            />
            Clients
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-white btn btn-link d-flex align-items-center gap-3" onClick={() => setActivePanel("devices")} style={{ paddingLeft: 0 }}>
          <img
              src="/Satelite_dish.svg"
              alt="Satellite Dish"
              style={{ width: "14px", height: "14px", objectFit: "contain" }}
            />
            Devices
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-white btn btn-link" onClick={() => setActivePanel("deviceMapping")}>
            Device-Mapping
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-white btn btn-link" onClick={() => setActivePanel("clients")}>
            Support
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
