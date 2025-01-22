require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.Secret;

const wsConnection = async (ws,req,gameManager)=> {
  try {
    const urlParams = new URLSearchParams(req.url.split("?")[1]);
    const token = urlParams.get("token");
    if (!token) {
      ws.close(4001, "Authentication required");
      return;
    }
    
    const data = jwt.verify(token.trim(), JWT_SECRET);
    const user = data.user;
    if (!user) {
      ws.close(4002, "Invalid user");
      return;
    }

    ws.user = user;
    gameManager.addUser(ws);

    ws.on("close", () => {
      gameManager.disconnect(ws);
    });
  } catch (err) {
    console.error("Connection error:", err.message);
    ws.close(4003, "Invalid or expired token");
  }
}

module.exports = { wsConnection };
