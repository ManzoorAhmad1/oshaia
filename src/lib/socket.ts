import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.oshaia.com/api').replace('/api', '');
    socket = io(BACKEND_URL, {
      autoConnect: true,
      reconnection: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}
