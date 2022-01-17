import io from "socket.io-client";

const ENDPOINT = "http://localhost:3001";
export const socket = io(ENDPOINT,{transports: ['websocket', 'polling', 'flashsocket']});