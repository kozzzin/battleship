const { Ship } = require('./ship');
const { Gameboard } = require('./board');
const { Computer, Player } = require('./player');
const { GameInterface } = require('./gameInterface');
const { EventAggregator } = require('./event');

class Game {
  constructor(name = 'Player') {
    this.player = new Player(
      name,
      new Gameboard(10),
    )
    this.enemy = new Computer(
      'Comp',
      new Gameboard(10),
      this.player,
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
        document.querySelector('.player-container .board-grid').style = "pointer-events: none; cursor: not-allowed;"
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


  getPlayerInterface(name) {
    const player = this.nextTurn();
    this.inter.addBoard('player-container',name);
    this.registerGridClick();
    this.inter.createGrid.call(this, player,'.player-container .board-grid');
    this.inter.addRotationButton();
    this.inter.followCursor(this.addNextShip(player));
    window.events.register('squareClick',this.updateGrid.bind(this));
    window.events.register('playerShipsPlaced', () => {
      this.playerShipsPlaced = true;
    });
  }

  start() {
    // win modal
    // replay button

    this.inter.postMessage('Prepare your fleet');

    const waitPlayerChoice =  setInterval(() => {
      // playerShips = [];
      if (this.playerShipsPlaced) {
        clearInterval(waitPlayerChoice);
        this.inter.hideRotationButton();
        const computer = this.nextTurn();
        this.inter.addBoard();
        const compShips = this.giveShips();
        computer.placeShips(compShips);
        this.inter.createCompGrid(computer);
        this.inter.compGridListener(
          this.player,
          this.enemy,
          this.receiveAttack.bind(this));
        this.run();
      }
    }, 1000);
  }

  receiveAttack(x,y, player, enemy) {
    const attack = enemy.board.receiveAttack(x, y);
    if (attack) {
      this.inter.createCompGrid(enemy);
      this.inter.compGridListener(
        player,
        enemy,
        this.receiveAttack.bind(this)
      );

      
      if (attack === 'hit') {
        if (enemy.board.board[x][y].value.isSunk()) {
          this.inter.postMessage(
            `Enemy ${enemy.board.board[x][y].value.name} is sunk`
          );
        } else {
          this.inter.postMessage(`You ${attack}`);
        }
      } else {
        this.inter.postMessage(`You ${attack}`);
      }
      
      if (enemy.board.shipsAreSunk()) {
        this.inter.showModal('YOU WON');
        return;
      }
      setTimeout(() => {
        const compTurn = enemy.turn(...enemy.makeDecision());
        const result = player.board.receiveAttack(...compTurn);
        this.inter.postMessage(`Enemy ${result}`);
        this.inter.createGrid(player,'.player-container .board-grid');
        if (player.board.shipsAreSunk()) this.inter.showModal('COMPUTER WON');
      }, 1000);
    }
  }

  run() {
    console.log(this.enemy.board.getPrintReadyBoard());
    this.inter.postMessage('Your turn');
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



module.exports = { Game }