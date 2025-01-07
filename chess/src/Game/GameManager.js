const Game = require("./Game.js");
const { GAME_OVER, INIT_GAME, MOVE } = require("./message.js");

class GameManager {
  #games;
  #pendingUser;
  #users;

  constructor() {
    this.#games = [];
    this.#users = [];
    this.#pendingUser = null;
  }
  addUser(socket) {
    this.#users.push(socket);
    this.#addHandler(socket);
  }
  removeUser(socket) {
    this.#users = this.#users.filter((user) => user !== socket);
  }
  #addHandler(socket) {
    socket.on("message", (data) => {
      const mssg = JSON.parse(data.toString());
      if (mssg.type === INIT_GAME) {
        if (this.#pendingUser) {
          const game = new Game(this.#pendingUser, socket);
          this.#games.push(game);
          this.#pendingUser = null;
        } else {
          this.#pendingUser = socket;
        }
      } else if (mssg.type === MOVE) {
        const game = this.#games.find(
          (game) => game.p1 === socket || game.p2 === socket
        );
        if (game) {
          game.makeMove(mssg.payload.move, mssg.payload.promo);
        }
      }
    });
  }
}

module.exports = { GameManager };
