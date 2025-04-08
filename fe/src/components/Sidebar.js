import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ isOpen }) {
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
          <Link className="nav-link text-white" to="/clients">Clients</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/">Devices</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="#">Client-Device</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="#">Logout</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
