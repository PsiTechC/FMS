// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Cookies from "js-cookie";
// import WaterLevelChart from "./WaterLevelChart";

// function ClientDashboard() {
//   const { clientId } = useParams();
//   const [client, setClient] = useState(null);
//   const navigate = useNavigate();
//   const scrollRef = useRef();

//   const handleLogout = () => {
//     Cookies.remove("auth");
//     Cookies.remove("clientId");
//     navigate("/");
//   };

//   useEffect(() => {
//     const fetchClient = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/clients");
//         const data = res.data.find((c) => c._id === clientId);
//         setClient(data);
//       } catch (err) {
//         console.error("Failed to load client info", err);
//       }
//     };
//     fetchClient();
//   }, [clientId]);

//   const scrollLeft = () => {
//     scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
//   };

//   if (!client) return <p>Loading...</p>;

//   return (
//     <div style={{ padding: "20px 30px", minHeight: "100vh" }}>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h2>Welcome, {client.username}</h2>
//         <button className="btn btn-danger btn-sm" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>

//       {/* Scrollable Chart Navbar */}
//       <div className="position-relative" style={{ marginTop: "30px" }}>
//         {/* Left arrow */}
//         <button
//           onClick={scrollLeft}
//           className="btn btn-dark position-absolute"
//           style={{
//             top: "50%",
//             transform: "translateY(-50%)",
//             left: "-10px",
//             zIndex: 10,
//             borderRadius: "50%",
//             padding: "6px 10px"
//           }}
//         >
//           &#8592;
//         </button>

//         {/* Scroll container */}
//         <div
//           ref={scrollRef}
//           className="d-flex overflow-auto gap-3"
//           style={{
//             scrollBehavior: "smooth",
//             padding: "10px",
//             borderRadius: "10px",
//             whiteSpace: "nowrap",
//           }}
//         >
//           {/* Each chart container */}
//           <div style={{ minWidth: "600px", flexShrink: 0 }}>
//             <WaterLevelChart deviceId="Device0" />
//           </div>
//           <div style={{ minWidth: "600px", flexShrink: 0 }}>
//             <WaterLevelChart deviceId="Device1" />
//           </div>
//           <div style={{ minWidth: "600px", flexShrink: 0 }}>
//             <WaterLevelChart deviceId="Device2" />
//           </div>
//           {/* Add more charts as needed */}
//         </div>

//         {/* Right arrow */}
//         <button
//           onClick={scrollRight}
//           className="btn btn-dark position-absolute"
//           style={{
//             top: "50%",
//             transform: "translateY(-50%)",
//             right: "-10px",
//             zIndex: 10,
//             borderRadius: "50%",
//             padding: "6px 10px"
//           }}
//         >
//           &#8594;
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ClientDashboard;


import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import WaterLevelChart from "./WaterLevelChart";
import MapView from "./MapView";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import "../App.css"

