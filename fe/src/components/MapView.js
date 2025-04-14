// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import axios from 'axios';

// function MapView({ devices }) {
//   const defaultCenter = [20.5937, 78.9629]; // Center of India
//   const [deviceLocations, setDeviceLocations] = useState([]);

//   useEffect(() => {
//     // Function to fetch device locations from backend
//     const fetchDeviceLocations = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/devices/locations");
//         const locations = response.data.map(device => ({
//           deviceID: device.deviceID,
//           lat: device.lat,
//           lng: device.lng
//         }));
//         setDeviceLocations(locations);
//       } catch (error) {
//         console.error("Error fetching device locations:", error);
//       }
//     };

//     fetchDeviceLocations();
//   }, []); 

//   return (
//     <div
//       style={{
//         height: "580px",           // Match height of status summary
//         width: "700px",            // Match width of status summary
//         borderRadius: "12px",
//         overflow: "hidden",
//         backgroundColor: "#151C23",
//         marginTop: "1rem",
//       }}
//     >
//       <MapContainer center={defaultCenter} zoom={4} style={{ height: "100%", width: "100%" }}>
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {Object.values(devices).map((device, index) => {
//           if (!device.lat || !device.lng) return null;
//           return (
//             <Marker key={index} position={[device.lat, device.lng]}>
//               <Popup>{device.deviceID}</Popup>
//             </Marker>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// }

// export default MapView;

// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// function MapView({ onLocationsFetched }) {
//   const { clientId } = useParams();
//   const [devices, setDevices] = useState([]);

//   useEffect(() => {
//     const fetchDeviceLocations = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/mappings/client/${clientId}/locations`);
//         const filtered = res.data.filter(d => d?.lat != null && d?.lng != null);
//         setDevices(filtered);

//         if (onLocationsFetched) {
//           onLocationsFetched(filtered); // 👈 send data up to parent
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch device locations:", err);
//       }
//     };

//     fetchDeviceLocations();
//   }, [clientId, onLocationsFetched]);

  

//   if (!Array.isArray(devices) || devices.length === 0) {
//     return <div>No devices to display on the map.</div>;
//   }

//   // Make sure there's at least one device with a valid lat/lng
//   const defaultCenter = [devices[0].lat, devices[0].lng];

//   const getGlowIcon = (color) => {
//     return L.divIcon({
//       className: "custom-glow-marker",
//       html: `
//         <div style="
//           width: 20px;
//           height: 20px;
//           background-color: ${color};
//           border-radius: 50%;
//           border: 3px solid rgba(255, 255, 255, 0.4);
//           box-shadow: 0 0 15px 6px ${color}66;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         ">
//           <div style="
//             width: 10px;
//             height: 10px;
//             background-color: ${color};
//             border-radius: 50%;
//           "></div>
//         </div>
//       `,
//       iconSize: [24, 24],
//       iconAnchor: [12, 12],
//     });
//   };

//   const getColor = (index) => {
//     const colors = ["#00c9a7", "#facc15", "#ef4444", "#fde047", "#3b82f6", "#a855f7", "#f472b6", "#22d3ee"];
//     return colors[index % colors.length];
//   };

//   return (
//     <div style={{ height: "580px", width: "700px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#151C23", marginTop: "1rem" }}>
//       <MapContainer center={defaultCenter} zoom={6} style={{ height: "100%", width: "100%", zIndex: 1 }}>
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {devices.map((device, index) => {
//           if (device.lat == null || device.lng == null) return null;

//           const color = getColor(index);
//           return (
//             <Marker
//               key={device._id}
//               position={[device.lat, device.lng]}
//               icon={getGlowIcon(color)}
//             >
//               <Popup>
//                 <strong>{device.deviceID}</strong><br />
//                 Name: {device.name || "-"}<br />
//                 Lat: {device.lat}<br />
//                 Lng: {device.lng}
//               </Popup>
//             </Marker>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// }

// export default MapView;


import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapView({ devices }) {
  // 🔁 Convert the deviceLocations object to an array of usable markers
  const parsedDevices = Object.entries(devices)
    .map(([deviceID, location]) => {
      const [lat, lng] = location.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { deviceID, lat, lng };
      }
      return null;
    })
    .filter(Boolean);

  if (parsedDevices.length === 0) {
    return <div>No devices to display on the map.</div>;
  }

  const defaultCenter = [parsedDevices[0].lat, parsedDevices[0].lng];

  const getGlowIcon = (color) => {
    return L.divIcon({
      className: "custom-glow-marker",
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background-color: ${color};
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 15px 6px ${color}66;
          display: flex;
          justify-content: center;
          align-items: center;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background-color: ${color};
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const getColor = (index) => {
    const colors = ["#00c9a7", "#facc15", "#ef4444", "#fde047", "#3b82f6", "#a855f7", "#f472b6", "#22d3ee"];
    return colors[index % colors.length];
  };

  return (
    <div
      style={{
        height: "580px",
        width: "700px",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#151C23",
        marginTop: "1rem"
      }}
    >
      <MapContainer center={defaultCenter} zoom={6} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parsedDevices.map((device, index) => {
          const color = getColor(index);
          return (
            <Marker
              key={device.deviceID}
              position={[device.lat, device.lng]}
              icon={getGlowIcon(color)}
            >
              <Popup>
                <strong>{device.deviceID}</strong><br />
                Lat: {device.lat}<br />
                Lng: {device.lng}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
