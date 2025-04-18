// import React, { useEffect, useState } from "react";

// function CustomAlert({ alertData, onStop }) {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (alertData) setVisible(true);
//   }, [alertData]);

//   if (!visible || !alertData) return null;

//   return (
//     <div style={{
//       position: "fixed",
//       top: "20px",
//       right: "20px",
//       backgroundColor: "#d9534f",
//       color: "white",
//       padding: "16px 20px",
//       borderRadius: "8px",
//       boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
//       zIndex: 9999,
//       maxWidth: "300px"
//     }}>
//       <h5 style={{ margin: 0 }}>{alertData.deviceName}</h5>
//       <p style={{ margin: "8px 0 0", fontSize: "14px" }}>{alertData.message}</p>
//       <button
//         style={{
//           marginTop: "10px",
//           backgroundColor: "#fff",
//           color: "#d9534f",
//           border: "none",
//           borderRadius: "4px",
//           padding: "6px 12px",
//           cursor: "pointer",
//           fontWeight: "bold"
//         }}
//         onClick={() => {
//           setVisible(false);
//           if (onStop) onStop();
//         }}
//       >
//         Stop
//       </button>
//     </div>
//   );
// }

// export default CustomAlert;


//----
// import React, { useEffect, useState } from "react";

// function CustomAlert({ alertData, onStop }) {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (alertData) setVisible(true);
//   }, [alertData]);

//   if (!visible || !alertData) return null;

//   // Dynamic background color based on alert type
//   const bgColor = {
//     red: "#d9534f",
//     orange: "#f0ad4e",
//     yellow: "#f7e463"
//   }[alertData.type || "red"]; // fallback to red

//   // Text color should be dark on yellow for better contrast
//   const isLight = alertData.type === "yellow";

//   return (
//     <div style={{
//       position: "fixed",
//       top: "20px",
//       right: "20px",
//       backgroundColor: bgColor,
//       color: isLight ? "#000" : "#fff",
//       padding: "24px 28px",
//       borderRadius: "10px",
//       boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
//       zIndex: 9999,
//       width: "360px", // wider
//       minHeight: "180px", // taller
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "space-between"
//     }}>
//       <div>
//         <h4 style={{ margin: "0 0 8px" }}>{alertData.deviceName}</h4>
//         <p style={{ fontSize: "16px", margin: 0 }}>{alertData.message}</p>
//       </div>
//       <button
//         style={{
//           alignSelf: "flex-end",
//           marginTop: "20px",
//           backgroundColor: isLight ? "#000" : "#fff",
//           color: isLight ? "#fff" : bgColor,
//           border: "none",
//           borderRadius: "4px",
//           padding: "8px 14px",
//           cursor: "pointer",
//           fontWeight: "bold"
//         }}
//         onClick={() => {
//           setVisible(false);
//           if (onStop) onStop();
//         }}
//       >
//         Stop
//       </button>
//     </div>
//   );
// }

// export default CustomAlert;


import React from "react";

function CustomAlert({ alertData, onStop }) {
  if (!alertData) return null;

  // Dynamic background color based on alert type
  const bgColor = {
    red: "#d9534f",
    orange: "#f0ad4e",
    yellow: "#f7e463"
  }[alertData.type || "red"]; // fallback to red

  const isLight = alertData.type === "yellow";

  return (
    <div style={{
      backgroundColor: bgColor,
      color: isLight ? "#000" : "#fff",
      padding: "24px 28px",
      borderRadius: "10px",
      boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
      width: "360px",
      minHeight: "180px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <div>
        <h4 style={{ margin: "0 0 8px" }}>{alertData.deviceName}</h4>
        <p style={{ fontSize: "16px", margin: 0 }}>{alertData.message}</p>
      </div>
      <button
        style={{
          alignSelf: "flex-end",
          marginTop: "20px",
          backgroundColor: isLight ? "#000" : "#fff",
          color: isLight ? "#fff" : bgColor,
          border: "none",
          borderRadius: "4px",
          padding: "8px 14px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
        onClick={onStop}
      >
        Stop
      </button>
    </div>
  );
}

export default CustomAlert;