function ClientDashboard() {
    const { clientId } = useParams();
    const [deviceData, setDeviceData] = useState({});
    const navigate = useNavigate();
    const [allowedDevices, setAllowedDevices] = useState([]);
    const [clientName, setClientName] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [mappingIds, setMappingIds] = useState({});
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpError, setOtpError] = useState("");

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [deviceNames, setDeviceNames] = useState({});
    const [editingDevice, setEditingDevice] = useState(null); // deviceID being edited
    const [sending, setSending] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);


    const deviceEditRefs = useRef({});
    const dropdownRef = useRef(null);
    const [deviceLocations, setDeviceLocations] = useState({});

    const [email, setEmail] = useState(""); // auto-filled if available
    const [successMessage, setSuccessMessage] = useState("");

    // const handleSaveDeviceName = async (deviceID) => {
    //     try {
    //       const updatedName = deviceNames[deviceID]; // Get latest edited name
      
    //       await axios.put(`http://localhost:5000/api/devices/${deviceID}`, {
    //         name: updatedName,
    //       });
      
    //       console.log("✅ Device name updated:", updatedName);
    //       setEditingDevice(null); // Close input
    //     } catch (err) {
    //       console.error("❌ Failed to update device name:", err);
    //     }
    //   };

    const handleSaveDeviceName = async (deviceID) => {
        const mappingId = mappingIds[deviceID];
        if (!mappingId) return;
      
        try {
          await axios.put(`http://localhost:5000/api/mappings/${mappingId}`, {
            name: deviceNames[deviceID],
            location: deviceLocations[deviceID],
          });
      
          console.log("✅ Saved updated name and location");
          setEditingDevice(null);
        } catch (err) {
          console.error("❌ Failed to update mapping:", err);
        }
      };

      const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
          setOtpError("Passwords do not match.");
          return;
        }
      
        setIsResettingPassword(true); // Show loader
      
        try {
          await axios.post("http://localhost:5000/api/reset-password", {
            clientId,
            otp,
            newPassword,
            confirmPassword,
          });
      
          setSuccessMessage("✅ Password updated!");
          setOtpError("");
      
          setTimeout(() => {
            setShowPasswordModal(false);
            setOtpSent(false);
            setNewPassword("");
            setConfirmPassword("");
            setOtp("");
            setSuccessMessage("");
      
            setIsResettingPassword(false); // ✅ Hide loader AFTER delay
          }, 2000);
        } catch (err) {
          setOtpError(err.response?.data?.error || "OTP validation failed.");
          setIsResettingPassword(false); // Hide loader on error
        }
      };
      
      
    const handleLogout = () => {
        Cookies.remove("auth");
        Cookies.remove("clientId");
        navigate("/");
    };

    useEffect(() => {
        const sendOtp = async () => {
          try {
            const res = await axios.post("http://localhost:5000/api/send-otp", {
              clientId,
            });
            setOtpSent(true);
            setOtpError("");
            setSuccessMessage("OTP sent to your email.");
          } catch (err) {
            console.error("Failed to send OTP:", err);
            setOtpError("Failed to send OTP. Try again later.");
          }
        };
      
        if (showPasswordModal) {
          sendOtp();  // ✉️ Send OTP as soon as modal is shown
        }
      }, [showPasswordModal, clientId]);
      
      const handleSaveDeviceLocation = async (deviceID) => {
        try {
          await axios.put("http://localhost:5000/api/devices/update-location", {
            deviceID,
            location: deviceLocations[deviceID], // Send updated location
          });
      
          // Update state to reflect changes in UI
          setDeviceLocations(prev => ({
            ...prev,
            [deviceID]: deviceLocations[deviceID], // Update device location in state
          }));
      
          // Show success message or notification if needed
          console.log("Device location updated successfully!");
        } catch (error) {
          console.error("Error updating device location:", error);
        }
      };


      
    

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
          }
        };
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
      

    // useEffect(() => {
    //     const fetchMappedDevices = async () => {
    //       try {
    //         const res = await axios.get(`http://localhost:5000/api/mappings/client/${clientId}`);
            
    //         const nameMap = {};
    //         const locationMap = {};
    //         const prefilledData = {};
      
    //         res.data.forEach(({ deviceID, name, location }) => {
    //             console.log(`Fetched name for ${deviceID}:`, name);
    //             nameMap[deviceID] = name?.trim() ? name : "";

    //           locationMap[deviceID] = location;
    //           prefilledData[deviceID] = {
    //             deviceID,
    //             waterLevel: 0,
    //             distance: 0,
    //             batteryVoltage: 0,
    //             solarVoltage: 0,
    //             temp: 0,
    //             hum: 0,
    //             batteryPercent: 0,
    //             alert: "none",
    //             sigDbm: -100,
    //             history: []
    //           };
    //         });
      
    //         setAllowedDevices(res.data.map(d => d.deviceID));
    //         setDeviceNames(nameMap);
    //         setDeviceLocations(locationMap);
    //         setDeviceData(prefilledData);
    //       } catch (err) {
    //         console.error("❌ Failed to fetch mapped devices:", err);
    //       }
    //     };
      
    //     fetchMappedDevices();
    //   }, [clientId]);

    useEffect(() => {
        const fetchMappedDevices = async () => {
          try {
            const res = await axios.get(`http://localhost:5000/api/mappings/client/${clientId}`);
            const nameMap = {};
            const locationMap = {};
            const idMap = {};
            const prefilledData = {};
      
            res.data.forEach(({ _id, name, location, deviceId }) => {
              const deviceID = deviceId.deviceID;
              nameMap[deviceID] = name?.trim() ? name : "";
              locationMap[deviceID] = location || "";
              idMap[deviceID] = _id; // Mapping ID for future updates
      
              prefilledData[deviceID] = {
                deviceID,
                waterLevel: 0,
                distance: 0,
                batteryVoltage: 0,
                solarVoltage: 0,
                temp: 0,
                hum: 0,
                batteryPercent: 0,
                alert: "none",
                sigDbm: -100,
                history: []
              };
            });
      
            setAllowedDevices(res.data.map(d => d.deviceId.deviceID));
            setDeviceNames(nameMap);
            setDeviceLocations(locationMap);
            setMappingIds(idMap); // ✅ New state
            setDeviceData(prefilledData);
          } catch (err) {
            console.error("❌ Failed to fetch mapped devices:", err);
          }
        };
      
        fetchMappedDevices();
      }, [clientId]);
      
    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (
            editingDevice &&
            deviceEditRefs.current[editingDevice] &&
            !deviceEditRefs.current[editingDevice].contains(event.target)
          ) {
            setEditingDevice(null);
          }
        };
    
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
      }, [editingDevice]);

      const handleChangePassword = async () => {
        setIsLoading(true);
        if (isSendingOtp) return; // 🚫 prevent re-entry
      
        setIsSendingOtp(true);
        try {
          const res = await axios.post("http://localhost:5000/api/send-otp", { clientId });
          setOtpSent(true);
          setOtpError("");
          setShowPasswordModal(true);
        } catch (err) {
          console.error("OTP send error:", err);
          setOtpError("Failed to send OTP. Try again later.");
        } finally {
          setIsSendingOtp(false); // reset flag
        }
        setIsLoading(false);
      };
      
      

    useEffect(() => {
        const fetchClientName = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/clients/${clientId}`);
                setClientName(res.data.username);
            } catch (err) {
                console.error("Failed to fetch client name:", err);
            }
        };
        fetchClientName();
    }, [clientId]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000/ws/live");
      
        socket.onopen = () => console.log("✅ WebSocket connected");
      
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const { deviceID, waterLevel, receivedAt } = data;
      
          if (!allowedDevices.includes(deviceID)) return;
      
          setDeviceData((prev) => {
            const history = prev[deviceID]?.history || [];
      
            return {
              ...prev,
              [deviceID]: {
                ...data,
                history: [...history.slice(-19), { time: receivedAt, value: waterLevel }]
              }
            };
          });
        };
      
        socket.onerror = (error) => console.error("WebSocket error:", error);
        socket.onclose = () => console.log("WebSocket connection closed");
      
        // ✅ Clean up socket on component unmount
        return () => socket.close();
      }, [allowedDevices]);
      

    const getAlertClass = (alert) => {
        switch (alert) {
            case "red": return "text-danger";
            case "yellow": return "text-warning";
            case "green": return "text-success";
            default: return;
        }
    };

    const getBatteryBarColor = (percent) => {
        if (percent > 75) return "bg-success";
        if (percent > 40) return "bg-warning";
        return "bg-danger";
    };

    const getSignalBars = (dbm) => {
        let level = 0;
        if (dbm >= -60) level = 5;
        else if (dbm >= -70) level = 4;
        else if (dbm >= -80) level = 3;
        else if (dbm >= -90) level = 2;
        else if (dbm >= -100) level = 1;

        return (
            <div className="d-flex align-items-end" style={{ height: "20px", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: "5px",
                            height: `${i * 4}px`,
                            backgroundColor: i <= level ? "#4caf50" : "#333",
                            borderRadius: "2px"
                        }}
                    ></div>
                ))}
            </div>
        );
    };
    const statusSummary = { active: 0, inactive: 0, fault: 0 };

    Object.values(deviceData)
        .filter((device) => allowedDevices.includes(device.deviceID)) // ✅ Use deviceID instead of topic
        .forEach((device) => {
            if (device.temp > 100 || device.hum > 100) {
                statusSummary.fault += 1;
            } else if (
                device.distance === 0 &&
                device.batteryVoltage === 0 &&
                device.solarVoltage === 0 &&
                device.temp === 0 &&
                device.hum === 0
            ) {
                statusSummary.inactive += 1;
            } else {
                statusSummary.active += 1;
            }
        });

    return (
        <div
            style={{
                backgroundColor: "#101419",
                minHeight: "100vh",
                padding: "30px",
                width: "100", // Full viewport width
                margin: "0",
                overflow: "hidden",
            }}
        >
            <div
                className="d-flex justify-content-between align-items-center text-white mb-3"
                style={{
                    padding: "0 20px",  // Padding for spacing
                    backgroundColor: "black",
                    width: "100%",  // Full width for the header
                    maxWidth: "100%", // Ensure it doesn't overflow
                    margin: "0 auto",  // Centers the content
                    position: "relative",
                    top: "0",
                    left: "0",
                    zIndex: 10,
                    }}
                  
                   // adjust horizontal margin
                >
                {/* Left side */}
                <div className="d-flex align-items-center " style={{ gap:"25px" }}>

                <img
                    src="/EulerianBots.jpeg"
                    alt="Logo"
                    style={{
                    width: "100px",
                    height: "90px",
                    objectFit: "contain",
                    }}
                />
                <div>
                    <p className="mb-1" style={{ fontSize: "0.9rem" }}>DASHBOARD</p>
                    <h2 className="mb-0">Flood Monitoring</h2>
                </div>
            </div>

                <div style={{ position: "relative" }} ref={dropdownRef}>
                    <img
                    src="/Fiverlogo.png"
                    alt="User Icon"
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                    style={{
                        width: "44px",
                        height: "44px",
                        cursor: "pointer",
                        borderRadius: "50%",
                        padding: "2px",
                        backgroundColor: "#fff"
                    }}
                    />
                    {/* Dropdown */}
                    {dropdownVisible && (
                    <div
                        style={{
                        position: "absolute",
                        top: "40px",
                        right: 0,
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        padding: "8px 0",
                        width: "160px",
                        zIndex: 999,
                        }}
                    >
                        <div style={{ padding: "8px 16px", fontWeight: "bold", color: "black" }}>
                        {clientName || "Client"}
                        </div>
                        <hr style={{ margin: "4px 0" }} />
                        <div
                            style={{ padding: "8px 16px", fontSize: "14px", color: "black", cursor: "pointer" }}
                            onClick={handleChangePassword} // 👈 should be just this
                            >
                            Change Password
                            </div>

                        <div
                        style={{ padding: "8px 16px", fontSize: "14px", color: "black", cursor: "pointer" }}
                        onClick={handleLogout}
                        >
                        Logout
                        </div>
                    </div>
                    )}
            </div>
        </div>

            <div className="d-flex justify-content-between">
                {/* Left side: Device cards */}
                <div style={{ width: "60%" }}>
                    {Object.values(deviceData).map((device) => (
                        <div
                            key={device.deviceID}
                            className="card mt-3 p-2 shadow-sm"
                            style={{
                                backgroundColor: "#151C23",
                                color: "#FBFDFE",
                                borderRadius: "12px"
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-2" style={{ position: "relative" }}>

                            <div className="d-flex align-items-center gap-3 mb-2">
                            <h5 className="mb-0">
                            {deviceNames[device.deviceID]?.trim()
                                ? deviceNames[device.deviceID]
                                : device.deviceID}
                            </h5>



                                {getSignalBars(device.sigDbm)}
                                <span className="small ">{device.sigDbm}dBm</span>
                                <div style={{ width: "100px" }} className="progress">
                                    <div
                                        className={`progress-bar ${getBatteryBarColor(device.batteryPercent)}`}
                                        role="progressbar"
                                        style={{ width: `${device.batteryPercent}%` }}
                                        aria-valuenow={device.batteryPercent}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                                <span className="small">{device.batteryPercent}%</span>
                                <span className={`small fw-bold ${getAlertClass(device.alert)}`}>{device.alert} alert</span>
                            </div>

                            <div style={{ position: "relative" }} ref={(el) => (deviceEditRefs.current[device.deviceID] = el)}>
                            <FontAwesomeIcon
                                icon={faEllipsisV}
                                style={{ cursor: "pointer", color: "#ccc", marginRight: "10px"  }}
                                onClick={() => {
                                setEditingDevice(device.deviceID);
                                
                                }}
                            />

                    {editingDevice === device.deviceID && (
                        <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "120%", // Opens to the right of the dots icon
                            backgroundColor: "#1f2a35",
                            padding: "10px",
                            borderRadius: "6px",
                            boxShadow: "0 0 6px rgba(0,0,0,0.5)",
                            zIndex: 1000,
                            minWidth: "180px"
                        }}
                        >
                        <input
  type="text"
  className="form-control form-control-sm mb-2"
  value={deviceNames[device.deviceID] ?? ""}
  onChange={(e) => {
    const newName = e.target.value;
    setDeviceNames(prev => ({
      ...prev,
      [device.deviceID]: newName
    }));
  }}
/>


                            {/* <input
                            type="text"
                            className="form-control form-control-sm mb-2"
                            value={device.deviceID || ""}
                            onChange={(e) => {
                                const newName = e.target.value;
                                setDeviceNames(prev => ({
                                ...prev,
                                [device.deviceID]: newName
                                }));
                            }}
                            /> */}

<input
      type="text"
      className="form-control form-control-sm mb-2"
      value={deviceLocations[device.deviceID] || ""}
      onChange={(e) => {
        const newLocation = e.target.value;
        setDeviceLocations(prev => ({
          ...prev,
          [device.deviceID]: newLocation,
        }));
      }}
    />

                        <button
                            className="btn btn-sm btn-success w-100"
                            onClick={() => handleSaveDeviceName(device.deviceID)}
                        >
                            Save
                        </button>
                        </div>
                        )}

                        </div>
                            </div>

                            <div className="d-flex align-items-center gap-3 small">
                                <span>
                                    <strong>Distance:</strong> {device.distance} cm
                                </span>
                                <span>
                                    <strong>Battery Voltage:</strong> {device.batteryVoltage} V
                                </span>
                                <span>
                                    <strong>Solar Voltage:</strong> {device.solarVoltage} V
                                </span>
                                <span>
                                    <strong>Temperature:</strong> {device.temp} C
                                </span>
                                <span>
                                    <strong>Humidity:</strong> {device.hum} %
                                </span>
                            </div>

                            <div className="mt-2" style={{ height: "240px" }}>
                                <WaterLevelChart
                                    deviceId={device.deviceID}
                                    waterLevel={device.waterLevel}
                                    history={device.history}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "16px",
                        width: "240px", // Same width as status summary block
                        marginTop: "1rem",
                    }}
                >
                    {/* ⬆️ Your existing summary box — unchanged */}
                    <div
                        style={{
                            backgroundColor: "#151C23",
                            padding: "12px", // reduced from 20px
                            borderRadius: "12px",
                            color: "white",
                            display: "flex",
                            flexDirection: "row",
                            gap: "12px", // optional: reduced gap too
                            height: "fit-content",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#1b4332",
                                borderRadius: "8px",
                                padding: "6px 10px", // reduced padding
                                textAlign: "center",
                            }}
                        >
                            <h5 className="mb-1" style={{ fontSize: "1.1rem" }}>{statusSummary.active}</h5>
                            <div style={{ fontSize: "0.8rem" }}>Active</div>
                        </div>

                        <div
                            style={{
                                backgroundColor: "#343a40",
                                borderRadius: "8px",
                                padding: "6px 10px",
                                textAlign: "center",
                            }}
                        >
                            <h5 className="mb-1" style={{ fontSize: "1.1rem" }}>{statusSummary.inactive}</h5>
                            <div style={{ fontSize: "0.8rem" }}>Inactive</div>
                        </div>
                        <div
                            style={{
                                backgroundColor: "#6c1e1e",
                                borderRadius: "8px",
                                padding: "6px 10px",
                                textAlign: "center",
                            }}
                        >
                            <h5 className="mb-1" style={{ fontSize: "1.1rem" }}>{statusSummary.fault}</h5>
                            <div style={{ fontSize: "0.8rem" }}>Fault</div>
                        </div>
                    </div>

                    {/* ⬇️ Map below the summary, matching width and style */}
                    <div

                        style={{
                            backgroundColor: "#151C23",
                            borderRadius: "12px",
                            overflow: "hidden",
                            width: "220%",
                            height: "340px",
                        }}
                    >
                        <MapView devices={deviceData} />
                    </div>
                </div>
            </div>

            {showPasswordModal && (
  <>
    {/* Modal Overlay */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Modal Content */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "24px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h5 className="mb-0 fw-bold">Reset Your Password</h5>
          <button
            onClick={() => setShowPasswordModal(false)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>

        <div>
          <label className="form-label fw-semibold">OTP</label>
          <input
            type="text"
            className="form-control mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <label className="form-label fw-semibold">New Password</label>
          <input
            type="password"
            className="form-control mb-3"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label className="form-label fw-semibold">Confirm Password</label>
          <input
            type="password"
            className="form-control mb-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {otpError && <p className="text-danger mb-1">{otpError}</p>}
          {successMessage && <p className="text-success mb-1">{successMessage}</p>}
          {otpSent && !successMessage && (
            <p className="text-success mb-1">OTP sent to your email.</p>
          )}

          <button
            className="btn btn-primary w-100 mt-2"
            onClick={handleResetPassword}
            disabled={isResettingPassword}
          >
            {isResettingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>

    {/* Loading Spinner Overlay */}
    {isResettingPassword && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10000,
        }}
      >
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Updating...</span>
        </div>
      </div>
    )}
  </>
)}

{isLoading && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div className="spinner-border text-light" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)}

{isResettingPassword && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div className="spinner-border text-light" role="status">
      <span className="visually-hidden">Updating...</span>
    </div>
  </div>
)}


        </div>
    );
}

export default ClientDashboard;


