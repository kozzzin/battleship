class Ship {
  constructor(size) {
    this.size = size;
    this.hits = 0;
    // this.name = this.getName();
    // we have two ships of a same size
    // where to name them?
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return (this.size - this.hits) <= 0;
  }

}









module.exports = { Ship }