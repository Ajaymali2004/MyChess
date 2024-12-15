const { Chess } =require ("chess.js");
const { GAME_OVER, INIT_GAME, MOVE }= require ("./message.js");
class Game {
  p1;
  p2;
  board;
  count;
  #startTime;
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.board = new Chess();
    this.#startTime = new Date();
    this.count = "white";
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
  }
  makeMove(socket, move) {
    try {
      this.board.move(move);
    } catch (e) {
      console.log(e);
      return;
    }
    if (this.board.isGameOver()) {
      this.p2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "b" ? "w" : "b",
          },
        })
      );
      this.p1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "b" ? "w" : "b",
          },
        })
      );
    }
    if (this.count === "white") {
      this.p2.send(
        JSON.stringify({
          type: MOVE,
          payload: { move: move },
        })
      );
      this.count = "black";
    } else {
      this.p1.send(
        JSON.stringify({
          type: MOVE,
          payload: { move: move },
        })
      );
      this.count = "white";
    }
  }
}

module.exports = Game;