const Game = require("./Game.js");
const {
  INIT_GAME,
  MOVE,
  PLAY_AGAIN_REQ,
  PLAY_AGAIN_RES,
  WAITING_FOR_FRIEND,
  CANCEL_CHALLENGE,
  CREAT_CHALLENGE,
  ACCEPT_CHALLENGE,
  RESIGN,
} = require("./message.js");

class GameManager {
  #games;
  #pendingUser;
  #tmpIDMap;

  constructor() {
    this.#games = [];
    this.#pendingUser = null;
    this.#tmpIDMap = new Map();
  }
  #checkForSameplayer(p1, p2) {
    if (p1.user._id === p2.user._id) {
      return true;
    }
    return false;
  }
  #handleCreateChallenge(tmpID, socket) {
    this.#tmpIDMap.set(tmpID, socket);
    socket.send(
      JSON.stringify({
        type: WAITING_FOR_FRIEND,
        payload: {
          message: "Waiting for your friend to join...",
        },
      })
    );
  }
  #handleAcceptChallenge(tmpID, socket) {
    if (this.#tmpIDMap.has(tmpID)) {
      const waitingSocket = this.#tmpIDMap.get(tmpID);
      if (this.#checkForSameplayer(socket, waitingSocket)) return;
      const newGame = new Game(waitingSocket, socket);
      this.#games.push(newGame);
      this.#tmpIDMap.delete(tmpID);
    }
  }
  #cancelTmpID(tmpID, socket) {
    if (this.#tmpIDMap.has(tmpID)) {
      const ws = this.#tmpIDMap.get(tmpID);
      if (ws === socket) {
        this.#tmpIDMap.delete(tmpID);
        socket.send(
          JSON.stringify({
            type: CANCEL_CHALLENGE,
            payload: { message: "You have canceled the waiting request." },
          })
        );
      }
    }
  }
  async addUser(socket) {
    socket.on("message", (data) => {
      const mssg = JSON.parse(data.toString());
      const game = this.#games.find(
        (game) => game.p1 === socket || game.p2 === socket
      );

      switch (mssg.type) {
        case INIT_GAME:
          if (this.#pendingUser) {
            if (this.#checkForSameplayer(socket, this.#pendingUser)) return;
            const newGame = new Game(this.#pendingUser, socket);
            this.#games.push(newGame);
            this.#pendingUser = null;
          } else {
            this.#pendingUser = socket;
          }
          break;

        case MOVE:
          if (game) {
            game.makeMove(mssg.payload.move, mssg.payload.promo);
          }
          break;

        case PLAY_AGAIN_REQ:
          if (game) {
            game.handlePlayAgainRequest(socket);
          }
          break;

        case PLAY_AGAIN_RES:
          if (game) {
            if (mssg.payload.accepted) {
              const nGame = new Game(game.p1, game.p2);
              this.#games.push(nGame);
              this.#games = this.#games.filter((g) => g !== game);
            } else {
              game.handlePlayAgainResponse(socket);
            }
          }
          break;
        case CREAT_CHALLENGE:
          this.#handleCreateChallenge(mssg.payload.tmpID, socket);
          break;
        case ACCEPT_CHALLENGE:
          this.#handleAcceptChallenge(mssg.payload.tmpID, socket);
          break;
        case CANCEL_CHALLENGE:
          this.#cancelTmpID(mssg.payload.tmpID, socket);
          break;
        case RESIGN:
          if (game) {
            game.handleResign(socket);
          }
      }
    });
  }

  async disconnect(socket) {
    if (this.#pendingUser && this.#pendingUser === socket) {
      this.#pendingUser = null;
    }
    for (const [tmpID, value] of this.#tmpIDMap.entries()) {
      if (value.socket === socket) {
        this.#tmpIDMap.delete(tmpID);
        break;
      }
    }
    this.#games = this.#games.filter(
      (game) => game.p1 !== socket && game.p2 !== socket
    );
  }
}

module.exports = { GameManager };
