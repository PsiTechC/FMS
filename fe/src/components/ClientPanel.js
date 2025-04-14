// // src/components/ClientPanel.js
// import React, { useState } from "react";
// import axios from "axios";

// function ClientPanel({ clients, fetchClients }) {
//   const [showModal, setShowModal] = useState(false);

//   // Input states for new client
//   const [clientUsername, setClientUsername] = useState("");
//   const [clientEmail, setClientEmail] = useState("");
//   const [building, setBuilding] = useState("");
//   const [city, setCity] = useState("");
//   const [stateInput, setStateInput] = useState("");
//   const [country, setCountry] = useState("");
//   const [phone, setPhone] = useState("");

//   // Error state
//   const [errors, setErrors] = useState({});

//   const openModal = () => setShowModal(true);
//   const closeModal = () => setShowModal(false);

//   // Validate form fields
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
//       await axios.post("http://localhost:5000/api/clients", clientData);
//       console.log("Client saved successfully");

//       // Refresh clients list
//       fetchClients();

//       // Clear fields and close the modal
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
//     <div className="card shadow-sm p-3 mb-3">
//       <h5>Clients Panel</h5>
//       <button className="btn btn-success btn-sm mt-2" onClick={openModal}>
//         Add User
//       </button>
//       <ul className="mt-3 list-group">
//         {clients.map((client) => (
//           <li key={client._id} className="list-group-item">
//             {client.username}
//           </li>
//         ))}
//       </ul>

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

// export default ClientPanel;

//--------------------------------------------------------------------------------------------------

// import React, { useState } from "react";
// import axios from "axios";

// function ClientPanel({ clients, fetchClients }) {
//   const [showModal, setShowModal] = useState(false);

//   // Input states for new client
//   const [clientUsername, setClientUsername] = useState("");
//   const [clientEmail, setClientEmail] = useState("");
//   const [building, setBuilding] = useState("");
//   const [city, setCity] = useState("");
//   const [stateInput, setStateInput] = useState("");
//   const [country, setCountry] = useState("");
//   const [phone, setPhone] = useState("");

//   // Error state
//   const [errors, setErrors] = useState({});

//   const openModal = () => setShowModal(true);
//   const closeModal = () => setShowModal(false);

//   // Validate form fields
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
//       await axios.post("http://localhost:5000/api/clients", clientData);
//       console.log("Client saved successfully");

//       // Refresh clients list
//       fetchClients();

//       // Clear fields and close the modal
//       setClientUsername("");
//       setClientEmail("");
//       setBuilding("");
//       setCity("");
//       setStateInput("");
//       setCountry("");
//       setPhone("");
//       closeModal();
//     } catch (error) {
//       console.error(
//         "Error saving client:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   return (
//     <div className="card shadow-sm p-3 mb-3">
//       <div className="d-flex justify-content-between align-items-center">
//         <h5>Clients Panel</h5>
//         {/* Button with "+" symbol to add a new user */}
//         <button className="btn btn-success btn-sm" onClick={openModal}>
//           +
//         </button>
//       </div>

//       {/* Client Data Table */}
//       <div className="table-responsive mt-3">
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>Username</th>
//               <th>MailId</th>
//               <th>Address (Building, City, State, Country)</th>
//               <th>Phone Number</th>
//             </tr>
//           </thead>
//           <tbody>
//             {clients && clients.length > 0 ? (
//               clients.map((client) => (
//                 <tr key={client._id}>
//                   <td>{client.username}</td>
//                   <td>{client.email}</td>
//                   <td>
//                     {client.address
//                       ? `${client.address.building}, ${client.address.city}, ${client.address.state}, ${client.address.country}`
//                       : ""}
//                   </td>
//                   <td>{client.phone}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center">
//                   No clients found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal for Add User */}
//       {showModal && (
//         <>
//           <div
//             className="modal fade show"
//             style={{ display: "block" }}
//             tabIndex="-1"
//           >
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Add User</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={closeModal}
//                   ></button>
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
//                       {errors.username && (
//                         <div className="text-danger small">
//                           {errors.username}
//                         </div>
//                       )}
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
//                       {errors.email && (
//                         <div className="text-danger small">
//                           {errors.email}
//                         </div>
//                       )}
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
//                       {errors.phone && (
//                         <div className="text-danger small">
//                           {errors.phone}
//                         </div>
//                       )}
//                     </div>
//                   </form>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary btn-sm"
//                     onClick={closeModal}
//                   >
//                     Close
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary btn-sm"
//                     onClick={handleSaveChanges}
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Backdrop */}
//           <div className="modal-backdrop fade show"></div>
//         </>
//       )}
//     </div>
//   );
// }

