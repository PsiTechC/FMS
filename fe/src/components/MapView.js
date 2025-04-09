import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MapView({ devices }) {
  const defaultCenter = [20.5937, 78.9629]; // Center of India

  return (
    <div
      style={{
        height: "580px",           // Match height of status summary
        width: "700px",            // Match width of status summary
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#151C23",
        marginTop: "1rem",
      }}
    >
      <MapContainer center={defaultCenter} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.values(devices).map((device, index) => {
          if (!device.lat || !device.lng) return null;
          return (
            <Marker key={index} position={[device.lat, device.lng]}>
              <Popup>{device.deviceID}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
