// src/components/AdminDashboard.js
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";

// import ClientPanel from "./ClientPanel";
// import DevicePanel from "./DevicePanel";
// import MappingPanel from "./MappingPanel";

// function AdminDashboard() {
//   const navigate = useNavigate();
//   const [clients, setClients] = useState([]);
//   const [devices, setDevices] = useState([]);
//   const [mappings, setMappings] = useState([]);

//   const fetchClients = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/clients");
//       setClients(res.data);
//     } catch (error) {
//       console.error("Error fetching clients:", error);
//     }
//   };

//   const fetchDevices = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/devices");
//       setDevices(res.data);
//     } catch (error) {
//       console.error("Error fetching devices:", error);
//     }
//   };

//   const fetchMappings = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/mappings");
//       setMappings(res.data);
//     } catch (error) {
//       console.error("Error fetching mappings:", error);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//     fetchDevices();
//     fetchMappings();
//   }, []);

//   const handleLogout = () => {
//     Cookies.remove("auth");
//     Cookies.remove("clientId");
//     navigate("/Loginn"); // redirect to login page
//   };

//   return (
//     <div className="container mt-4" style={{ paddingLeft: 30, paddingRight: 30, maxWidth: "100%" }}>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h1 className="mb-0">Admin Dashboard</h1>
//         <button className="btn btn-danger btn-sm" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>

//       <div className="row">
//         {/* Clients Panel */}
//         <div className="col-md-3">
//           <ClientPanel clients={clients} fetchClients={fetchClients} />
//         </div>

//         {/* Devices Panel */}
//         <div className="col-md-3">
//           <DevicePanel devices={devices} fetchDevices={fetchDevices} />
//         </div>

//         {/* Mapping Panel */}
//         <div className="col-md-6">
//           <MappingPanel
//             clients={clients}
//             devices={devices}
//             mappings={mappings}
//             fetchMappings={fetchMappings}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;


// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";

// function AdminDashboard() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     Cookies.remove("auth");
//     Cookies.remove("clientId");
//     navigate("/Loginn"); // redirect to login page
//   };

//   const [showModal, setShowModal] = useState(false);

//   // Input states
//   const [clientUsername, setClientUsername] = useState("");
//   const [clientEmail, setClientEmail] = useState("");
//   const [building, setBuilding] = useState("");
//   const [city, setCity] = useState("");
//   const [stateInput, setStateInput] = useState("");
//   const [country, setCountry] = useState("");
//   const [phone, setPhone] = useState("");

//   const [showDeviceModal, setShowDeviceModal] = useState(false);
  
//   const [deviceName, setDeviceName] = useState("");
//   const [deviceDescription, setDeviceDescription] = useState("");
//   const [devices, setDevices] = useState([]);

//   const openDeviceModal = () => setShowDeviceModal(true);
//   const closeDeviceModal = () => setShowDeviceModal(false);
//   const [showClientDropdown, setShowClientDropdown] = useState(false);

//   // Error state
//   const [errors, setErrors] = useState({});

//   const openModal = () => setShowModal(true);
//   const closeModal = () => setShowModal(false);

//   const [clients, setClients] = useState([]);
//   const [selectedDevice, setSelectedDevice] = useState("");
//   const [selectedClients, setSelectedClients] = useState([]);

//   const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
//   const [selectedDevices, setSelectedDevices] = useState([]);
//   const [mappings, setMappings] = useState([]);

//   const fetchMappings = async () => {
//   try {
//     const res = await axios.get("http://localhost:5000/api/mappings");
//     setMappings(res.data);
//   } catch (error) {
//     console.error("Error fetching mappings:", error);
//   }
// };

// // Call it on component mount
// useEffect(() => {
//   fetchClients();
//   fetchDevices(); // if you have this
//   fetchMappings(); // Fetch initial mappings
// }, []);



// const handleMapDevice = async () => {
//   try {
//     await axios.post("http://localhost:5000/api/map-devices", {
//       selectedClients,
//       selectedDevices
//     });

//     console.log("Selected Clients:", selectedClients);
//     console.log("Selected Devices:", selectedDevices);

//     alert("Mapping successful!");

