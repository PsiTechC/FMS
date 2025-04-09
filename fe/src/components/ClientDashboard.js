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


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import WaterLevelChart from "./WaterLevelChart";
import MapView from "./MapView";


function ClientDashboard() {
    const { clientId } = useParams();
    const [deviceData, setDeviceData] = useState({});
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove("auth");
        Cookies.remove("clientId");
        navigate("/");
    };

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000/ws/live");

        socket.onopen = () => console.log("✅ WebSocket connected");

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setDeviceData((prev) => {
                const { deviceID, waterLevel, receivedAt } = data;
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

        return () => socket.close();
    }, []);

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

    Object.values(deviceData).forEach(device => {
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
                width: "100%",
                margin: "0",
            }}
        >
            <div className="d-flex flex-column justify-content-between align-items-start text-white mb-4">
                <p className="mb-1 " style={{ fontSize: "0.9rem" }}>
                    DASHBOARD
                </p>
                <div className="d-flex w-100 justify-content-between align-items-center">
                    <h2 className="mb-0">Flood Monitoring</h2>
                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
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
                            <div className="d-flex align-items-center gap-3 mb-2">
                                <h5 className="mb-0">{device.deviceID}</h5>
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

        </div>
    );
}

export default ClientDashboard;
