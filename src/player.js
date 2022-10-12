class Player {
  constructor(name, board) {
    this.name = name;
    this.turns = [];
    this.board = board;
  }

  turn(x, y) {
    if (x === undefined || y === undefined) {
      return false;
    }
    this.turns.push([x,y]);
    return [x,y];
  }

  makeDecision() {
    let decision = false;
    let decisions = [];
    for (let row = 0; row < this.board.board.length; row++) {
      for (let col = 0; col < this.board.board.length; col++) {
       decisions.push([row,col]);
      }
    }

    while(!decision) {
      if (decisions.length <= 0) decision = false;
      const randomChoice = Math.floor(Math.random() * decisions.length);
      const decisionCandidate = decisions.splice(randomChoice,1).flat();
      decision = this.checkSquare(decisionCandidate) === true ? decisionCandidate : false;
    }

    return decision;
  }

  checkSquare(square) {
    const [x,y] = square;
    return this.turns.every(turn => {
      return JSON.stringify(turn) !== JSON.stringify(square);
    });
  }

  placeShips(shipArray) {
    shipArray.forEach(ship => this.placeShip(ship));
  }

  placeShip(ship) {
    let placed = false;
    const axises = ['x','y'];

    while(!placed) {
      const axis = axises[Math.floor(Math.random() * 2)];
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      placed = this.board.addShip(x, y, axis, ship);
    }
  }
}

module.exports = { Player }