/**
 * =============================================================================
 * sockets/index.js — WebSocket / Socket.IO setup (real-time layer)
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Attaches Socket.IO to the same HTTP server as Express. Use this for live
 *   seat availability, waiting rooms, or admin dashboards. HTTP routes stay in
 *   `routes/`; real-time channels live here.
 *
 * LAYER: Real-time transport (parallel to REST; shares process & config).
 *
 * NOTE: Socket auth, namespaces, and event names will grow — keep handlers
 * small and delegate to `services/` just like HTTP controllers do.
 * =============================================================================
 */

import { Server } from "socket.io";
import { config } from "../config/index.js";

/** @type {import('socket.io').Server | null} */
let io = null;

/**
 * Attach Socket.IO to the HTTP server created in server.js.
 * @param {import('http').Server} httpServer
 */
export function attachSockets(httpServer) {
  const corsOrigin = config.corsOriginsParsed;

  io = new Server(httpServer, {
    cors: {
      origin: corsOrigin === true || (Array.isArray(corsOrigin) && corsOrigin.includes("*"))
        ? true
        : corsOrigin,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // Example: replace with room joins, seat sync, etc.
    socket.emit("syncseat:welcome", { message: "Connected to SyncSeat realtime" });
  });

  return io;
}

/** Access the Socket.IO instance after bootstrap (optional, for emitting from services). */
export function getIO() {
  return io;
}
