// // import React, { useState } from "react";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faExclamationCircle, faTint } from "@fortawesome/free-solid-svg-icons";

// // function Alerts({ deviceData, deviceConnectionStatus }) {
// //   const [activeTab, setActiveTab] = useState("live");

// //   const renderAlertSection = (alertLevel, title, color) => {
// //     const filteredDevices = Object.values(deviceData).filter(d => d.alert === alertLevel);
// //     if (filteredDevices.length === 0) return null;

// //     return (
// //       <>
// //         <div className="d-flex align-items-start mb-2">
// //           <FontAwesomeIcon
// //             icon={faExclamationCircle}
// //             className={`me-3 mt-1`}
// //             style={{ color: color }}
// //             size="lg"
// //           />
// //           <div>
// //             <div style={{ fontWeight: "bold", color: "#ffffff" }}>{title}</div>
// //           </div>
// //         </div>
// //         <div
// //           className="p-3 rounded-3 alert-scrollbar"
// //           style={{
// //             width: "100%",
// //             backgroundColor: "#101419",
// //             color: "#ffffff",
// //             height: "130px",
// //             overflowY: "hidden",
// //             overflowX: "auto",
// //             paddingRight: "8px",
// //             whiteSpace: "nowrap",
// //             marginBottom: "20px",
// //             scrollbarWidth: "thin",
// //             msOverflowStyle: "none",
// //             scrollBehavior: "smooth"
// //           }}
// //         >
// //           <div
// //             className="d-flex"
// //             style={{
// //               gap: "10px",
// //               height: "90px",
// //               width: "max-content",
// //               flexWrap: "nowrap"
// //             }}
// //           >
// //             {filteredDevices.map((d, index) => (
// //               <div
// //                 key={index}
// //                 style={{
// //                   minWidth: "220px",
// //                   backgroundColor: "#181f27",
// //                   borderRadius: "10px",
// //                   padding: "12px",
// //                   display: "inline-block"
// //                 }}
// //               >
// //                 <div
// //                   style={{
// //                     fontFamily: "monospace",
// //                     fontWeight: "bold",
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "space-between"
// //                   }}
// //                 >
// //                   <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
// //                     <span style={{ fontSize: "1.2rem", color }}>{"\u25cf"}</span>
// //                     <span style={{ color: "#ffffff" }}>{d.deviceId?.name || d.deviceID}</span>
// //                   </div>
// //                   <div style={{ fontSize: "0.9rem", color: "#bbbbbb" }}>
// //                     {new Date().toLocaleTimeString([], {
// //                       hour: "2-digit",
// //                       minute: "2-digit"
// //                     })}
// //                   </div>
// //                 </div>
// //                 <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
// //                   <li>
// //                     <strong>{d.waterLevel} cm</strong> <strong>({d.distance} cm left)</strong>
// //                   </li>
// //                 </ul>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </>
// //     );
// //   };

// //   const renderConnectionAlertSection = (type, title) => {
// //     const filteredDevices = Object.entries(deviceConnectionStatus).filter(([deviceID, statusObj]) => {
// //       const d = deviceData[deviceID];

// //       if (type === "disconnected") {
// //         return statusObj.status === "disconnected";
// //       }

// //       if (type === "back-online") {
// //         const { status, disconnectedAt, reconnectedAt } = statusObj;
// //         if (
// //           status === "back-online" &&
// //           disconnectedAt &&
// //           reconnectedAt &&
// //           reconnectedAt - disconnectedAt <= 10 * 60 * 1000
// //         ) {
// //           return true;
// //         }
// //         return false;
// //       }

// //       if (type === "error") {
// //         return d?.temp === 998 && d?.hum === 998;
// //       }

// //       return false;
// //     });

// //     if (filteredDevices.length === 0) return null;

// //     return (
// //       <>
// //         <div className="d-flex align-items-start mb-2">
// //           <FontAwesomeIcon
// //             icon={faExclamationCircle}
// //             className="me-3 mt-1"
// //             style={{ color: "#bbbbbb" }}
// //             size="lg"
// //           />
// //           <div>
// //             <div style={{ fontWeight: "bold", color: "#ffffff" }}>{title}</div>
// //           </div>
// //         </div>
// //         <div
// //           className="p-3 rounded-3 alert-scrollbar"
// //           style={{
// //             width: "100%",
// //             backgroundColor: "#101419",
// //             color: "#ffffff",
// //             height: "130px",
// //             overflowY: "hidden",
// //             overflowX: "auto",
// //             paddingRight: "8px",
// //             whiteSpace: "nowrap",
// //             marginBottom: "20px",
// //             scrollbarWidth: "thin",
// //             msOverflowStyle: "none",
// //             scrollBehavior: "smooth"
// //           }}
// //         >
// //           <div className="d-flex" style={{ gap: "10px", height: "90px", width: "max-content" }}>
// //             {filteredDevices.map(([deviceID], index) => {
// //               const d = deviceData[deviceID];
// //               const deviceName = d?.deviceId?.name || deviceID;

