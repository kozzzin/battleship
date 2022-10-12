class Ship {
  constructor(size) {
    this.size = size;
    this.hits = 0;
    this.name = this.getName(size);
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return (this.size - this.hits) <= 0;
  }

  getName(size) {
    const threeNames = ['Destroyer','Submarine'];
    switch(size) {
      case 5: return 'Carrier';
      case 4: return 'Battleship';
      case 3: return threeNames.shift();
      case 2: return 'Patrol Boat';
    }
  }

}

module.exports = { Ship }