//     // 🔄 Fetch updated mappings
//     fetchMappings();

//     // ✅ Optionally clear selection
//     setSelectedClients([]);
//     setSelectedDevices([]);

//   } catch (error) {
//     console.error("Error mapping devices:", error.response?.data || error.message);
//     alert("Mapping failed");
//   }
// };

// const toggleDeviceSelection = (deviceId) => {
//   setSelectedDevices((prev) =>
//     prev.includes(deviceId)
//       ? prev.filter((id) => id !== deviceId)
//       : [...prev, deviceId]
//   );
// };


// const toggleClientSelection = (clientId) => {
//   setSelectedClients((prev) =>
//     prev.includes(clientId)
//       ? prev.filter((id) => id !== clientId)
//       : [...prev, clientId]
//   );
// };

//   const fetchDevices = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/devices");
//       setDevices(res.data);
//     } catch (error) {
//       console.error("Error fetching devices:", error);
//     }
//   };
  
//   const fetchClients = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/clients");
//       setClients(res.data);
//     } catch (error) {
//       console.error("Error fetching clients:", error);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//     fetchDevices();
//     fetchMappings();
//   }, []);

//   const validate = () => {
//     const errors = {};
//     if (!clientUsername.trim()) errors.username = "Username is required";
//     if (!clientEmail.trim()) {
//       errors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(clientEmail)) {
//       errors.email = "Email is invalid";
//     }
//     if (!phone.trim()) {
//       errors.phone = "Phone number is required";
//     } else if (!/^\d{10}$/.test(phone)) {
//       errors.phone = "Phone number must be 10 digits";
//     }
//     return errors;
//   };

//   const handleSaveDevice = async () => {
//     const deviceData = {
//       name: deviceName,
//       description: deviceDescription,
//     };
  
//     try {
//       await axios.post("http://localhost:5000/api/devices", deviceData);
//       console.log("Device saved successfully");
  
//       fetchDevices(); // 🔄 refresh list
  
//       setDeviceName("");
//       setDeviceDescription("");
//       closeDeviceModal();
//     } catch (error) {
//       console.error("Error saving device:", error);
//     }
//   };

//   const handleSaveChanges = async () => {
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
  
//     setErrors({});

//     const clientData = {
//       username: clientUsername,
//       email: clientEmail,
//       address: {
//         building,
//         city,
//         state: stateInput,
//         country,
//       },
//       phone,
//     };
  
//     try {
//       const res = await axios.post("http://localhost:5000/api/clients", clientData);
//       console.log("Client saved successfully:", res.data);
  
//       fetchClients();  // <-- This line makes the list refresh immediately
  
//       setClientUsername("");
//       setClientEmail("");
//       setBuilding("");
//       setCity("");
//       setStateInput("");
//       setCountry("");
//       setPhone("");
//       closeModal();
//     } catch (error) {
//       console.error("Error saving client:", error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <div className="container mt-4" style={{ paddingLeft: 30, paddingRight: 30, maxWidth: "100%" }}>

//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h1 className="mb-0">Admin Dashboard</h1>
//         <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
//       </div>

//       {/* Clients Panel (Always Visible) */}
//       <div className="row">
//     {/* Clients Panel */}
//         <div className="col-md-3">
//           <div className="card shadow-sm p-3 mb-3">
//             <h5>Clients Panel</h5>
//             <button className="btn btn-success btn-sm mt-2" onClick={openModal}>
//               Add User
//             </button>
//             <ul className="mt-3 list-group">
//               {clients.map((client) => (
//                 <li key={client._id} className="list-group-item">
//               {client.username}
//                </li>
//             ))}
//             </ul>
//           </div>
//         </div>

//     {/* Devices Panel */}
//         <div className="col-md-3">
//           <div className="card shadow-sm p-3 mb-3">
//             <h5>Device Panel</h5>
//             <button className="btn btn-success btn-sm mt-2" onClick={openDeviceModal}>
//               Add Device
//             </button>
//             <ul className="mt-3 list-group">
//               {devices.map((device) => (
//                 <li key={device._id} className="list-group-item">
//                   {device.name}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//     {/* Mapping Panel */}
//     <div className="col-md-6">
//     <div className="card shadow-sm p-3 mb-3">
//   <h5>Client-Device Mapping</h5>

