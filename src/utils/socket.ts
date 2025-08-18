// lib/socket.ts

import { io, Socket } from "socket.io-client";

// Define custom types (optional but good practice)
interface ServerToClientEvents {
  "receive-message": (message: string) => void;
   // Add this event here:
  "receive-notification": (data: {
    message: string;
    taskId: string;
  }) => void;
   "notification-count": (data: { count: number }) => void;
}

interface ClientToServerEvents {
  "send-message": (message: string) => void;
  "register-user": (userId: string) => void;
  "task-updated": (data: {taskId: string;sender: string;receiverId: string;description: string;}) => void;
}

const SOCKET_URL = `${process.env.NEXT_PUBLIC_BACKEND_HOST}`; // adjust if needed

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const getSocket = (): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false, // we'll manually call connect()
      transports: ["websocket"], // optional: force WebSocket to avoid polling errors
    });
  }
  return socket;
};