// export default ClientPanel;

// src/components/ClientPanel.js
// src/components/ClientPanel.js
import React, { useState } from "react";
import axios from "axios";

function ClientPanel({ clients, fetchClients }) {
  const [showModal, setShowModal] = useState(false);

  // Input states for new client
  const [clientUsername, setClientUsername] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [building, setBuilding] = useState("");
  const [city, setCity] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Error state
  const [errors, setErrors] = useState({});

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);



  // Validate form fields
  const validate = () => {
    const errors = {};
    if (!clientUsername.trim()) errors.username = "Username is required";
    if (!clientEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(clientEmail)) {
      errors.email = "Email is invalid";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    return errors;
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const clientData = {
      username: clientUsername,
      email: clientEmail,
      address: {
        building,
        city,
        state: stateInput,
        country,
      },
      phone,
    };

    try {
      // await axios.post("http://localhost:5000/api/clients", clientData);
      const token = localStorage.getItem("token");
await axios.post("http://localhost:5000/api/clients", clientData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      console.log("Client saved successfully");
      // Refresh clients list
      fetchClients();
      // Clear fields and close the modal
      setClientUsername("");
      setClientEmail("");
      setBuilding("");
      setCity("");
      setStateInput("");
      setCountry("");
      setPhone("");
      closeModal();
    } catch (error) {
      console.error("Error saving client:", error.response ? error.response.data : error.message);
    }
    setLoading(false);
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
  
    try {
      // await axios.delete(`http://localhost:5000/api/clients/${id}`);
      const token = localStorage.getItem("token");
await axios.delete(`http://localhost:5000/api/clients/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      console.log("Client deleted");
  
      // Remove client from local state
      fetchClients(); // ✅ re-fetch clients OR filter locally
    } catch (error) {
      console.error("Failed to delete client:", error.response?.data || error.message);
      alert("Failed to delete client.");
    }
  };
  
  return (
    <div
      className="card shadow-sm p-3 mb-3"
      style={{ width: "1200px" }}  // Increased width
    >
      {/* Header and description for a welcoming, fulfilling tone */}
      <div className="mb-3">
        <h5 className="mb-1">Clients Panel</h5>
        <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
          Here you can view and add your clients. We value your clientele!
        </p>
      </div>

      {/* Button with "+" symbol for adding a new client */}
      <div className="text-end mb-2">
      <button
          className="btn btn-success btn-sm"
          style={{ width: "80px", fontSize: "1.2rem" }}
          onClick={openModal}
          title="Add new device"
        >
          +
        </button>
      </div>

      {/* Client Data Table */}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Username</th>
              <th>MailId</th>
              <th>Address</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {clients && clients.length > 0 ? (
                clients.map((client) => (
                <tr key={client._id}>
                    <td>{client.username}</td>
                    <td>{client.email}</td>
                    <td>
                    {client.address
                        ? `${client.address.building}, ${client.address.city}, ${client.address.state}, ${client.address.country}`
                        : "N/A"}
                    </td>
                    <td>{client.phone}</td>
                    <td>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClient(client._id)}
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="5" className="text-center">
                    No clients added.
                </td>
                </tr>
            )}
            </tbody>
        </table>
      </div>

      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9999 }}
        >
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Modal for Add User */}
      {showModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add User</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <form>
                    {/* Username */}
                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter username"
                        value={clientUsername}
                        onChange={(e) => setClientUsername(e.target.value)}
                      />
                      {errors.username && <div className="text-danger small">{errors.username}</div>}
                    </div>
                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                      {errors.email && <div className="text-danger small">{errors.email}</div>}
                    </div>
                    {/* Address */}
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <div className="row g-2">
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Building"
                            value={building}
                            onChange={(e) => setBuilding(e.target.value)}
                          />
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="State"
                            value={stateInput}
                            onChange={(e) => setStateInput(e.target.value)}
                          />
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      {errors.phone && <div className="text-danger small">{errors.phone}</div>}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={closeModal}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default ClientPanel;







