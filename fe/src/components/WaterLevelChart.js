// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const dummyData = [
//   { timestamp: new Date().toISOString(), waterLevel: 4 },
//   { timestamp: new Date(Date.now() + 60000).toISOString(), waterLevel: 7 },
//   { timestamp: new Date(Date.now() + 120000).toISOString(), waterLevel: 5 },
//   { timestamp: new Date(Date.now() + 180000).toISOString(), waterLevel: 8.52 },
//   { timestamp: new Date(Date.now() + 240000).toISOString(), waterLevel: 6 },
// ];

// // Get the latest value
// const latest = dummyData[dummyData.length - 1].waterLevel;

// function WaterLevelChart() {
//   return (
//     <div
//       className="card p-3 mt-4 position-relative"
//       style={{ backgroundColor: "#0d1117", borderRadius: "12px" }}
//     >
//       <div className="d-flex justify-content-between align-items-center mb-2">
//         <h5 className="text-light mb-0">Water Level</h5>
//         <h4 className="text-success mb-0">
//           {latest} <small className="text-muted">cm</small>
//         </h4>
//       </div>

//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={dummyData}>
//           <CartesianGrid stroke="#444" strokeDasharray="3 3" />
//           <XAxis
//             dataKey="timestamp"
//             tickFormatter={(tick) =>
//               new Date(tick).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             }
//             stroke="#aaa"
//           />
//           <YAxis
//             domain={[0, "auto"]}
//             label={{
//               value: "Water Level (cm)",
//               angle: -90,
//               position: "insideLeft",
//               style: { fill: "#ccc", fontSize: 12 },
//             }}
//             tick={{ fill: "#ccc", fontSize: 12 }}
//             tickFormatter={(value) => `${value}`}
//           />
//           <Tooltip formatter={(value) => `${value} cm`} />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="waterLevel"
//             stroke="#FFD700" // Optional: yellow to match ref image
//             strokeWidth={2}
//             dot={false}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// export default WaterLevelChart;


import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function WaterLevelChart({ history = [], waterLevel }) {
  const data = history.map((entry) => ({
    time: new Date(entry.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    waterLevel: entry.value,
  }));

  return (
    <div
      className="card p-2 mt-2 position-relative"
      style={{ backgroundColor: "#0d1117", borderRadius: "12px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-light mb-0">Water Level</h6>
        <h6 className="text-success mb-0">
          {waterLevel} <small className="text-muted">cm</small>
        </h6>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid stroke="#444" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            stroke="#aaa"
            tick={{ fontSize: 10 }}
          />
          <YAxis
            domain={[0, "auto"]}
            label={{
              value: "Water Level (cm)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#ccc", fontSize: 10 },
            }}
            tick={{ fill: "#ccc", fontSize: 10 }}
          />
          <Tooltip formatter={(value) => `${value} cm`} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey="waterLevel"
            stroke="#FFD700"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WaterLevelChart;
