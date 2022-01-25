import io from "socket.io-client";

const ENDPOINT = "http://continium-socket.herokuapp.com";
export const socket = io(ENDPOINT,{transports: ['websocket', 'polling', 'flashsocket']});