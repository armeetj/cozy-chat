import { createContext } from "react";
import { io } from "socket.io-client";
// export const socket = io("ws://131.215.171.170:4000", {
export const socket = io("ws://10.8.29.136:4000", {
  
  reconnectionDelayMax: 10000,
});
export const SocketContext = createContext();
