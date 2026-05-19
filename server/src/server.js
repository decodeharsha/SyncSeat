/**
 * =============================================================================
 * server.js — Process entrypoint: env, HTTP server, realtime, listen
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Loads environment variables first, then creates the HTTP server, attaches
 *   Express (`createApp`) and Socket.IO (`attachSockets`), and starts listening.
 *   Keeping this file small makes production deployment and tooling predictable.
 *
 * LAYER: Bootstrap / runtime (side effects only).
 * =============================================================================
 */

// Load `.env` into `process.env` before any other module reads configuration.
import "dotenv/config";

import http from "http";
import { createApp } from "./app.js";
import { config } from "./config/index.js";
import { attachSockets } from "./sockets/index.js";

const app = createApp();
const httpServer = http.createServer(app);

attachSockets(httpServer);

httpServer.listen(config.port, () => {
  console.log(`SyncSeat API listening on http://localhost:${config.port}`);
  console.log(`Health: http://localhost:${config.port}/api/health`);
});
