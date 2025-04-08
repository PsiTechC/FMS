// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
// import ClientPanel from './components/ClientPanel';

// function App() {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <Router>
//       <div>
//         {/* Menu Icon */}
//         <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1050 }}>
//           <button className="btn btn-outline-light bg-dark" onClick={toggleSidebar}>
//             &#9776;
//           </button>
//         </div>

//         {/* Sidebar */}
//         <Sidebar isOpen={isOpen} />

//         {/* Main Content Routes */}
//         <div
//           style={{
//             marginLeft: isOpen ? '250px' : '0',
//             marginTop: '60px',
//             padding: '20px',
//             transition: 'margin-left 0.3s ease',
//           }}
//         >
//           <Routes>
//             <Route path="/" element={
//               <div className="d-flex gap-4">
//                 {/* Clients Box */}
//                 <div className="bg-light text-dark rounded p-5 shadow-lg" style={{ fontWeight: 'bold', fontSize: '1.8rem', minWidth: '300px', minHeight: '150px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   Clients
//                 </div>

//                 {/* Devices Box */}
//                 <div className="bg-light text-dark rounded p-5 shadow-lg" style={{ fontWeight: 'bold', fontSize: '1.8rem', minWidth: '300px', minHeight: '150px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   Devices
//                 </div>
//               </div>
//             } />
//             <Route path="/clients" element={<ClientPanel />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginn from "./components/Loginn";
import AdminDashboard from "./components/AdminDashboard"; // Page with sidebar
import ClientDashboard from "./components/ClientDashboard"; // Client landing

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginn />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/client-dashboard/:clientId" element={<ClientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
