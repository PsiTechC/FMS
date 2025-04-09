import React from 'react';

function Sidebar({ isOpen, setActivePanel }) {
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
      <li className="nav-item">
          <button className="nav-link text-white btn btn-link" onClick={() => setActivePanel("dashboard")}>
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-white btn btn-link" onClick={() => setActivePanel("clients")}>
            Clients
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link text-white btn btn-link" onClick={() => setActivePanel("devices")}>
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