// //               let labelText = "";
// //               if (type === "disconnected") labelText = "Device Disconnected";
// //               else if (type === "back-online") labelText = "Device Backonline";
// //               else if (type === "error") labelText = "Device Error";

// //               return (
// //                 <div
// //                   key={index}
// //                   style={{
// //                     minWidth: "220px",
// //                     backgroundColor: "#181f27",
// //                     borderRadius: "10px",
// //                     padding: "12px",
// //                     display: "inline-block"
// //                   }}
// //                 >
// //                   <div
// //                     style={{
// //                       fontFamily: "monospace",
// //                       fontWeight: "bold",
// //                       display: "flex",
// //                       alignItems: "center",
// //                       justifyContent: "space-between"
// //                     }}
// //                   >
// //                     <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
// //                       <span style={{ fontSize: "1.2rem", color: "#FFFFFF" }}>●</span>
// //                       <span style={{ color: "#ffffff" }}>{deviceName}</span>
// //                     </div>
// //                     <div style={{ fontSize: "0.9rem", color: "#bbbbbb" }}>
// //                       {new Date().toLocaleTimeString([], {
// //                         hour: "2-digit",
// //                         minute: "2-digit"
// //                       })}
// //                     </div>
// //                   </div>
// //                   <div
// //                     style={{
// //                       marginTop: "8px",
// //                       fontSize: "0.85rem",
// //                       fontWeight: "bold",
// //                       color: "#f0f0f0",
// //                       textAlign: "center"
// //                     }}
// //                   >
// //                     {labelText}
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </>
// //     );
// //   };

// //   return (
// //     <div
// //       style={{
// //         backgroundColor: "#151C23",
// //         color: "white",
// //         borderRadius: "12px",
// //         width: "220%",
// //         maxWidth: "220%",
// //         height: "auto",
// //         padding: "20px",
// //         boxSizing: "border-box",
// //         margin: 0,
// //         display: "block"
// //       }}
// //     >
// //       <div style={{ width: "100%", display: "block" }}>
// //         <h3 className="fw-bold mb-4 text-white">Alerts</h3>

// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             backgroundColor: "#101419",
// //             borderRadius: "8px",
// //             marginBottom: "20px",
// //             overflow: "hidden"
// //           }}
// //         >
// //           <div
// //             onClick={() => setActiveTab("live")}
// //             style={{
// //               flex: 1,
// //               textAlign: "center",
// //               padding: "10px 0",
// //               cursor: "pointer",
// //               backgroundColor: activeTab === "live" ? "#1F6FEB" : "#151C23",
// //               color: activeTab === "live" ? "white" : "#bbb",
// //               fontWeight: "bold"
// //             }}
// //           >
// //             Live
// //           </div>
// //           <div
// //             onClick={() => setActiveTab("past")}
// //             style={{
// //               flex: 1,
// //               textAlign: "center",
// //               padding: "10px 0",
// //               cursor: "pointer",
// //               backgroundColor: activeTab === "past" ? "#1F6FEB" : "#151C23",
// //               color: activeTab === "past" ? "white" : "#bbb",
// //               fontWeight: "bold"
// //             }}
// //           >
// //             Past Data
// //           </div>
// //         </div>

// //         {activeTab === "live" && (
// //           <>
// //             {renderAlertSection("red", "Water level exceeding red alert", "red")}
// //             {renderAlertSection("orange", "Water level exceeding orange alert", "orange")}
// //             {renderAlertSection("yellow", "Water level exceeding yellow alert", "yellow")}

// //             {renderConnectionAlertSection("disconnected", "Devices Disconnected")}
// //             {renderConnectionAlertSection("back-online", "Devices BackOnline")}
// //             {renderConnectionAlertSection("error", "Device Error")}
// //           </>
// //         )}

// //         {activeTab === "past" && (
// //           <div className="text-center text-muted mt-4">
// //             <p>Past alert data will appear here (feature coming soon).</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Alerts;


