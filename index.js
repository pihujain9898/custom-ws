// server.js
const WebSocket = require("ws");
const config = require("./config/config");
const logger = require("./config/logger");
const catchErrors = require("./utils/errorHandler");

// Handle unhandled exceptions/rejections
catchErrors();

// Create WebSocket server
const wss = new WebSocket.Server({ host: config.host, port: config.port });
logger.info(`WebSocket server listening on ws://${config.host}:${config.port}`);

// Setup connection handling
wss.on("connection", (ws, req) => {
  // Extract client details
  const ip = req.socket.remoteAddress || "unknown";

  // Parse the URL so we can grab ?channel=…
  let channel = "default";
  if (req.url) {
    try {
      const url = new URL(req.url, `ws://${config.host}`);
      channel = url.searchParams.get("channel") || channel;
    } catch (err) {
      logger.warn(`Invalid WS URL: ${req.url}`);
    }
  }

  // Attach channel to this socket
  ws.channel = channel;
  logger.info(`Client connected [ip=${ip}, channel=${channel}]`);
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (msg) => {
    logger.info(`Received message on channel=${ws.channel}: ${msg}`);

    // Broadcast to every other client in the same channel
    wss.clients.forEach((client) => {
      if (
        client !== ws &&
        client.readyState === WebSocket.OPEN &&
        client.channel === ws.channel
      ) {
        client.send(`Broadcast: ${msg}`);
      }
    });
  });

  ws.on("close", () =>
    logger.info(`Client disconnected [ip=${ip}, channel=${channel}]`)
  );
  ws.on("error", (err) =>
    logger.error(`WebSocket error on channel=${ws.channel}: ${err.message}`)
  );
});

// Heartbeat interval to detect dead connections
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      logger.warn("Terminating dead client");
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, config.heartbeatInterval);

// Graceful shutdown
["SIGINT", "SIGTERM"].forEach((sig) => {
  process.on(sig, () => {
    logger.info(`${sig} received. Shutting down.`);
    clearInterval(interval);
    wss.close(() => {
      logger.info("WebSocket server closed");
      process.exit(0);
    });
  });
});
