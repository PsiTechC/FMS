import { useEffect, useRef } from "react";

function useWebSocket(onMessageHandler) {
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      if (!isMounted) return;

      socketRef.current = new WebSocket("ws://localhost:5000/ws/live");

      socketRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📦 WebSocket data received:", data);

        if (onMessageHandler) {
          onMessageHandler(data);
        }
      };

      socketRef.current.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        socketRef.current.close();
      };

      socketRef.current.onclose = () => {
        console.warn("⚠️ WebSocket disconnected. Retrying in 3s...");
        reconnectTimerRef.current = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimerRef.current);
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [onMessageHandler]);
}

export default useWebSocket;
