const { Ship } = require('./src/ship');
const { Gameboard } = require('./src/board');
const { Player } = require('./src/player');
const { Game } = require('./src/gameLoop');

describe('Ship', () => {
  let ship;
  const size = 5;

  beforeEach(() => {
    ship = new Ship(size);
  });

  it('created', () => {
    expect(ship)
      .toEqual({
        size: size,
        hits: 0,
        name: 'Carrier'
      });
  });

  it('was shot', () => {
    ship.hit();
    expect(ship.hits)
      .toBe(1);
  });

  it('hitted, but not sunk', () => {
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
  let board;
  const size = 5;

  beforeEach(() => {
    board = new Gameboard(10);
  });

  it('created', () => {
    //width
    expect(board.board.length)
      .toBe(10);
    // height
    expect(board.board[0].length)
    .toBe(10);
  });

  it('ship added vertical', () => {
    const ship = new Ship(5);
    const expObj = {
      value: ship,
      hit: 0
    }
    const expected = [expObj, expObj, expObj, expObj, expObj]
    const x = 0;
    const y = 0;
    const axis = 'y';

    expect(board.addShip(x,y,axis,ship))
      .toBe(true);
    expect(board.getSpan(x, y, axis, 5))
      .toEqual(expected);
      
  });

  it('ship added horizontal', () => {
    const ship = new Ship(5);
    const expObj = {
      value: ship,
      hit: 0
    }
    const expected = [expObj, expObj, expObj, expObj, expObj]
    const x = 0;
    const y = 0;
    const axis = 'x';

    expect(board.addShip(x,y,axis,ship))
      .toBe(true);
    expect(board.getSpan(x, y, axis, 5))
      .toEqual(expected);
      
  });

  it('don\'t cross borders of board and overlap ships', () => {
    const ship = new Ship(5);
    // crossed bottom border
    expect(board.addShip(6,0,'y',ship))
      .toBe(false);
    // crosssed right border
    expect(board.addShip(0,6,'x',ship))
      .toBe(false);
    // overlap other ship
    board.addShip(0,0,'y',ship);
    expect(board.addShip(0,0,'x',ship))
      .toBe(false);
  });

  // missed attack
  it('miss shot', () => {
    const x = 0;
    const y = 0;
    expect(board.receiveAttack(x,y))
      .toBe(false);
    expect(board.board[x][y])
      .toEqual({
        value: undefined,
        hit: 1
      });
  })

  // have hit
  it('hit the target', () => {
    const x = 0;
    const y = 0;
    board.addShip(x, y, 'y', new Ship(2));
    expect(board.receiveAttack(x,y))
      .toBe(true);
    expect(board.board[x][y])
      .toEqual({
        value: {
          size: 2,
          hits: 1,
          name: 'Patrol Boat'
        },
        hit: 1
      });
  });
  
  it('sunk the one of ships', () => {
    const allShips = [
      new Ship(3),
      new Ship(2)
    ];
    let index = 0;
    allShips.forEach(el => board.addShip(0,index++,'y',el));

    // first attack
    expect(board.receiveAttack(0,1))
      .toBe(true);

    // second attack
    expect(board.receiveAttack(1,1))
      .toBe(true);

    // one ship is sunk
    expect(board.board[0][1].value.isSunk())
      .toBe(true);

    // some of ships are hitted, some are not
  });

  it('all ships are sunk', () => {
    const allShips = [
      new Ship(3),
      new Ship(2)
    ];
    let index = 0;
    allShips.forEach(el => board.addShip(0,index++,'y',el));
    board.receiveAttack(0,1);
    board.receiveAttack(1,1);
    board.receiveAttack(0,0);
    board.receiveAttack(1,0);
    board.receiveAttack(2,0);
    // all ships present on board are sunk
    expect(board.shipsAreSunk())
      .toBe(true);
  });
});


describe('Player', () => {
  let name;
  let board;
  let player;

  beforeEach(() => {
    name = 'Player';
    board = new Gameboard(10);
    player = new Player(
      name,
      board
    )
  });

  it('player created', () => {
    expect(player).toEqual({
      name: name,
      board: board,
      turns: []
    });
  });

  it('make turn', () => {
    const x = 0;
    const y = 0;
    expect(player.turn(x,y))
      .toEqual([x,y]);
  });

  // we check that we couldn't make more decision than empty squares on board
  it('make decision', () => {
    let testAray = Array(120).fill('');
    testAray.forEach(el => {
      player.turn(...player.makeDecision());
    });
    expect(player.turns.length)
      .toBeLessThanOrEqual(100);
  })

  it('AI: place ships', () => {
    const testArray = [
      new Ship(5),
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
    ];

    testArray.forEach(el => player.placeShip(el));

    expect(player.board.ships)
      .toEqual(testArray);

  });

});

describe('Game loop', () => {
  // ask to place ships
  // check all ships ready
  // place ships of second player
  // make game comp vs comp with some results
  // check end game
  //
  it('place ships of both players', () => {

  });

});