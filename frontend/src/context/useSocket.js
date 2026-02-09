import { useContext } from "react";
import { SocketContext } from "./socketContext";

// Hook that returns the actual socket instance (or null before it connects)
export const useSocket = () => {
  const socketRef = useContext(SocketContext);
  return socketRef?.current ?? null;
};

