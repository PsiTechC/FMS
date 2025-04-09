// // src/components/DevicePanel.js
// import React, { useState } from "react";
// import axios from "axios";

// function DevicePanel({ devices, fetchDevices }) {
//   const [showDeviceModal, setShowDeviceModal] = useState(false);
//   const [deviceName, setDeviceName] = useState("");
//   const [deviceDescription, setDeviceDescription] = useState("");

//   const openDeviceModal = () => setShowDeviceModal(true);
//   const closeDeviceModal = () => setShowDeviceModal(false);

//   const handleSaveDevice = async () => {
//     const deviceData = {
//       name: deviceName,
//       description: deviceDescription,
//     };

//     try {
//       await axios.post("http://localhost:5000/api/devices", deviceData);
//       console.log("Device saved successfully");
//       // Refresh the device list
//       fetchDevices();

//       // Clear fields and close modal
//       setDeviceName("");
//       setDeviceDescription("");
//       closeDeviceModal();
//     } catch (error) {
//       console.error("Error saving device:", error);
//     }
//   };

//   return (
//     <div className="card shadow-sm p-3 mb-3">
//       <h5>Device Panel</h5>
//       <button className="btn btn-success btn-sm mt-2" onClick={openDeviceModal}>
//         Add Device
//       </button>
//       <ul className="mt-3 list-group">
//         {devices.map((device) => (
//           <li key={device._id} className="list-group-item">
//             {device.name}
//           </li>
//         ))}
//       </ul>

//       {/* Modal for Add Device */}
//       {showDeviceModal && (
//         <>
//           <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Add Device</h5>
//                   <button type="button" className="btn-close" onClick={closeDeviceModal}></button>
//                 </div>
//                 <div className="modal-body">
//                   <form>
//                     <div className="mb-3">
//                       <label className="form-label">Device Name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter Device Name"
//                         value={deviceName}
//                         onChange={(e) => setDeviceName(e.target.value)}
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label className="form-label">Description</label>
//                       <textarea
//                         className="form-control"
//                         placeholder="Enter Description"
//                         rows="3"
//                         value={deviceDescription}
//                         onChange={(e) => setDeviceDescription(e.target.value)}
//                       ></textarea>
//                     </div>
//                   </form>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary btn-sm" onClick={closeDeviceModal}>
//                     Close
//                   </button>
//                   <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveDevice}>
//                     Save Device
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

// export default DevicePanel;


// src/components/DevicePanel.js
// src/components/DevicePanel.js



import React, { useState, useEffect } from "react";
import axios from "axios";
import '../index.css';

function DevicePanel({ devices, fetchDevices }) {
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceDescription, setDeviceDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const openDeviceModal = () => setShowDeviceModal(true);
  const closeDeviceModal = () => setShowDeviceModal(false);

  const handleSaveDevice = async () => {
    setIsLoading(true);

    const deviceData = {
      name: deviceName,
      description: deviceDescription,
      location,
    };

    try {
      await axios.post("http://localhost:5000/api/devices", deviceData);
      console.log("Device saved successfully");

      fetchDevices();
      setDeviceName("");
      setDeviceDescription("");
      setLocation("");
      closeDeviceModal();
    } catch (error) {
      console.error("Error saving device:", error.response?.data || error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <div className="card shadow-sm p-3 mb-3" style={{ width: "1200px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h5>Devices Panel</h5>
        <button
          className="btn btn-success btn-sm"
          style={{ width: "80px", fontSize: "1.2rem" }}
          onClick={openDeviceModal}
          title="Add new device"
        >
          +
        </button>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Device Name</th>
              <th>Device ID</th>
              <th>Description</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {devices && devices.length > 0 ? (
              devices.map((device) => (
                <tr key={device._id}>
                  <td>{device.name}</td>
                  <td>{device.deviceID}</td>
                  <td>{device.description}</td>
                  <td>{device.location || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No devices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isLoading && (
  <div style={{ width: "100%", height: "4px", backgroundColor: "#ddd" }}>
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#0d6efd",
        animation: "loadingBar 1.2s linear infinite"
      }}
    ></div>
  </div>
)}


      {/* Modal */}
      {showDeviceModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Device</h5>
                  <button type="button" className="btn-close" onClick={closeDeviceModal}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Device Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Device Name"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        placeholder="Enter Description"
                        rows="3"
                        value={deviceDescription}
                        onChange={(e) => setDeviceDescription(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Device Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={closeDeviceModal}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveDevice}>
                    Save Device
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

export default DevicePanel;



