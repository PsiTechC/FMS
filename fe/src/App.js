import React, { useState } from 'react';
import Sidebar from './components/Sidebar';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Menu Icon */}
      <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1050 }}>
        <button
          className="btn btn-outline-light bg-dark"
          onClick={toggleSidebar}
        >
          &#9776;
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* Clients Box - appears right of sidebar */}
      {isOpen && (
  <div
    className="position-fixed"
    style={{
      top: '100px',        // A bit more space from top
      right: '300px',      // Adjust closer to center-right
      zIndex: 1039,
    }}
  >
    <div
      className="bg-light text-dark rounded p-5 shadow-lg"
      style={{
        fontWeight: 'bold',
        fontSize: '1.8rem',
        minWidth: '300px',
        minHeight: '150px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      Clients
    </div>
  </div>
)}
      {/* Main Content */}
      <div
        className="p-4"
        style={{
          marginLeft: isOpen ? '250px' : '0',
          marginTop: '60px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        
      </div>
    </div>
  );
}

export default App;
