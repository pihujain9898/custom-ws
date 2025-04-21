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
wss.on("connection", (ws) => {
  // Extract client details
  const ip = req.socket.remoteAddress || 'unknown';
  const url = new URL(req.url, `ws://${config.host}`);
  const deviceId = url.searchParams.get('deviceId') || 'unknown';
  logger.info(`Client connected [ip=${ip}, deviceId=${deviceId}]`);
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (msg) => {
    logger.info(`Received message: ${msg}`);
    ws.send(`Echo: ${msg}`);
  });

  ws.on("close", () => logger.info(`Client disconnected [ip=${ip}, deviceId=${deviceId}]`));
  ws.on("error", (err) => logger.error(`WebSocket error: ${err.message}`));
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
