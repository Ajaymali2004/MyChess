require("dotenv").config();
const { WebSocketServer } = require("ws");
const { GameManager } = require("./src/Game/GameManager.js");
const { wsConnection } = require("./src/controller/wss.js");
const PORT = process.env.PORT || 8080;
const connectToWSS = () => {
  const wss = new WebSocketServer({ host: "0.0.0.0", port: PORT });

  const gameManager = new GameManager();

  wss.on("connection", (ws, req) => wsConnection(ws, req, gameManager));
  wss.on("error", (err) => {
    console.log(`WebSocket error: ${err.message}`);
  });
};
connectToWSS();
