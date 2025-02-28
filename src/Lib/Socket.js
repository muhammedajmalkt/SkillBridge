import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:9000";

export const socket = io(SOCKET_URL, {
  autoConnect: false, //  manually connect
  transports:["websocket","polling"]
});
