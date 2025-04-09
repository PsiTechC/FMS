// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Loginn from "./components/Loginn";
// import AdminDashboard from "./components/AdminDashboard"; // Page with sidebar
// import ClientDashboard from "./components/ClientDashboard"; // Client landing

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Loginn />} />
//         <Route path="/dashboard" element={<AdminDashboard />} />
//         <Route path="/client-dashboard/:clientId" element={<ClientDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Loginn from "./components/Loginn";
import AdminDashboard from "./components/AdminDashboard";
import ClientDashboard from "./components/ClientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Loginn" replace />} />
        <Route path="/Loginn" element={<Loginn />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-dashboard/:clientId"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