//   {/* Row with two columns for dropdowns */}
//   <div className="row mb-3">
    
//     {/* Clients Dropdown */}
//     <div className="col-md-6">
//       <label className="form-label">Select Clients</label>
//       <div className="dropdown">
//         <button
//           className="btn btn-outline-secondary w-100 text-start"
//           type="button"
//           onClick={() => setShowClientDropdown(!showClientDropdown)}
//         >
//           {selectedClients.length > 0
//             ? `${selectedClients.length} client(s) selected`
//             : "Select Clients"}
//         </button>

//         {showClientDropdown && (
//           <ul
//             className="dropdown-menu show w-100 p-2"
//             style={{ maxHeight: "200px", overflowY: "auto" }}
//           >
//             {clients.map((client) => (
//               <li key={client._id} className="form-check mb-1">
//                 <input
//                   className="form-check-input me-2"
//                   type="checkbox"
//                   checked={selectedClients.includes(client._id)}
//                   onChange={() => toggleClientSelection(client._id)}
//                   id={`client-${client._id}`}
//                 />
//                 <label className="form-check-label" htmlFor={`client-${client._id}`}>
//                   {client.username}
//                 </label>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>

//     {/* Devices Dropdown */}
//     <div className="col-md-6">
//       <label className="form-label">Select Devices</label>
//       <div className="dropdown">
//         <button
//           className="btn btn-outline-secondary w-100 text-start"
//           type="button"
//           onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
//         >
//           {selectedDevices.length > 0
//             ? `${selectedDevices.length} device(s) selected`
//             : "Select Devices"}
//         </button>

//         {showDeviceDropdown && (
//           <ul
//             className="dropdown-menu show w-100 p-2"
//             style={{ maxHeight: "200px", overflowY: "auto" }}
//           >
//             {devices.map((device) => (
//               <li key={device._id} className="form-check mb-1">
//                 <input
//                   className="form-check-input me-2"
//                   type="checkbox"
//                   checked={selectedDevices.includes(device._id)}
//                   onChange={() => toggleDeviceSelection(device._id)}
//                   id={`device-${device._id}`}
//                 />
//                 <label className="form-check-label" htmlFor={`device-${device._id}`}>
//                   {device.name}
//                 </label>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>

//   </div>
//   <div className="mt-3">
//   <h6>Mapped Clients & Devices</h6>
//   <ul className="list-group">
//     {mappings.map((map) => (
//       <li key={map._id} className="list-group-item">
//         <strong>{map.clientId?.username}</strong> → {map.deviceId?.name}
//       </li>
//     ))}
//   </ul>
// </div>


//   {/* Map Button */}
//   <button className="btn btn-warning btn-sm mt-2" onClick={handleMapDevice}>
//     Map Device
//   </button>
// </div>
//     </div>
//   </div>

// {showDeviceModal && (
//   <>
//     <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
//       <div className="modal-dialog">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Add Device</h5>
//             <button type="button" className="btn-close" onClick={closeDeviceModal}></button>
//           </div>
//           <div className="modal-body">
//             <form>
              
//               <div className="mb-3">
//                 <label className="form-label">Device Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Enter Device Name"
//                   value={deviceName}
//                   onChange={(e) => setDeviceName(e.target.value)}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Description</label>
//                 <textarea
//                   className="form-control"
//                   placeholder="Enter Description"
//                   rows="3"
//                   value={deviceDescription}
//                   onChange={(e) => setDeviceDescription(e.target.value)}
//                 ></textarea>
//               </div>
//             </form>
//           </div>
//           <div className="modal-footer">
//             <button type="button" className="btn btn-secondary btn-sm" onClick={closeDeviceModal}>
//               Close
//             </button>
//             <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveDevice}>
//               Save Device
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="modal-backdrop fade show"></div>
//   </>
// )}

