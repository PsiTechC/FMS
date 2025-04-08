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



// components/AdminDashboard.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";

function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(true); // Sidebar open by default

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Menu Icon */}
      <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1050 }}>
        <button className="btn btn-outline-light bg-dark" onClick={toggleSidebar}>
          &#9776;
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* Clients + Devices Boxes */}
      <div
        className="position-fixed d-flex gap-4"
        style={{
          top: "100px",
          left: isOpen ? "300px" : "100px",
          transition: "left 0.5s ease",
          zIndex: 1039,
        }}
      >
        <div
          className="bg-light text-dark rounded p-5 shadow-lg"
          style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            minWidth: "300px",
            minHeight: "150px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Clients
        </div>

        <div
          className="bg-light text-dark rounded p-5 shadow-lg"
          style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            minWidth: "300px",
            minHeight: "150px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Devices
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
