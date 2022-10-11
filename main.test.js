const { Ship } = require('./src/ship');

describe('Ship test', () => {
  let ship;
  const size = 5;

  beforeEach(() => {
    ship = new Ship(size);
  });

  it('ship created', () => {
    expect(ship)
      .toEqual({
        size: size,
        hits: 0,
      });
  });

  it('was shot', () => {
    ship.hit();
    expect(ship.hits)
      .toBe(1);
  });

  it('is not sunk', () => {
    ship.hit();
    expect(ship.isSunk())
      .toBe(false);
  });

  it('is sunk', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk())
      .toBe(true);
  });

  
});


describe('Gameboard', () => {
  it('gameboard created', () => {

  });

  it('ship added', () => {

  });

  it('don\'t overlap another ship', () => {

  });

  it('don\'t cross borders of board', () => {

  });

  it('there are ships', () => {

  });

  it('all ships is sunk', () => {

  });
});