//       {/* Modal for Add User */}
//       {showModal && (
//         <>
//           <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Add User</h5>
//                   <button type="button" className="btn-close" onClick={closeModal}></button>
//                 </div>
//                 <div className="modal-body">
//                   <form>
//                     {/* Username */}
//                     <div className="mb-3">
//                       <label className="form-label">Username</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Username"
//                         value={clientUsername}
//                         onChange={(e) => setClientUsername(e.target.value)}
//                       />
//                       {errors.username && <div className="text-danger small">{errors.username}</div>}
//                     </div>

//                     {/* Email */}
//                     <div className="mb-3">
//                       <label className="form-label">Email</label>
//                       <input
//                         type="email"
//                         className="form-control"
//                         placeholder="Email"
//                         value={clientEmail}
//                         onChange={(e) => setClientEmail(e.target.value)}
//                       />
//                       {errors.email && <div className="text-danger small">{errors.email}</div>}
//                     </div>

//                     {/* Address */}
//                     <div className="mb-3">
//                       <label className="form-label">Address</label>
//                       <div className="row g-2">
//                         <div className="col">
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Building"
//                             value={building}
//                             onChange={(e) => setBuilding(e.target.value)}
//                           />
//                         </div>
//                         <div className="col">
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="City"
//                             value={city}
//                             onChange={(e) => setCity(e.target.value)}
//                           />
//                         </div>
//                         <div className="col">
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="State"
//                             value={stateInput}
//                             onChange={(e) => setStateInput(e.target.value)}
//                           />
//                         </div>
//                         <div className="col">
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Country"
//                             value={country}
//                             onChange={(e) => setCountry(e.target.value)}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Phone */}
//                     <div className="mb-3">
//                       <label className="form-label">Phone</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Phone"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                       />
//                       {errors.phone && <div className="text-danger small">{errors.phone}</div>}
//                     </div>
//                   </form>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary btn-sm" onClick={closeModal}>
//                     Close
//                   </button>
//                   <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveChanges}>
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="modal-backdrop fade show"></div>
//         </>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;

//components/AdminDashboard.js
// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import ClientPanel from "./ClientPanel"; // the panel you want to show

// function AdminDashboard() {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [isOpen, setIsOpen] = useState(true);
//   const [activePanel, setActivePanel] = useState("dashboard");

//   const toggleSidebar = () => setIsOpen(!isOpen);
//   const toggleDropdown = () => setShowDropdown(!showDropdown);

//   return (
//     <div>
//       {/* Menu Icon */}
//       <div
//       className="position-fixed top-0 start-0 w-100 px-4 py-2 bg-dark text-white d-flex justify-content-between align-items-center"
//       style={{ zIndex: 1050, height: "60px" }}
//     >
//       {/* Menu Icon */}
//       <button className="btn btn-outline-light bg-dark border-0" onClick={toggleSidebar}>
//         &#9776;
//       </button>

//       {/* Admin Info */}
//       <div className="d-flex align-items-center gap-2">
//         <img
//           src="https://i.pravatar.cc/40?img=5"
//           alt="Admin"
//           className="rounded-circle"
//           style={{ width: "40px", height: "40px", objectFit: "cover" }}
//         />
//         <span style={{ fontWeight: "bold" }}>Jane Doe</span>
//         <span className="ms-1">&#9662;</span>
//       </div>
//     </div>


      

//       {/* Sidebar */}
//       <Sidebar isOpen={isOpen} setActivePanel={setActivePanel} />

//       {/* Dynamic Content */}
//       <div
//         className="position-absolute"
//         style={{
//           top: "100px",
//           left: isOpen ? "300px" : "100px",
//           transition: "left 0.5s ease",
//           padding: "20px",
//         }}
//       >
//         {activePanel === "dashboard" && (
//           <div className="d-flex gap-4">
//             <div className="bg-light text-dark rounded p-5 shadow-lg" style={{ minWidth: "300px", minHeight: "150px", fontWeight: "bold", fontSize: "1.8rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
//               Clients
//             </div>
//             <div className="bg-light text-dark rounded p-5 shadow-lg" style={{ minWidth: "300px", minHeight: "150px", fontWeight: "bold", fontSize: "1.8rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
//               Devices
//             </div>
//           </div>
//         )}

//         {activePanel === "clients" && <ClientPanel />}
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;


