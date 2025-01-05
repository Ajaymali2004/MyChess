const { Chess } = require("chess.js");
const WebSocket = require("ws");
const { GAME_OVER, INIT_GAME, MOVE } = require("./message.js");
class Game {
  p1;
  p2;
  board;
  onGoing;
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.board = new Chess();
    this.onGoing = false;
    this.p1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.p2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
    this.p1.on("close", () => this.handleDisconnection("Player 1"));
    this.p2.on("close", () => this.handleDisconnection("Player 2"));
    this.connectionMonitor = setInterval(() => {
      if (this.p1.readyState === WebSocket.CLOSED) {
        console.log("Player 1 connection lost");
        this.handleDisconnection("Player 1");
        clearInterval(this.connectionMonitor); // Stop further checks
      }
      if (this.p2.readyState === WebSocket.CLOSED) {
        console.log("Player 2 connection lost");
        this.handleDisconnection("Player 2");
        clearInterval(this.connectionMonitor); // Stop further checks
      }
    }, 5000);
  }
  handleDisconnection(player) {
    console.log(`${player} disconnected`);
    if (player === "Player 1") {
      this.Game_over("b",this.p2);
    } else {
      this.Game_over("w",this.p1);
    }
  }
  Game_over(winner,player){
      player.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: { winner },
        })
      )
    return;
  }
  makeMove( move, promo) {
    try {
      if (promo) {
        const fullMove = { ...move, promotion: "q" };
        this.board.move(fullMove);
        console.log(this.board.ascii());
      } else {
        this.board.move(move);
      }
    } catch (e) {
      console.error("Invalid move:", e.message);
      return;
    }
    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "b" ? "w" : "b";
      this.Game_over(winner,this.p1);
      this.Game_over(winner,this.p2);
    }
    this.p1.send(
      JSON.stringify({
        type: MOVE,
        payload: { move, promo },
      })
    );
    this.p2.send(
      JSON.stringify({
        type: MOVE,
        payload: { move, promo },
      })
    );
  }
}

module.exports = Game;
