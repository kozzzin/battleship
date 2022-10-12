class Gameboard {
  constructor(size) {
    this.board = this.create(size);
    this.ships = [];
  }

  create(size) {
    const boardArray = [];
    for (let i = 0; i <= size - 1; i++) {
      const boardLine = Array(size)
        .fill('')
        .map(el => new Square);
      boardArray.push(boardLine);
    }

    return boardArray;
  }

  setLimits(x, y, axis, length) {
    const limits = {};
    if (axis === 'x') {
      limits.yLimit = y + length - 1;
      limits.xLimit = x;
    }
    
    if (axis === 'y') {
      limits.yLimit = y;
      limits.xLimit = x + length - 1;
    }
    return limits;
  }

  iterateSquares(x, y, length, axis, cb) {
    const { xLimit, yLimit } = this.setLimits(x, y, axis, length);
    let index = 0;
    for (let row = x; row <= xLimit; row++) {
      for (let col = y; col <= yLimit; col++) {
        cb(row, col);
      }
    }
  }

  addShip(x, y, axis, ship) {
    const shipSize = ship.size;

    if (this.isEnoughSpace(x, y, axis, shipSize)) {
      this.iterateSquares(x, y, shipSize, axis, (row, col) => {
        this.updateSquare(row, col, ship);
      });
      this.ships.push(ship);
    } else {
      return false;
    }
    return true
  }

  //method for testing
  getSpan(x, y, axis, length) {
    const getArray = [];

    this.iterateSquares(x, y, length, axis, (row, col) => {
      let square = this.board[row][col];
      getArray.push(square);
    });

    return getArray;
  }

  isEnoughSpace(x, y, axis, size) {
    let result = true;
    this.iterateSquares(x, y, size, axis, (row, col) => {
      if (
        this.isInBoardBorders(row, col) === false ||
        this.isEmptySquare(row, col) === false
      ) {
        result = false;
        return;
      }
    });
    return result;
  }

  isEmptySquare(x,y) {
    if (this.board[x][y].value !== undefined) return false;
    if (this.board[x][y].hit !== 0) return false;
    return true;
  }

  isInBoardBorders(x,y) {
    if (x >= this.board.length) return false;
    if (y >= this.board.length) return false;
    return true;
  }

  updateSquare(x, y, value) {
    this.board[x][y].update(value);
  }

  // check if is sunk during game loop
  // check all ships
  receiveAttack(x,y) {
    const square = this.board[x][y];
    square.hit += 1;
    if (square.value !== undefined) {
      square.value.hit();
      return true;
    }
    return false;
  }

  shipsAreSunk() {
    return this.ships.every(el => el.isSunk());
  }
}

class Square {
  constructor() {
    this.value = undefined;
    this.hit = 0;
  }

  update(value) {
    this.value = value;
  }

}


module.exports = { Gameboard }
