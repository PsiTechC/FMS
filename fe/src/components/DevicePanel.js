
import React, { useState, useEffect } from "react";
import axios from "axios";
import '../index.css';

function DevicePanel({ devices, fetchDevices, nextDeviceID }) {
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceDescription, setDeviceDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState("");  // decimal only (e.g., 28.38)
const [longitude, setLongitude] = useState(""); // decimal only (e.g., 77.12)

useEffect(() => {
  if (showDeviceModal && nextDeviceID) {
    setDeviceName(nextDeviceID); // autofill only when modal opens
  }
}, [showDeviceModal, nextDeviceID]);



const openDeviceModal = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/device-data/next-device-code", {

      headers: { Authorization: `Bearer ${token}` },
    });

    setDeviceName(res.data.deviceID);
    setDeviceDescription("");
    setLatitude(""); 
    setLongitude("");
    setShowDeviceModal(true);         // ✅ Then open the modal
  } catch (error) {
    console.error("Failed to fetch next device ID:", error);
    alert("Unable to generate Device ID.");
  }
};

  const closeDeviceModal = () => setShowDeviceModal(false);

  const handleSaveDevice = async () => {
    setLoading(true);

    const deviceData = {
      name: deviceName,
      description: deviceDescription,
      location: `${latitude},${longitude}`,
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
    setLoading(false);
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
  {/* Latitude */}
  <input
    type="number"
    step="any"
    min="-90"
    max="90"
    className="form-control mb-2"
    placeholder="Enter Latitude (e.g. 28.38)"
    value={latitude}
    onChange={(e) => setLatitude(e.target.value)}
  />

  {/* Longitude */}
  <input
    type="number"
    step="any"
    min="-180"
    max="180"
    className="form-control"
    placeholder="Enter Longitude (e.g. 77.12)"
    value={longitude}
    onChange={(e) => setLongitude(e.target.value)}
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



