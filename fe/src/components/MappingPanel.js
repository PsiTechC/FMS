import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function MappingPanel({ clients, devices, mappings, fetchMappings }) {
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const clientDropdownRef = useRef(null);
  const deviceDropdownRef = useRef(null);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target)
      ) {
        setShowClientDropdown(false);
      }
      if (
        deviceDropdownRef.current &&
        !deviceDropdownRef.current.contains(event.target)
      ) {
        setShowDeviceDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleClientSelection = (clientId) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleDeviceSelection = (deviceId) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleMapDevice = async () => {
    try {
      await axios.post("http://localhost:5000/api/map-devices", {
        selectedClients,
        selectedDevices,
      });
      alert("Mapping successful!");
      fetchMappings();
      setSelectedClients([]);
      setSelectedDevices([]);
    } catch (error) {
      console.error("Error mapping devices:", error.response?.data || error.message);
      alert("Mapping failed");
    }
  };
  

  return (
    <div className="card shadow-sm p-3 mb-3" style={{ width: "1100px", minHeight: "400px" }}>
      <h5>Client-Device Mapping</h5>

      <div className="row mb-3">
  {/* Clients Dropdown */}
  <div className="col-md-5" ref={clientDropdownRef}>
    <label className="form-label">Select Clients</label>
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary w-100 text-start"
        type="button"
        onClick={() => setShowClientDropdown(!showClientDropdown)}
      >
        {selectedClients.length > 0
          ? `${selectedClients.length} client(s) selected`
          : "Select Clients"}
      </button>
      {showClientDropdown && (
        <ul className="dropdown-menu show w-100 p-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
          {clients.map((client) => (
            <li key={client._id} className="form-check mb-1">
              <input
                className="form-check-input me-2"
                type="checkbox"
                checked={selectedClients.includes(client._id)}
                onChange={() => toggleClientSelection(client._id)}
                id={`client-${client._id}`}
              />
              <label className="form-check-label" htmlFor={`client-${client._id}`}>
                {client.username}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  {/* Devices Dropdown */}
  <div className="col-md-5" ref={deviceDropdownRef}>
    <label className="form-label">Select Devices</label>
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary w-100 text-start"
        type="button"
        onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
      >
        {selectedDevices.length > 0
          ? `${selectedDevices.length} device(s) selected`
          : "Select Devices"}
      </button>
      {showDeviceDropdown && (
        <ul className="dropdown-menu show w-100 p-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
          {devices.map((device) => (
            <li key={device._id} className="form-check mb-1">
              <input
                className="form-check-input me-2"
                type="checkbox"
                checked={selectedDevices.includes(device._id)}
                onChange={() => toggleDeviceSelection(device._id)}
                id={`device-${device._id}`}
              />
              <label className="form-check-label" htmlFor={`device-${device._id}`}>
                {device.name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  {/* Map Button */}
      <div className="col-md-2 d-flex align-items-end">
        <button
          className="btn btn-warning btn-sm w-100"
          style={{ height: "38px" }}
          onClick={handleMapDevice}
        >
          Map Device
        </button>
      </div>
    </div>
    
      {/* Mapped List */}
      <div className="mt-3">
        <h6>Mapped Clients & Devices</h6>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <ul className="list-group">
            {mappings.map((map) => (
              <li key={map._id} className="list-group-item">
                <strong>{map.clientId?.username}</strong> → {map.deviceId?.name}
              </li>
            ))}
          </ul>
        </div>
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

    </div>
  );
}

export default MappingPanel;
