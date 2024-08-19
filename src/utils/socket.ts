import { io } from 'socket.io-client';

const URL: string = String(import.meta.env.VITE_SOCKET_HOST);
const socket = io(URL);

export { socket };