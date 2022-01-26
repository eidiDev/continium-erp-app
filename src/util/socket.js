import io from "socket.io-client";

const ENDPOINT = "https://continium-socket.herokuapp.com";
export const socket = io(ENDPOINT,{transports: ['websocket', 'polling', 'flashsocket']});