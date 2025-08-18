// src/utils/socket.ts

import { Server } from "socket.io";
import { Server as HttpServer } from "http";

// Map userId -> socketId
export const userSockets = new Map<string, string>();

let io: Server;

/**
 * Initialize Socket.IO server on the provided HTTP server instance
 */
export function initSocketIO(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: `${process.env.SOCKET_FRONTEND}`,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected with ID:", socket.id);

    // Register user by userId and map to socket.id
    socket.on("register-user", (userId: string) => {
      userSockets.set(userId, socket.id);
      console.log(`✅ Registered user: ${userId} → ${socket.id}`);
      console.log("📋 Connected users:");
      for (const [uid, sid] of userSockets.entries()) {
        console.log(`- ${uid}: ${sid}`);
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
        console.log("📨 Task updated:", { taskId, sender, receiverId });

        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-notification", {
            message: `${sender} ${description}`,
            taskId,
          });

          console.log(
            `🔔 Notification sent to user ${receiverId} on socket ${receiverSocketId}`
          );
        } else {
          console.log(
            `⚠️ User ${receiverId} not connected — cannot send notification`
          );
        }
      }
    );

    // Handle disconnects - remove user mapping
    socket.on("disconnect", () => {
      for (const [userId, sid] of userSockets.entries()) {
        if (sid === socket.id) {
          userSockets.delete(userId);
          console.log(`❌ User disconnected: ${userId}`);
          break;
        }
      }
    });
  });
}

/**
 * Get Socket.IO server instance
 */
export function getIO(): Server {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
}


