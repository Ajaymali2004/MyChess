const { WebSocketServer } = require("ws");
const { GameManager } = require("./src/Game/GameManager.js");
const wss = new WebSocketServer({ host: '0.0.0.0',port: 8080 });

const connectToWSS = () => {
  const gameManager = new GameManager();
  wss.on("connection", function connection(ws) {
    gameManager.addUser(ws);
    console.log("connected");
  });   
  wss.on("close", () => {
    console.log("Client disconnected");
    gameManager.removeUser(ws);
  });

  wss.on("error", (err) => {
    console.log(`WebSocket error: ${err.message}`);
  });
};
connectToWSS();