// import React, { useState, useEffect, useRef } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faExclamationCircle, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";

// function Alerts({ deviceData, deviceConnectionStatus }) {
//   const [pastAlerts, setPastAlerts] = useState([]);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState(null);

//   const redAudioRef = useRef(null);
//   const orangeAudioRef = useRef(null);
//   const yellowAudioRef = useRef(null);

//   // ✅ Unlock audio context once on any user click
//   const [audioUnlocked, setAudioUnlocked] = useState(false);
//   useEffect(() => {
//     const unlockAudio = () => {
//       setAudioUnlocked(true);
//       window.removeEventListener("click", unlockAudio);
//       console.log("🔓 Audio playback unlocked");
//     };
//     window.addEventListener("click", unlockAudio);
//     return () => window.removeEventListener("click", unlockAudio);
//   }, []);

//   // ✅ Play/stop audio for each alert level
//   useEffect(() => {
//     if (!audioUnlocked) return;

//     const alertTypes = {
//       red: { sound: "/alertRED.mp3", ref: redAudioRef },
//       orange: { sound: "/alertORANGE.mp3", ref: orangeAudioRef },
//       yellow: { sound: "/alertYELLOW.mp3", ref: yellowAudioRef }
//     };

//     Object.entries(alertTypes).forEach(([type, { sound, ref }]) => {
//       const isActive = pastAlerts.some(alert => alert.alertType === type);

//       if (isActive && !ref.current) {
//         const audio = new Audio(sound);
//         audio.loop = true;
//         audio.play()
//           .then(() => console.log(`🔊 ${type} alert playing`))
//           .catch(err => console.error(`❌ ${type} play error:`, err));
//         ref.current = audio;
//       }

//       if (!isActive && ref.current) {
//         ref.current.pause();
//         ref.current.currentTime = 0;
//         ref.current = null;
//         console.log(`🔕 ${type} alert stopped`);
//       }
//     });
//   }, [pastAlerts, audioUnlocked]);

