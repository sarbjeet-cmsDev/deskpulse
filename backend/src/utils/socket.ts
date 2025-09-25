import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Logger } from '@nestjs/common';

export const userSockets = new Map<string, string>();

let io: Server;
const SocketLogger = new Logger('SocketLogger');

export function initSocketIO(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: `${process.env.SOCKET_FRONTEND}`,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    SocketLogger.log(`Socket connected with ID: ${socket.id}`);

    // Register user by userId and map to socket.id
    socket.on("register-user", (userId: string) => {
      userSockets.set(userId, socket.id);
      SocketLogger.log(`Registered user: ${userId} → ${socket.id}`);

      for (const [uid, sid] of userSockets.entries()) {
        SocketLogger.log(`${uid}: ${sid}`);
      }
    });

    // Handle task updates and notify receiver
    socket.on(
      "task-updated",
      ({
        taskId,
        sender,
        receiverId,
        description,
      }: {
        taskId: string;
        sender: string;
        receiverId: string;
        description: string;
      }) => {

         SocketLogger.log(`Task updated --> TaskId: ${taskId}, Sender: ${sender}, ReceiverId: ${receiverId}`);

        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          SocketLogger.log(`receiver id: ${receiverSocketId}`);
          io.to(receiverSocketId).emit("receive-notification", {
            message: `${sender} ${description}`,
            taskId,
          });

          SocketLogger.log(`Notification sent to user ${receiverId} on socket ${receiverSocketId}`);

        } else {
          SocketLogger.log(`User ${receiverId} not connected — cannot send notification`);

        }
      }
    );

    // Handle disconnects - remove user mapping
    socket.on("disconnect", () => {
      for (const [userId, sid] of userSockets.entries()) {
        if (sid === socket.id) {
          userSockets.delete(userId);
          SocketLogger.log(`User disconnected: ${userId}`);
          break;
        }
      }
    });
  });
}

export function getIO(): Server {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
}


