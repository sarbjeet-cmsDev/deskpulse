

import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  "receive-message": (message: string) => void;
  "receive-notification": (data: {
    message: string;
    taskId: string;
  }) => void;
  "notification-count": (data: { count: number }) => void;
}

interface ClientToServerEvents {
  "send-message": (message: string) => void;
  "register-user": (userId: string) => void;
  "task-updated": (data: { taskId: string; sender: string; receiverId: string; description: string; }) => void;
}

const SOCKET_URL = `${process.env.NEXT_PUBLIC_BACKEND_HOST}`;

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const getSocket = (): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true,
    });
  }
  return socket;
};