//   // ✅ Stop all sounds on Enter key
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "Enter") {
//         [redAudioRef, orangeAudioRef, yellowAudioRef].forEach((ref, i) => {
//           if (ref.current) {
//             ref.current.pause();
//             ref.current.currentTime = 0;
//             ref.current = null;
//             console.log(`🔕 Stopped ${["Red", "Orange", "Yellow"][i]} alert sound`);
//           }
//         });
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   // ✅ Poll alerts every 30s
//   useEffect(() => {
//     const fetchAlerts = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/alerts?limit=45");
//         setPastAlerts(res.data);
//       } catch (err) {
//         console.error("❌ Failed to fetch past alerts:", err.message);
//       }
//     };

//     fetchAlerts(); // initial fetch
//     const interval = setInterval(fetchAlerts, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const filteredAlerts = selectedFilter
//     ? pastAlerts.filter(alert => alert.alertType === selectedFilter)
//     : pastAlerts;

//   return (
//     <div style={{
//       backgroundColor: "#151C23",
//       color: "white",
//       borderRadius: "12px",
//       width: "220%",
//       maxWidth: "220%",
//       height: "auto",
//       padding: "20px",
//       boxSizing: "border-box",
//       margin: 0,
//       display: "block"
//     }}>
//       <div style={{ width: "100%", display: "block" }}>
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h3 className="fw-bold text-white mb-0">Alerts</h3>
//           <div style={{ position: "relative" }}>
//             <FontAwesomeIcon
//               icon={faEllipsisV}
//               onClick={() => setDropdownVisible(!dropdownVisible)}
//               style={{ color: "#fff", cursor: "pointer" }}
//             />
//             {dropdownVisible && (
//               <div style={{
//                 position: "absolute",
//                 top: "30px",
//                 right: 0,
//                 backgroundColor: "#222",
//                 border: "1px solid #444",
//                 borderRadius: "6px",
//                 zIndex: 10,
//                 width: "160px"
//               }}>
//                 {["red", "orange", "yellow", "error", "device disconnected", "back online", "reset"].map(type => (
//                   <div
//                     key={type}
//                     onClick={() => {
//                       setSelectedFilter(type === "reset" ? null : type);
//                       setDropdownVisible(false);
//                     }}
//                     style={{
//                       padding: "8px 12px",
//                       color: "#fff",
//                       fontSize: "14px",
//                       cursor: "pointer",
//                       borderBottom: "1px solid #333"
//                     }}
//                   >
//                     {type === "reset" ? "Reset Filter" : `Show ${type.charAt(0).toUpperCase() + type.slice(1)}`}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div style={{
//           backgroundColor: "#101419",
//           padding: "16px",
//           borderRadius: "10px",
//           maxHeight: "300px",
//           overflowY: "auto",
//           color: "white"
//         }}>
//           {filteredAlerts.length === 0 ? (
//             <div className="text-center text-muted">
//               <p>No past alerts found.</p>
//             </div>
//           ) : (
//             filteredAlerts.slice(0, 20).map((alert, index) => (
//               <div key={index} style={{
//                 padding: "10px",
//                 borderBottom: "1px solid #333"
//               }}>
//                 <div className="d-flex justify-content-between">
//                   <strong>{alert.deviceID}</strong>
//                   <span style={{ color: "#bbb", fontSize: "0.85rem" }}>
//                     {new Date(alert.triggeredAt).toLocaleString()}
//                   </span>
//                 </div>
//                 <div style={{ color: "#aaa" }}>
//                   Alert: <strong style={{ textTransform: "capitalize" }}>{alert.alertType}</strong>
//                   {alert.waterLevel && (
//                     <> | Water Level: <strong>{alert.waterLevel} cm</strong></>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Alerts;



// import React, { useState, useEffect, useRef } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";

// function Alerts({ clientId }) {
//   const [pastAlerts, setPastAlerts] = useState([]);
//   const [deviceMap, setDeviceMap] = useState({});
//   const [allowedDeviceIDs, setAllowedDeviceIDs] = useState([]);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState(null);

//   const containerRef = useRef(null);

//   const redAudioRef = useRef(null);
//   const orangeAudioRef = useRef(null);
//   const yellowAudioRef = useRef(null);

//   const [audioUnlocked, setAudioUnlocked] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (containerRef.current && !containerRef.current.contains(event.target)) {
//         setDropdownVisible(false);
//       }
//     };

//     if (dropdownVisible) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownVisible]);

//   useEffect(() => {
//     const unlockAudio = () => {
//       setAudioUnlocked(true);
//       window.removeEventListener("click", unlockAudio);
//     };
//     window.addEventListener("click", unlockAudio);
//     return () => window.removeEventListener("click", unlockAudio);
//   }, []);

//   useEffect(() => {
//     if (!audioUnlocked) return;

//     const alertTypes = {
//       red: { sound: "/alertRED.mp3", ref: redAudioRef },
//       orange: { sound: "/alertORANGE.mp3", ref: orangeAudioRef },
//       yellow: { sound: "/alertYELLOW.mp3", ref: yellowAudioRef }
//     };

//     Object.entries(alertTypes).forEach(([type, { sound, ref }]) => {
//       const isActive = pastAlerts.some(alert => alert.alertType === type);

//       if (isActive && !ref.current) {
//         const audio = new Audio(sound);
//         audio.loop = true;
//         audio.play().catch(err => console.error(`Play error for ${type}:`, err));
//         ref.current = audio;
//       }

//       if (!isActive && ref.current) {
//         ref.current.pause();
//         ref.current.currentTime = 0;
//         ref.current = null;
//       }
//     });
//   }, [pastAlerts, audioUnlocked]);

//   useEffect(() => {
//     const fetchMappingsAndAlerts = async () => {
//       try {
//         console.log("Fetching for Client ID:", clientId);

//         // Step 1: Fetch mappings
//         const mappingsRes = await axios.get(`http://localhost:5000/api/mappings?clientId=${clientId}`);
//         const mappings = mappingsRes.data;
//         console.log("Mapped Devices for Client:", mappings);
//         console.log("Allowed Device Names:", allowedDeviceNames);
//         console.log("All Alerts:", allAlerts);
//         console.log("Filtered Alerts:", filteredAlerts);
//         // Step 2: Create a map (deviceName -> deviceName)
//         const map = {};
//         const allowedDeviceNames = []; // IMPORTANT: will match with alert.deviceID
//         mappings.forEach(m => {
//           if (m.deviceId && m.deviceId.name) {
//             map[m.deviceId.name] = m.deviceId.name;
//             allowedDeviceNames.push(m.deviceId.name);
//           }
//         });
//         setDeviceMap(map);
//         setAllowedDeviceIDs(allowedDeviceNames);

//         // Step 3: Fetch all alerts
//         const alertsRes = await axios.get("http://localhost:5000/api/alerts?limit=45");
//         const allAlerts = alertsRes.data;

//         // Step 4: Filter alerts based on allowed device names
//         const filteredAlerts = allAlerts.filter(alert => allowedDeviceNames.includes(alert.deviceID));
//         console.log("Filtered Alerts for Client Devices:", filteredAlerts);

//         setPastAlerts(filteredAlerts);
//       } catch (error) {
//         console.error("❌ Failed to fetch mappings or alerts:", error.message);
//       }
//     };

//     fetchMappingsAndAlerts();
//     const interval = setInterval(fetchMappingsAndAlerts, 30000);
//     return () => clearInterval(interval);
//   }, [clientId]);

//   const filteredAlerts = selectedFilter
//     ? pastAlerts.filter(alert => alert.alertType === selectedFilter)
//     : pastAlerts;

//   return (
//     <div style={{
//       backgroundColor: "#151C23",
//       color: "white",
//       borderRadius: "12px",
//       width: "220%",
//       padding: "20px"
//     }}>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold text-white mb-0">Alerts</h3>
//         <div ref={containerRef} style={{ position: "relative" }}>
//           <FontAwesomeIcon
//             icon={faEllipsisV}
//             onClick={() => setDropdownVisible(!dropdownVisible)}
//             style={{ color: "#fff", cursor: "pointer" }}
//           />
//           {dropdownVisible && (
//             <div style={{
//               position: "absolute",
//               top: "30px",
//               right: 0,
//               backgroundColor: "#222",
//               border: "1px solid #444",
//               borderRadius: "6px",
//               zIndex: 10,
//               width: "160px"
//             }}>
//               {["red", "orange", "yellow", "error", "device disconnected", "back online", "reset"].map(type => (
//                 <div
//                   key={type}
//                   onClick={() => {
//                     setSelectedFilter(type === "reset" ? null : type);
//                     setDropdownVisible(false);
//                   }}
//                   style={{
//                     padding: "8px 12px",
//                     color: "#fff",
//                     fontSize: "14px",
//                     cursor: "pointer",
//                     borderBottom: "1px solid #333"
//                   }}
//                 >
//                   {type === "reset" ? "Reset Filter" : `Show ${type.charAt(0).toUpperCase() + type.slice(1)}`}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={{
//         backgroundColor: "#101419",
//         padding: "16px",
//         borderRadius: "10px",
//         maxHeight: "300px",
//         overflowY: "auto",
//         color: "white"
//       }}>
//         {filteredAlerts.length === 0 ? (
//           <div className="text-center text-muted">
//             <p>No past alerts found.</p>
//           </div>
//         ) : (
//           filteredAlerts.slice(0, 20).map((alert, index) => (
//             <div key={index} style={{
//               padding: "10px",
//               borderBottom: "1px solid #333"
//             }}>
//               <div className="d-flex justify-content-between">
//                 {/* Show device name from map */}
//                 <strong>{deviceMap[alert.deviceID] || "Unknown Device"}</strong>
//                 <span style={{ color: "#bbb", fontSize: "0.85rem" }}>
//                   {new Date(alert.triggeredAt).toLocaleString()}
//                 </span>
//               </div>
//               <div style={{ color: "#aaa" }}>
//                 Alert: <strong>{alert.alertType || "Alert"}</strong>
//                 {alert.waterLevel && (
//                   <> | Water Level: <strong>{alert.waterLevel} cm</strong></>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Alerts;

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import CustomAlert from "./CustomAlert";
const REACT_FE = process.env.REACT_APP_FE_BASE

function Alerts({ clientId }) {
  const [pastAlerts, setPastAlerts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);

  const redAudioRef = useRef(null);
  const orangeAudioRef = useRef(null);
  const yellowAudioRef = useRef(null);
  const [activeAlerts, setActiveAlerts] = useState([]); // array of alerts
  const playingAudiosRef = useRef({}); // key: alertId, value: Audio object

  const playingAudioRef = useRef(null); // to store the currently playing Audio object



  const lastPlayedAlertRef = useRef(null);

  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    const unlockAudio = () => {
      setAudioUnlocked(true);
      window.removeEventListener("click", unlockAudio);
      console.log("🔓 Audio playback unlocked by user");
    };
    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        if (!clientId) {
          console.warn("⚠️ No clientId provided to Alerts component.");
          return;
        }
        console.log("Fetching alerts for clientId:", clientId);

        const res = await axios.get(`${REACT_FE}/api/alerts?clientId=${clientId}&limit=45`);
        setPastAlerts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch past alerts:", err.message);
      }
    };

    fetchAlerts(); // initial fetch
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [clientId]);

  useEffect(() => {
    if (!audioUnlocked || !pastAlerts || pastAlerts.length === 0) return;
  
    const alertLevels = ["red", "orange", "yellow"];
    const sounds = {
      red: "/alertRED.mp3",
      orange: "/alertORANGE.mp3",
      yellow: "/alertYELLOW.mp3"
    };
  
    alertLevels.forEach(level => {
      const latestAlert = pastAlerts.find(alert => alert.alertType === level);
      if (!latestAlert) return;
  
      const { _id, deviceName, waterLevel } = latestAlert;
  
      if (playingAudiosRef.current[_id]) return; // Already playing this alert
  
      const audio = new Audio(sounds[level]);
      audio.loop = true;
  
      audio.play()
        .then(() => {
          playingAudiosRef.current[_id] = audio;
  
          setActiveAlerts(prev => {
            const alreadyExists = prev.some(a => a.id === _id);
            if (alreadyExists) return prev;
  
            return [
              ...prev,
              {
                id: _id,
                deviceName,
                type: level,
                message: `${level.toUpperCase()} Alert: Water level at ${waterLevel} cm`
              }
            ];
          });
        })
        .catch(err => console.error(`🔇 Failed to play ${level} alert:`, err));
    });
  }, [pastAlerts, audioUnlocked]);
  
  
  
  const filteredAlerts = selectedFilter
    ? pastAlerts.filter(alert => alert.alertType === selectedFilter)
    : pastAlerts;

  return (
    <div style={{
      backgroundColor: "#151C23",
      color: "white",
      borderRadius: "12px",
      width: "220%",
      padding: "20px"
    }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-white mb-0">Alerts</h3>
        <div style={{ position: "relative" }}>
          <FontAwesomeIcon
            icon={faEllipsisV}
            onClick={() => setDropdownVisible(!dropdownVisible)}
            style={{ color: "#fff", cursor: "pointer" }}
          />
          {dropdownVisible && (
            <div style={{
              position: "absolute",
              top: "30px",
              right: 0,
              backgroundColor: "#222",
              border: "1px solid #444",
              borderRadius: "6px",
              zIndex: 10,
              width: "160px"
            }}>
              {["red", "orange", "yellow", "error", "device disconnected", "back online", "reset"].map(type => (
                <div
                  key={type}
                  onClick={() => {
                    setSelectedFilter(type === "reset" ? null : type);
                    setDropdownVisible(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    color: "#fff",
                    fontSize: "14px",
                    cursor: "pointer",
                    borderBottom: "1px solid #333"
                  }}
                >
                  {type === "reset" ? "Reset Filter" : `Show ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{
        backgroundColor: "#101419",
        padding: "16px",
        borderRadius: "10px",
        maxHeight: "300px",
        overflowY: "auto",
        color: "white"
      }}>
        {filteredAlerts.length === 0 ? (
          <div className="text-center text-muted">
            <p>No past alerts found.</p>
          </div>
        ) : (
          filteredAlerts.slice(0, 20).map((alert, index) => (
            <div key={index} style={{
              padding: "10px",
              borderBottom: "1px solid #333"
            }}>
              <div className="d-flex justify-content-between">
                {/* 🛠️ Now showing deviceName */}
                <strong>{alert.deviceName || "Unknown Device"}</strong>
                <span style={{ color: "#bbb", fontSize: "0.85rem" }}>
                  {new Date(alert.triggeredAt).toLocaleString()}
                </span>
              </div>
              <div style={{ color: "#aaa" }}>
                Alert: <strong style={{ textTransform: "capitalize" }}>{alert.alertType}</strong>
                {alert.waterLevel && (
                  <> | Water Level: <strong>{alert.waterLevel} cm</strong></>
                )}
              </div>
            </div>
          ))
        )}
      </div>



      <div style={{
  position: "fixed",
  top: "20px",
  right: "20px",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  gap: "16px"
}}>
  {activeAlerts.map(alert => (
    <CustomAlert
      key={alert.id}
      alertData={alert}
      onStop={() => {
        setActiveAlerts(prev => prev.filter(a => a.id !== alert.id));
        if (playingAudiosRef.current[alert.id]) {
          playingAudiosRef.current[alert.id].pause();
          playingAudiosRef.current[alert.id].currentTime = 0;
          delete playingAudiosRef.current[alert.id];
        }
      }}
    />
  ))}
</div>





    </div>
  );
}

export default Alerts;
