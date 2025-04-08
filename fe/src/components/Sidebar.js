import React from 'react';

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
        <div>
        <h4 className="mb-4">Menu</h4>
    <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link text-white" href="#">Clients</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#">Devices</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#">Client-Device</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="#">Logout</a>
        </li>
    </ul>
        </div>
    </div> 
  );
}

export default Sidebar;

