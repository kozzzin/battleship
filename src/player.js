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
      const random = Math.floor(Math.random() * decisions.length);
      const decisionCandidate = decisions.splice(random,1).flat();
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

  placeShips() {
    // place first
    // place second
    // place third
    // place forth
    // fifth

    // check all rules

    // maybe move this to game loop
    // because we place ship on board
    // but using logic inside player object

    // because we have steps for computer and player
    // and they are the same
  }
}

module.exports = { Player }



// assigning of the board belongs to game loop
// also checking the end of game
// also voving names of ships
// 