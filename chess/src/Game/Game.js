const { Chess } = require("chess.js");
const WebSocket = require("ws");
const {
  GAME_OVER,
  INIT_GAME,
  MOVE,
  PLAY_AGAIN_RES,
  PLAY_AGAIN_REQ,
  TIMER_UPDATE,
} = require("./message.js");
class Game {
  p1;
  p2;
  board;
  status;
  whiteTimer;
  blackTimer;
  timerInterval;
  movesHistory;
  winner;
  reason;
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.p1.id = p1.id;
    this.p2.id = p2.id;
    this.board = new Chess();
    this.whiteTimer = 600;
    this.blackTimer = 600;
    this.winner = null;
    this.reason = "";
    this.movesHistory = [];
    this.p1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
          Me: this.p1.user.username,
          Opponent: this.p2.user.username,
        },
      })
    );
    this.p2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
          Me: this.p2.user.username,
          Opponent: this.p1.user.username,
        },
      })
    );

    this.timerInterval = setInterval(() => this.updateTimers(), 1000);
    this.p1.on("close", () => this.handleDisconnection("Player 1"));
    this.p2.on("close", () => this.handleDisconnection("Player 2"));
    this.connectionMonitor = setInterval(() => {
      if (this.p1.readyState === WebSocket.CLOSED) {
        this.handleDisconnection("Player 1");
        clearInterval(this.connectionMonitor); // Stop further checks
      }
      if (this.p2.readyState === WebSocket.CLOSED) {
        this.handleDisconnection("Player 2");
        clearInterval(this.connectionMonitor); // Stop further checks
      }
    }, 5000);
  }
  updateTimers() {
    if (this.board.turn() === "w" && this.whiteTimer > 0) {
      this.whiteTimer--;
    } else if (this.board.turn() === "b" && this.blackTimer > 0) {
      this.blackTimer--;
    }
    this.p1.send(
      JSON.stringify({
        type: TIMER_UPDATE,
        payload: {
          whiteTimer: this.whiteTimer,
          blackTimer: this.blackTimer,
        },
      })
    );
    this.p2.send(
      JSON.stringify({
        type: TIMER_UPDATE,
        payload: {
          whiteTimer: this.whiteTimer,
          blackTimer: this.blackTimer,
        },
      })
    );
    if (this.whiteTimer === 0 || this.blackTimer === 0) {
      this.winner = this.whiteTimer === 0 ? "b" : "w";
      this.reason = "TIME_OUT";
      this.Game_over();
      clearInterval(this.timerInterval);
    }
  }
  handleDisconnection(player) {
    if (this.winner !== null) return;
    this.winner = player === "Player 1" ? "b" : "w";
    this.reason = "Opponent_Ran_Away";
    this.Game_over();
  }
  handleResign(player) {
    if (this.winner !== null) return;
    this.winner = player === this.p1 ? "b" : "w";
    this.reason = "Resignation";
    this.Game_over();
    clearInterval(this.timerInterval);
  }
  Game_over() {
    this.p1.send(
      JSON.stringify({
        type: GAME_OVER,
        payload: { winner: this.winner, reason: this.reason },
      })
    );
    this.p2.send(
      JSON.stringify({
        type: GAME_OVER,
        payload: { winner: this.winner, reason: this.reason },
      })
    );
    return;
  }
  makeMove(move, promo) {
    try {
      let moveResult;
      if (promo) {
        const fullMove = { ...move, promotion: "q" };
        moveResult = this.board.move(fullMove);
      } else {
        moveResult = this.board.move(move);
      }
      if (!moveResult) return;
      this.movesHistory.push(moveResult.san);
    } catch (e) {
      return;
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
    if (this.board.isGameOver()) {
      this.winner = this.board.turn() === "b" ? "w" : "b";
      if (this.board.isCheckmate()) {
        this.reason = "Checkmate";
      } else if (this.board.isStalemate()) {
        this.reason = "Stalemate";
        this.winner = "draw";
      } else if (this.board.isInsufficientMaterial()) {
        this.reason = "Insufficient Material";
        this.winner = "draw";
      } else if (this.board.isThreefoldRepetition()) {
        this.reason = "Threefold Repetition";
        winner = "draw";
      } else if (this.board.isDraw()) {
        this.reason = "50-Move Rule";
        this.winner = "draw";
      }
      this.Game_over();
      clearInterval(this.timerInterval);
      return;
    }
  }
  handlePlayAgainRequest(player) {
    const opponent = player === this.p1 ? this.p2 : this.p1;
    if (opponent)
      opponent.send(
        JSON.stringify({
          type: PLAY_AGAIN_REQ,
        })
      );
    else {
      player.send(
        JSON.stringify({
          type: PLAY_AGAIN_RES,
          payload: {
            accepted: false,
          },
        })
      );
    }
  }
  handlePlayAgainResponse(player) {
    const reqSender = player === this.p1 ? this.p2 : this.p1;
    if (reqSender) {
      reqSender.send(
        JSON.stringify({
          type: PLAY_AGAIN_RES,
          payload: {
            accepted: false,
          },
        })
      );
    }
  }
}

module.exports = Game;
