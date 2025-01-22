import React, { useEffect, useState } from "react";
import { WS_URL } from "../../backendLinks";

export default function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const socketInstance = new WebSocket(`${WS_URL}?token=${token}`);
    
    socketInstance.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(socketInstance);
    };

    socketInstance.onmessage = (event) => {
      console.log("Message from server: ", event.data);
    };

    socketInstance.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };

    socketInstance.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    return () => {
      if (socketInstance.readyState === WebSocket.OPEN) {
        socketInstance.close();
      }
    };
  }, []);

  return socket;
}
