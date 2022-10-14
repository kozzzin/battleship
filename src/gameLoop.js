const { Ship } = require('./ship');
const { Gameboard } = require('./board');
const { Player } = require('./player');
const { GameInterface } = require('./gameInterface');
const { EventAggregator } = require('./event');

class Game {
  constructor(name = 'Player') {
    this.player = new Player(
      name,
      new Gameboard(10),
    )
    this.enemy = new Player(
      'Comp',
      new Gameboard(10),
    );
    this.players = [
      this.player,
      this.enemy,
    ];
    this.current = 1;
    this.events = new EventAggregator();
    this.inter = new GameInterface();
    this.playerShipsPlaced = false;
  }

  updateGrid(x,y,axis,ship) {
    this.players[this.current].board.addShip(x,y,axis,ship);
    console.log(this.player.board.getPrintReadyBoard());
    this.inter.createGrid.call(this, this.player,'.player-container .board-grid');
    const nextShip = this.addNextShip(this.players[this.current]);
    if (nextShip) {
      this.inter.followCursor(nextShip);
    }
  }

  registerGridClick() {
    const handler = (event) => {
      let axis;
      let ship;

      try {
        axis = document.querySelector('.axis')
        .getAttribute('data-axis');
        ship = this.addNextShip(this.players[this.current]);
      } catch {
        document.querySelector('.player-container .board-grid').removeEventListener('mousedown', handler);
        document.querySelector('.player-container .board-grid').style = "pointer-events: none; cursor: none;"
        return;
      }

      window.events.publish(
        'squareClick',
        [
          parseInt(event.target.getAttribute('data-x')),
          parseInt(event.target.getAttribute('data-y')),
          document.querySelector('.axis')
            .getAttribute('data-axis'),
            ship,
        ]
      );
    }

    document.querySelector('.player-container .board-grid')
    .addEventListener('mousedown', handler);
  }

  start() {
    const player = this.nextTurn();
    // window.events.register('squareClick',this.player.board.addShip.bind(player.board));
    this.registerGridClick();
    window.events.register('squareClick',this.updateGrid.bind(this));

    window.events.register('playerShipsPlaced', () => {
      this.playerShipsPlaced = true;
    });

    this.inter.createGrid.call(this, player,'.player-container .board-grid');
    this.inter.addRotationButton();
    this.inter.followCursor(this.addNextShip(player));

    // waiting choice of player
    const waitPlayerChoice =  setInterval(() => {
      // playerShips = [];
      if (this.playerShipsPlaced) {
        clearInterval(waitPlayerChoice);
        this.inter.hideRotationButton();
        const computer = this.nextTurn();
        this.inter.addCompBoard();
        const compShips = this.giveShips();
        computer.placeShips(compShips);
        this.inter.createCompGrid(computer);
        this.inter.compGridListener(this.player, this.enemy);
        this.run();
      }
    }, 1000);
  }

  run() {
    console.log(this.enemy.board.getPrintReadyBoard());

    // implement loop with interval for players
    // maybe use await ?
    // while not all sunk, give turn
    // wait for turn
    // check condition
    // repeat once more
  }

  addNextShip(player, x, y, axis) {
    const index = player.board.ships.length;
    const ships = this.giveShips();
    if (index > 4) {
      window.events.publish('playerShipsPlaced');
      return false;
    }
    return ships[index];
  }


  giveShips() {
    return [
      new Ship(5),
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
    ];
  }

  shipsPlaced() {

  }

  gameEnded() {

  }

  nextTurn() {
    if (this.current === 0) {
      this.current = 1;
    } else {
      this.current = 0;
    }
    return this.players[this.current];
  }
}

const game = new Game();


document.addEventListener('DOMContentLoaded',() => {
  game.start();
})






// give list of ships to first player
// receive choice of the first player
// give list of ships to first player
// when ready, receive choice of AI
// give turn to first player
// check results
// -- if no ships, end game
// -- show the winner
// give tuen to second player
// -- repeat check
// continue until one of players don't win


module.exports = { Game }