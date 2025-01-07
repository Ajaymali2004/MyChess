import React, { useEffect, useState } from "react";
const WS_URL = "https://mychess-connector.onrender.com";

export default function useSocket() {
  const [soket, setSocket] = useState(null);
  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(socket);
    };

    socket.onmessage = (event) => {
      console.log("Message from server: ", event.data);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error: ", error);
    };

    return () => socket.close();
  }, []);
  return soket;
}
