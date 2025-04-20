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
//         const res = await axios.get("${REACT_FE}/api/clients");
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
import { faExclamationCircle, faTint, faBell } from '@fortawesome/free-solid-svg-icons';
import useWebSocket from "../hooks/useWebSocket"; // adjust the path as needed
import Alerts from './Alerts'; // adjust path if needed


import { faPen } from '@fortawesome/free-solid-svg-icons';
const REACT_FE= process.env.REACT_APP_FE_BASE
const BASE_URL_WS= process.env.REACT_APP_WS_BASE


function ClientDashboard() {
    
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
    // const [deviceNames, setDeviceNames] = useState({});
    const [editingDevice, setEditingDevice] = useState(null); // deviceID being edited
    const [sending, setSending] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [mapRefreshTrigger, setMapRefreshTrigger] = useState(Date.now());
    const [mapDeviceLocations, setMapDeviceLocations] = useState([]);
    const [alertLogs, setAlertLogs] = useState([]);
    const [lastSignalTimes, setLastSignalTimes] = useState({});
const [deviceConnectionStatus, setDeviceConnectionStatus] = useState({});

    const deviceEditRefs = useRef({});
    const dropdownRef = useRef(null);
    const latRefs = useRef({});
    const lngRefs = useRef({});
    const deviceNameRefs = useRef({});
    const lastAlertSent = useRef({}); 
    const lastSignalTimesRef = useRef({});

    const redAlertRefs = useRef({});
const orangeAlertRefs = useRef({});
const yellowAlertRefs = useRef({});

const getColor = (level) => {
  switch (level) {
    case "red": return "#FF4C4C";       // 🔴
    case "orange": return "#FFB84C";    // 🟠
    case "yellow": return "#FFD700";    // 🟡
    default: return "#BBBBBB";          // ⚪️ fallback
  }
};

    const [email, setEmail] = useState(""); // auto-filled if available
    const [successMessage, setSuccessMessage] = useState("");

    const { clientId } = useParams();  // Get clientId from URL parameters
  const [deviceLocations, setDeviceLocations] = useState([]);

  console.log("👁️ clientId value right now:", clientId);
  const handleChangePassword = () => {
    setOtpSent(false);
    setOtpError("");
    setSuccessMessage("");
    setShowPasswordModal(true);  // 💥 just opens modal
  };

  useEffect(() => {
    const sendOtp = async () => {
      try {
        setIsLoading(true); // Show spinner
        const res = await axios.post(`${REACT_FE}/api/send-otp`, {
          clientId,
        });
        setOtpSent(true);
        setOtpError("");
        setSuccessMessage("OTP sent to your email.");
      } catch (err) {
        console.error("Failed to send OTP:", err);
        setOtpError("Failed to send OTP. Try again later.");
      } finally {
        setIsLoading(false); // Hide spinner
      }
    };
  
    if (showPasswordModal) {
      sendOtp();
    }
  }, [showPasswordModal, clientId]);

  useEffect(() => {
    let socket;
    let reconnectTimer;
  
    const connectWebSocket = () => {
      socket = new WebSocket(`wss://${BASE_URL_WS}/ws/live`);
  
      socket.onopen = () => {
        console.log("✅ WebSocket connected");
      };
  
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📦 Received WebSocket data:", data);
  
        // Handle your data update logic here, e.g.:
        // updateDeviceData(data);
      };
  
      socket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        socket.close();
      };
  
      socket.onclose = () => {
        console.warn("⚠️ WebSocket disconnected. Reconnecting in 3 seconds...");
        reconnectTimer = setTimeout(connectWebSocket, 3000);
      };
    };
  
    connectWebSocket();
  
    return () => {
      clearTimeout(reconnectTimer);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);
  
  
//   useEffect(() => {
//     // Fetch mapped devices for the client
//     const fetchMappedDevices = async () => {
//         try {
//           const response = await axios.get(`${REACT_FE}/api/devices/location/client/${clientId}`);
          
//           // ✅ Log raw API data
//           console.log("📦 API Response:", response.data);
     
//           // Process the data
//           const locations = response.data.map(device => {
//             const [lat, lng] = device.location.split(",").map(Number);
//             return {
//               deviceID: device.deviceID,
//               lat: lat,
//               lng: lng
//             };
//           });
      
//           // ✅ Log extracted map locations
//           console.log("📍 Parsed Locations:", locations);
      
//           setDeviceLocations(locations);
//         } catch (error) {
//           console.error("❌ Error fetching client devices:", error);
//         }
//       };
      
//     fetchMappedDevices(); // Fetch devices on component mount
//   }, [clientId]);

//   useEffect(() => {
//     console.log("📍 Updated deviceLocations in state:", deviceLocations);
//   }, [deviceLocations]);

    // const handleSaveDeviceName = async (deviceID) => {
    //     try {
    //       const updatedName = deviceNames[deviceID]; // Get latest edited name
      
    //       await axios.put(`${REACT_FE}/api/devices/${deviceID}`, {
    //         name: updatedName,
    //       });
      
    //       console.log("✅ Device name updated:", updatedName);
    //       setEditingDevice(null); // Close input
    //     } catch (err) {
    //       console.error("❌ Failed to update device name:", err);
    //     }
    //   };

    const handleSaveDeviceName = async (deviceID) => {
      console.log("🟢 Save clicked for deviceID:", deviceID);
      console.log("📦 mappingIds object:", mappingIds);
    
      const mappingId = mappingIds[deviceID];
      console.log("📌 Mapping ID retrieved:", mappingId);
    
      if (!mappingId) {
        console.warn("❌ No mappingId found for deviceID:", deviceID);
        return;
      }
    
      const devname = deviceNameRefs.current[deviceID]?.value?.trim() || "";
      const lat = latRefs.current[deviceID]?.value?.trim() || "";
      const lng = lngRefs.current[deviceID]?.value?.trim() || "";
      const locationString = `${lat},${lng}`;
    
      // 🔴🟠🟡 Alert Level Inputs
      const red = parseInt(redAlertRefs.current[deviceID]?.value);
      const orange = parseInt(orangeAlertRefs.current[deviceID]?.value);
      const yellow = parseInt(yellowAlertRefs.current[deviceID]?.value);
    
      const payload = {
        name: devname,
        location: locationString,
        red: isNaN(red) ? null : red,
        orange: isNaN(orange) ? null : orange,
        yellow: isNaN(yellow) ? null : yellow
      };
    
      console.log("📤 Sending API call with payload:", payload);
    
      try {
        await axios.put(`${REACT_FE}/api/mappings/${mappingId}`, payload);
    
        // ✅ Update local UI state to reflect changes
        setDeviceData((prev) => ({
          ...prev,
          [deviceID]: {
            ...prev[deviceID],
            deviceId: {
              ...prev[deviceID].deviceId,
              name: devname,
              location: locationString,
              red: payload.red,
              orange: payload.orange,
              yellow: payload.yellow
            }
          }
        }));
    
        setDeviceLocations((prev) => ({
          ...prev,
          [deviceID]: locationString
        }));
    
        setEditingDevice(null);
    
        console.log("✅ Saved updated name, location, and alert levels!");
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
          await axios.post(`${REACT_FE}/api/reset-password`, {
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
    //         const res = await axios.get(`${REACT_FE}/api/mappings/client/${clientId}`);
            
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
            const res = await axios.get(`${REACT_FE}/api/mappings/client/${clientId}`);
            console.log("✅ Raw response from API:", res.data);
      
            const idMap = {};
            const latitudeMap = {};
            const longitudeMap = {};
            const deviceStatusMap = {};
            const prefilledData = {};
      
            res.data.forEach(({ _id, deviceId, index }) => {
                const deviceID = deviceId.deviceID;
                const name = deviceId.name;
              
                const location = deviceId.location;
      
                idMap[deviceID] = _id;
                deviceStatusMap[deviceID] = 'disconnected';
      
              if (location) {
                const [lat, lng] = location.split(",").map(val => val.trim());
                latitudeMap[deviceID] = lat;
                longitudeMap[deviceID] = lng;
              } else {
                latitudeMap[deviceID] = "";
                longitudeMap[deviceID] = "";
              }
      
              prefilledData[deviceID] = {
                deviceID,
                deviceId,
                name,
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
            setMappingIds(idMap);
            setDeviceConnectionStatus(deviceStatusMap);
            setDeviceData(prefilledData);
      
            setDeviceLocations(prev => ({
              ...prev,
              ...Object.keys(latitudeMap).reduce((acc, deviceID) => {
                acc[deviceID] = `${latitudeMap[deviceID]},${longitudeMap[deviceID]}`;
                return acc;
              }, {})
            }));
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

    //   const handleChangePassword = async () => {
    //     setIsLoading(true);
    //     if (isSendingOtp) return; // 🚫 prevent re-entry
      
    //     setIsSendingOtp(true);
    //     try {
    //       const res = await axios.post("${REACT_FE}/api/send-otp", { clientId });
    //       setOtpSent(true);
    //       setOtpError("");
    //       setShowPasswordModal(true);
    //     } catch (err) {
    //       console.error("OTP send error:", err);
    //       setOtpError("Failed to send OTP. Try again later.");
    //     } finally {
    //       setIsSendingOtp(false); // reset flag
    //     }
    //     setIsLoading(false);
    //   };
      
    useEffect(() => {
        const fetchClientName = async () => {
            try {
                const res = await axios.get(`${REACT_FE}/api/clients/${clientId}`);
                setClientName(res.data.username);
            } catch (err) {
                console.error("Failed to fetch client name:", err);
            }
        };
        fetchClientName();
    }, [clientId]);
  
    useEffect(() => {
      let socket;
      let reconnectTimer;
    
      const connect = () => {
        socket = new WebSocket(`wss://${BASE_URL_WS}/ws/live`);
    
        socket.onopen = () => {
          console.log("✅ WebSocket connected");
        };
    
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("📦 Received WebSocket data:", data);
    
          const { deviceID, waterLevel, distance, temp, hum, receivedAt } = data;
          if (!allowedDevices.includes(deviceID)) return;
    
          const timestamp = new Date(receivedAt || Date.now());
    
          // 🟢 Update signal time
          setLastSignalTimes((prev) => ({
            ...prev,
            [deviceID]: Date.now()
          }));
    
          // 🟢 Update device status if it was disconnected
          setDeviceConnectionStatus((prev) => {
            const wasDisconnected = prev[deviceID] === "disconnected";
            if (wasDisconnected) {
              return { ...prev, [deviceID]: "back-online" };
            }
            return prev;
          });
    
          // 🟡 Alert level logic
          let alert = "none";
          if (waterLevel >= 50) {
            alert = "red";
    
            // ✅ Deduplication check
            if (lastAlertSent.current[deviceID] !== waterLevel) {
              lastAlertSent.current[deviceID] = waterLevel;
    
              const deviceName = deviceData?.[deviceID]?.deviceId?.name || deviceID;
    
              // ✅ Define and call async function to use await properly
              const sendRedAlert = async () => {
                try {
                  await axios.post(`${REACT_FE}/api/redalerts`, {
                    deviceID,
                    deviceName,
                    waterLevel,
                    distance
                  });
                  console.log("✅ Red alert saved to backend");
                } catch (err) {
                  console.error("❌ Failed to save red alert:", err);
                }
              };
    
              sendRedAlert(); // trigger alert sending
            } else {
              console.log("⚠️ Duplicate red alert skipped for", deviceID);
            }
    
            // 🔊 Play red alert buzzer only if not already playing
            
          } else if (waterLevel >= 40) {
            alert = "orange";
          } else if (waterLevel >= 30) {
            alert = "yellow";
          }
    
          // 🔔 Update alert logs UI
          const alertLog = {
            deviceID,
            level: alert,
            message: `Water level is ${alert} alert: ${waterLevel} cm`,
            distance,
            time: timestamp
          };
    
          setAlertLogs((prev) => {
            const existingIndex = prev.findIndex((log) => log.deviceID === alertLog.deviceID);
            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = alertLog;
              return updated;
            }
            return [alertLog, ...prev].slice(0, 10);
          });
    
          // 📊 Update graph + device state
          setDeviceData((prev) => {
            const history = prev[deviceID]?.history || [];
            const deviceId = prev[deviceID]?.deviceId;
    
            return {
              ...prev,
              [deviceID]: {
                ...data,
                deviceID,
                alert,
                deviceId,
                history: [...history.slice(-19), { time: timestamp.toISOString(), value: waterLevel }]
              }
            };
          });
        };
    
        socket.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          socket.close();
        };
    
        socket.onclose = () => {
          console.warn("⚠️ WebSocket connection closed. Retrying in 3 seconds...");
          reconnectTimer = setTimeout(connect, 3000);
        };
      };
    
      connect();
    
      return () => {
        clearTimeout(reconnectTimer);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    }, [allowedDevices]);
    
    useEffect(() => {
      const interval = setInterval(() => {
        const now = Date.now();
    
        Object.entries(lastSignalTimes).forEach(([deviceID, lastTime]) => {
          const diff = now - lastTime;
    
          if (diff > 10 * 60 * 1000) {
            // ❌ Disconnected
            setDeviceConnectionStatus(prev => ({
              ...prev,
              [deviceID]: 'disconnected'
            }));
          }
        });
      }, 60 * 1000); // every minute
    
      return () => clearInterval(interval);
    }, [lastSignalTimes]);
    

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
                <a  href="https://eulerianbots.com" target="_blank" rel="noopener noreferrer" >
                <img
                    src="/Eulerian_Bots.jpeg"
                    alt="Eulerian Bots"
                    style={{
                    width: "130px",
                    height: "110px",
                    objectFit: "contain",
                    }}
                />
                </a>
                
                <div>
                <h1 className="mb-0">Flood Monitoring</h1>
                    <p className="mb-1" style={{ fontSize: "0.9rem" }}>DASHBOARD</p>
                    
                </div>
            </div>

                <div style={{ position: "relative" }} ref={dropdownRef}>
                  
                  <img
                    src="/Fiverlogo.png"
                    alt="User Icon"
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                    style={{
                        width: "64px",
                        height: "64px",
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
                <div style={{ width: "60%",
                  
                  
                 }}>
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
                            {device.deviceId?.name || device.deviceID}
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
                            icon={faPen}
                            className="edit-icon"
                            
                            onClick={() => {
                              if (editingDevice === device.deviceID) {
                                setEditingDevice(null);  // 🧹 close if already open
                              } else {
                                setEditingDevice(device.deviceID);  // 🖊️ open editor
                              }
                            }}
                            />

{/* {editingDevice === device.deviceID && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
      zIndex: 999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        position: "relative", // Needed for absolutely positioned close button
        backgroundColor: "#425970",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 12px rgba(0,0,0,0.6)",
        minWidth: "300px",
        zIndex: 1000,
      }}
    >
      
      <button
        onClick={() =>  (null)} // replace with your close logic
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "transparent",
          border: "none",
          color: "#ffffff",
          fontSize: "16px",
          cursor: "pointer",
        }}
        aria-label="Close"
      >
        ✖
      </button>

      <small style={{ color: "#ffffff", fontSize: "12px" }}>Device Name</small>
      <input
        type="text"
        className="form-control form-control-sm mb-2"
        placeholder="Device Name"
        defaultValue={device.deviceId?.name || ""}
        ref={(el) => (deviceNameRefs.current[device.deviceID] = el)}
      />

      <div className="d-flex justify-content-between mb-2" style={{ gap: "8px" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <small style={{ color: "#ffffff", fontSize: "12px" }}>Lat.</small>
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            className="form-control form-control-sm"
            placeholder="Lat."
            ref={(el) => (latRefs.current[device.deviceID] = el)}
            style={{ appearance: "none", MozAppearance: "textfield" }}
            value={parseFloat(deviceLocations[device.deviceID]?.split(",")[0]) || ""}
            onChange={(e) => {
              const newLat = e.target.value;
              const [, lng = ""] = deviceLocations[device.deviceID]?.split(",") || ["", ""];
              if (/^-?\d*\.?\d*$/.test(newLat)) {
                setDeviceLocations(prev => ({
                  ...prev,
                  [device.deviceID]: `${newLat},${lng}`
                }));
              }
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <small style={{ color: "#ffffff", fontSize: "12px" }}>Long.</small>
          <input
            type="number"
            step="any"
            min="-180"
            max="180"
            className="form-control form-control-sm"
            placeholder="Lon."
            ref={(el) => (lngRefs.current[device.deviceID] = el)}
            value={parseFloat(deviceLocations[device.deviceID]?.split(",")[1]) || ""}
            onChange={(e) => {
              const newLng = e.target.value;
              const [lat = ""] = deviceLocations[device.deviceID]?.split(",") || ["", ""];
              if (/^-?\d*\.?\d*$/.test(newLng)) {
                setDeviceLocations(prev => ({
                  ...prev,
                  [device.deviceID]: `${lat},${newLng}`
                }));
              }
            }}
          />
        </div>
      </div>

      <button
        className="btn btn-sm btn-success w-100"
        onClick={() => handleSaveDeviceName(device.deviceID)}
      >
        Save
      </button>
    </div>
  </div>
)} */}



{editingDevice === device.deviceID && (
  <div
    style={{
      zIndex: 999,
      position: "absolute",
      top: 0,
      left: "120%", // Opens to the right of the dots icon
      backgroundColor: "#425970",
      padding: "10px",
      borderRadius: "6px",
      boxShadow: "0 0 6px rgba(0,0,0,0.5)",
      zIndex: 2000,
      minWidth: "230px"
    }}
  >
    <h6>Device Settings</h6>
    <small style={{ color: "#ffffff", fontSize: "12px" }}>Device Name</small>
    <input
      type="text"
      className="form-control form-control-sm mb-2"
      placeholder="Device Name"
      defaultValue={device.deviceId?.name || ""}
      ref={(el) => (deviceNameRefs.current[device.deviceID] = el)}
    />

    <div className="d-flex justify-content-between mb-2" style={{ gap: "8px" }}>
      
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <small style={{ color: "#ffffff", fontSize: "12px" }}>Lat.</small>
        <input
          type="number"
          step="any"
          min="-90"
          max="90"
          className="form-control form-control-sm"
          placeholder="Lat."
          ref={(el) => (latRefs.current[device.deviceID] = el)}
          style={{ appearance: "none", MozAppearance: "textfield" }}
          value={parseFloat(deviceLocations[device.deviceID]?.split(",")[0]) || ""}
          onChange={(e) => {
            const newLat = e.target.value;
            const [, lng = ""] = deviceLocations[device.deviceID]?.split(",") || ["", ""];
            if (/^-?\d*\.?\d*$/.test(newLat)) {
              setDeviceLocations(prev => ({
                ...prev,
                [device.deviceID]: `${newLat},${lng}`
              }));
            }
          }}
        />
      </div>

      
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <small style={{ color: "#ffffff", fontSize: "12px" }}>Long.</small>
        <input
          type="number"
          step="any"
          min="-180"
          max="180"
          className="form-control form-control-sm"
          placeholder="Lon."
          ref={(el) => (lngRefs.current[device.deviceID] = el)}
          value={parseFloat(deviceLocations[device.deviceID]?.split(",")[1]) || ""}
          onChange={(e) => {
            const newLng = e.target.value;
            const [lat = ""] = deviceLocations[device.deviceID]?.split(",") || ["", ""];
            if (/^-?\d*\.?\d*$/.test(newLng)) {
              setDeviceLocations(prev => ({
                ...prev,
                [device.deviceID]: `${lat},${newLng}`
              }));
            }
          }}
        />
      </div>
      
    </div>

    <div class="margin" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
  <small style={{ color: "#ffffff", fontSize: "12px" }}>Red alert level</small>
  <input
    type="number"
    min="0"
    step="1"
    className="form-control form-control-sm"
    placeholder="Red alert level"
    ref={(el) => (redAlertRefs.current[device.deviceID] = el)}
    defaultValue={device.deviceId?.red ?? ""}
    onKeyDown={(e) => {
      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
    }}
  />
</div>


<div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
  <small style={{ color: "#ffffff", fontSize: "12px" }}>Orange alert level</small>
  <input
    type="number"
    min="0"
    step="1"
    className="form-control form-control-sm"
    placeholder="Orange alert level"
    ref={(el) => (orangeAlertRefs.current[device.deviceID] = el)}
    defaultValue={device.deviceId?.orange ?? ""}
    onKeyDown={(e) => {
      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
    }}
  />
</div>


<div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
  <small style={{ color: "#ffffff", fontSize: "12px" }}>Yellow alert level</small>
  <input
    type="number"
    min="0"
    step="1"
    className="form-control form-control-sm"
    placeholder="Yellow alert level"
    ref={(el) => (yellowAlertRefs.current[device.deviceID] = el)}
    defaultValue={device.deviceId?.yellow ?? ""}
    onKeyDown={(e) => {
      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
    }}
  />
</div>


    <button
      className="btn btn-sm btn-success w-100"
      style={{ marginTop: "12px" }}
      onClick={() => handleSaveDeviceName(device.deviceID)}
    >
      Save
    </button>
  </div>
)}

                        </div>
                            </div>

                            <div className="d-flex align-items-center gap-3 small flex-wrap">
  <span style={{ minWidth: "150px" }}>
    <strong>Distance:</strong> {device.distance} cm
  </span>
  <span style={{ minWidth: "180px" }}>
    <strong>Battery Voltage:</strong> {device.batteryVoltage} V
  </span>
  <span style={{ minWidth: "160px" }}>
    <strong>Solar Voltage:</strong> {device.solarVoltage} V
  </span>
  <span style={{ minWidth: "150px" }}>
    <strong>Temperature:</strong> {device.temp} C
  </span>
  <span style={{ minWidth: "150px" }}>
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
                                padding: "6px 10px", 
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

                    
                    <div

                        style={{
                            backgroundColor: "#151C23",
                            borderRadius: "12px",
                            overflow: "hidden",
                            width: "220%",
                            height: "300px",
                        }}
                    >
                        <MapView devices={deviceLocations} />

                    </div>

                    <Alerts
                      deviceData={deviceData}
                      clientId={clientId}
                      deviceConnectionStatus={deviceConnectionStatus}
                    />

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
