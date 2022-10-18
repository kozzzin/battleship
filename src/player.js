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


  generateDecisions() {
    const decisions = [];
    for (let row = 0; row < this.board.board.length; row++) {
      for (let col = 0; col < this.board.board.length; col++) {
       decisions.push([row,col]);
      }
    }
    return decisions;
  }

  makeDecision() {
    let decision = false;
    let decisions = this.generateDecisions();

    while(!decision) {
      if (decisions.length <= 0) decision = false;
      const randomChoice = Math.floor(Math.random() * decisions.length);
      const decisionCandidate = decisions.splice(randomChoice,1).flat();
      decision = this.checkSquare(decisionCandidate) === true ?
        decisionCandidate : false;
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

class Computer extends Player {
  constructor(name, board, enemy) {
    super(name, board);  
    this.enemy = enemy; 
    this.lastHit = false;
    this.possibleTurns = [];
    this.damagedShips = [];
  }

  makeDecision() {
    let decision = false;

    while(!decision) {
      let decisions;
      this.lastTurnWasHit();

      if (this.getDamagedShips().length > 0) {
        const coordinates = this.getPossibleShipsCoordinates();
        console.log(coordinates);
        if (coordinates.length > 0) {
          this.possibleTurns = coordinates;
        }
      }

      if (this.possibleTurns.length > 0) {
        decisions = this.possibleTurns;
      } else {
        decisions = this.generateDecisions();
      }

      if (decisions.length <= 0) decision = false;

      const randomChoice = Math.floor(Math.random() * decisions.length);
      const decisionCandidate = decisions.splice(randomChoice,1).flat();
      decision = this.checkSquare(decisionCandidate) === true ?
        decisionCandidate : false;
    }

    return decision;
  }

  // check all damaged ships, and find possible moves for last or missed
  getPossibleShipsCoordinates() {
    const damagedShips = this.getDamagedShips();
        const ship = damagedShips.splice(0,1)[0];
        this.damagedShips.push(ship);
        const axis = ship.getAxisByHits();
        let candidateMoves = [];
        if (axis == 'x') {
          ship.hits.forEach(
            (hit) => {
              candidateMoves.push(
                [
                  hit[0],
                  hit[1] - 1
                ],
                [
                  hit[0],
                  hit[1] + 1
                ]);
            }
          )
        } else if (axis == 'y') {
          ship.hits.forEach(
            (hit) => {
              candidateMoves.push(
                [
                  hit[0] - 1,
                  hit[1]
                ],
                [
                  hit[0] + 1,
                  hit[1]
                ]);
            }
          )     
        }

        return candidateMoves.filter(
          candidate => {
            return this.checkSquare(candidate) &&
            this.board.isInBoardBorders(candidate[0],candidate[1])
          }
        );
  }

  addDamagedShip(newShip, hit) {
    const included = this.damagedShips.find(
      (ship) => ship.name === newShip.name
    );
    if (included === undefined) {
      this.damagedShips.push(new DamagedShip(newShip.name,newShip,hit));
    } else {
      included.updateHits(hit);
    }
  }

  getDamagedShips() {
    return this.damagedShips.filter(
      (ship) => ship.isSunk() === false 
    );
  }

  getTurnsForDamagedShip(ship) {
    const axis = ship.getAxisByHits();
  }

  lastTurnWasHit() {
    try {
      const lastTurn = this.turns.slice(-1).flat();
      const x = lastTurn[0];
      const y = lastTurn[1];
      const ship  = this.enemy.board.board[x][y].value;
      const possibleMoves = [];
      if ((ship.hits >= 1) && (!ship.isSunk())) {
        this.addDamagedShip(ship,lastTurn);
        const matrix = [
          [-1, 0],
          [0,  1],
          [1,  0],
          [0, -1]
        ];

        matrix.forEach(
          (coordinates) => {
            const candidate =  [
              coordinates[0] + x,
              coordinates[1] + y,
            ];
            
            if (
              this.checkSquare(candidate) &&
              this.board.isInBoardBorders(candidate[0],candidate[1])
            ) {
              possibleMoves.push(candidate);
            }
          }
        );

        this.possibleTurns = possibleMoves;
      }
    } catch(err) {
      return false;
    }

    return true;
  }
}


class DamagedShip {
  constructor(name, ship, hits) {
    this.name = name;
    this.ship = ship;
    this.hits = [hits];
  }

  getAxisByHits() {
    if (this.hits.length < 2) return false;
    const firstTest = this.hits.slice(0,1).flat();
    const secondTest = this.hits.slice(-1).flat();
    if (firstTest[0] - secondTest[0] === 0) return 'x';
    if (firstTest[1] - secondTest[1] === 0) return 'y';
  }

  updateHits(coordinates) {
    this.hits.push(coordinates);
  }

  isSunk() {
    return this.ship.isSunk();
  }
}

module.exports = { Player, Computer }