// src/components/AdminDashboard.js
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import ClientPanel from "./ClientPanel";
import DevicePanel from "./DevicePanel";
import MappingPanel from "./MappingPanel";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [activePanel, setActivePanel] = useState("dashboard");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const [clients, setClients] = useState([]);
  const [devices, setDevices] = useState([]);
  const [mappings, setMappings] = useState([]);

  // New state declarations for selection toggles
const [selectedClientSummary, setSelectedClientSummary] = useState(false);
const [selectedTotalDevices, setSelectedTotalDevices] = useState(false);
const [selectedEnabledDevices, setSelectedEnabledDevices] = useState(false);
const [selectedActiveDevices, setSelectedActiveDevices] = useState(false);
const [selectedFaultyDevices, setSelectedFaultyDevices] = useState(false);

const navigate = useNavigate();

const handleLogout = () => {
  Cookies.remove("auth");        // Remove auth token or flags
  Cookies.remove("clientId");    // If you store clientId or session info
  navigate("/");                 // Navigate to login page ("/" or "/login" as per your route)
};


  // Fetch data
  const fetchMappings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/mappings");
      setMappings(res.data);
    } catch (error) {
      console.error("Error fetching mappings:", error);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/devices");
      setDevices(res.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clients");
      setClients(res.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchDevices();
    fetchMappings();
  }, []);

  // Sidebar toggles
  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate device summaries
  const totalDevices = devices.length;
  const enabledDevices = devices.filter((d) => d.isEnabled).length;
  const activeDevices = devices.filter((d) => d.isActive).length;
  const faultyDevices = devices.filter((d) => d.isFaulty).length;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Top Bar */}
      <div
        className="position-fixed top-0 start-0 w-100 px-4 py-2 bg-light d-flex justify-content-between align-items-center"
        style={{ zIndex: 1050, height: "60px", borderBottom: "1px solid #ccc" }}
      >
        <button
          className="btn btn-outline-light bg-dark border-0"
          onClick={toggleSidebar}
        >
          &#9776;
        </button>

        <div className="d-flex align-items-center gap-3">
          <img
            src="/EulerianBots.jpeg"
            alt="Eulerian Bots Logo"
            className="position-absolute"
            style={{
              left: "80px",
              top: "50%",
              transform: "translateY(-50%)",
              height: "40px",
              objectFit: "contain",
              zIndex: 1051,
            }}
          />
          <img
            src="/FiverLogo.png"
            alt="Eulerian Bots Logo"
            style={{ height: "40px", objectFit: "contain", marginLeft: "1275px" }}
          />
        </div>

        {/* Profile Dropdown */}
        <div className="position-relative" ref={dropdownRef}>
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontWeight: "bold", color: "black" }}>Pikachu</span>
            <button
              className="btn btn-sm btn-light border"
              onClick={toggleDropdown}
              style={{ lineHeight: "1", padding: "4px 6px" }}
            >
              &#9662;
            </button>
          </div>
          {showDropdown && (
            <div
              className="position-absolute bg-white border shadow rounded mt-2"
              style={{ right: 0, top: "100%", minWidth: "160px", zIndex: 2000 }}
            >
              <ul className="list-unstyled mb-0" style={{ margin: 0 }}>
                
                <li>
                  <button
                    className="dropdown-item"
                    style={{
                      padding: "6px 12px",
                      fontSize: "0.95rem",
                      lineHeight: "1.4",
                      color: "black",
                    }}
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider my-1" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    style={{
                      padding: "6px 12px",
                      fontSize: "0.95rem",
                      fontWeight: "bold",
                      lineHeight: "1.4",
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "60px", // the height of the top bar
        }}
      >
        {/* SIDEBAR */}
        <div
          style={{
            width: isOpen ? "250px" : "0px",
            transition: "width 0.5s ease",
            overflow: "hidden",
          }}
        >
          <Sidebar isOpen={isOpen} setActivePanel={setActivePanel} />
        </div>

        {/* MAIN CONTENT */}
        <div
          style={{
            flex: 1, // take remaining horizontal space
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // centers all content horizontally
            padding: "20px",
          }}
        >
          {/* Dashboard view */}
          {activePanel === "dashboard" && (
  <>
    <div className="d-flex gap-4 mb-4">
      {/* Clients Box */}
      <div
        className="bg-light text-dark rounded p-5 shadow-lg"
        style={{
          fontWeight: "bold",
          fontSize: "1.8rem",
          minWidth: "300px",
          minHeight: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
        }}
      >
        Clients
        <div
          onClick={() =>
            setSelectedClientSummary((prevSelected) => !prevSelected)
          }
          className="rounded mt-3 p-2"
          style={{
            fontSize: "1.2rem",
            width: "100%",
            textAlign: "center",
            cursor: "pointer",
            borderRadius: "10px",
            backgroundColor: selectedClientSummary ? "#0d6efd" : "white",
            color: selectedClientSummary ? "white" : "black",
            border: selectedClientSummary ? "2px solid #0d6efd" : "1px solid #ccc",
            transition: "all 0.3s ease",
          }}
          title="Click to select this summary"
        >
          Total: {clients.length}
        </div>
      </div>

      {/* Devices Box */}
      <div
        className="bg-light text-dark rounded p-5 shadow-lg"
        style={{
          fontWeight: "bold",
          fontSize: "1.8rem",
          minWidth: "300px",
          minHeight: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
        }}
      >
        Devices
        <div
          className="d-flex flex-wrap gap-2 mt-3"
          style={{ justifyContent: "center" }}
        >
          {/* Total Devices */}
          <div
            onClick={() =>
              setSelectedTotalDevices((prevSelected) => !prevSelected)
            }
            className="rounded p-2"
            style={{
              fontSize: "1.1rem",
              width: "140px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: selectedTotalDevices ? "#0d6efd" : "white",
              color: selectedTotalDevices ? "white" : "black",
              border: selectedTotalDevices ? "2px solid #0d6efd" : "1px solid #ccc",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}
            title="Click to select this summary"
          >
            Total: {devices.length}
          </div>
          {/* Enabled Devices */}
          <div
            onClick={() =>
              setSelectedEnabledDevices((prevSelected) => !prevSelected)
            }
            className="rounded p-2"
            style={{
              fontSize: "1.1rem",
              width: "140px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: selectedEnabledDevices ? "#0d6efd" : "white",
              color: selectedEnabledDevices ? "white" : "black",
              border: selectedEnabledDevices ? "2px solid #0d6efd" : "1px solid #ccc",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}
            title="Click to select this summary"
          >
            Enabled: {devices.filter((d) => d.isEnabled).length}
          </div>
          {/* Active Devices */}
          <div
            onClick={() =>
              setSelectedActiveDevices((prevSelected) => !prevSelected)
            }
            className="rounded p-2"
            style={{
              fontSize: "1.1rem",
              width: "140px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: selectedActiveDevices ? "#0d6efd" : "white",
              color: selectedActiveDevices ? "white" : "black",
              border: selectedActiveDevices ? "2px solid #0d6efd" : "1px solid #ccc",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}
            title="Click to select this summary"
          >
            Active: {devices.filter((d) => d.isActive).length}
          </div>
          {/* Faulty Devices */}
          <div
            onClick={() =>
              setSelectedFaultyDevices((prevSelected) => !prevSelected)
            }
            className="rounded p-2"
            style={{
              fontSize: "1.1rem",
              width: "140px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: selectedFaultyDevices ? "#0d6efd" : "white",
              color: selectedFaultyDevices ? "white" : "black",
              border: selectedFaultyDevices ? "2px solid #0d6efd" : "1px solid #ccc",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}
            title="Click to select this summary"
          >
            Faulty: {devices.filter((d) => d.isFaulty).length}
          </div>
        </div>
      </div>
    </div>
  </>
)}



          {activePanel === "clients" && (
            <ClientPanel clients={clients} fetchClients={fetchClients} />
          )}

          {activePanel === "devices" && (
            <DevicePanel devices={devices} fetchDevices={fetchDevices} />
          )}

          {activePanel === "deviceMapping" && (
            <MappingPanel
              clients={clients}
              devices={devices}
              mappings={mappings}
              fetchMappings={fetchMappings}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;





