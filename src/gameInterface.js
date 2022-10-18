const { EventAggregator } = require('./event');

class GameInterface {
  constructor() {
    const events = new EventAggregator();
    window.events = events;
  }

  addBoard(containerName = 'comp-container', playerName = 'Comp', target='.main-container') {
    if (playerName === undefined || playerName == '') {
      playerName = 'Player';
    }
    const board = document.createElement('div');
    board.classList.add(`${containerName}`);
    board.innerHTML = `<h2>${playerName}</h2>
    <div class="board-grid"></div>`;
    document.querySelector(target).appendChild(board);
  }

  createCompGrid(player, target = '.comp-container .board-grid') {
    document.querySelector(target).innerHTML = '';
    player.board.board.forEach((element, x) => {
      element.forEach((element, y) => {
        const square = document.createElement('div');
        square.classList.add('grid');
        square.setAttribute('data-x',x);
        square.setAttribute('data-y',y);
        if (element.hit > 0) {
          square.classList.add('hit');
          if (element.value != undefined) {
            square.classList.add('ship');
          }
        }
        document.querySelector(target).appendChild(square); 
      });
    });
  }

  compGridListener(player, enemy, attackFunc) {
    const compGrid = document
      .querySelectorAll('.comp-container .board-grid .grid');
    compGrid.forEach((square) => {
      square.addEventListener('mousedown', (event) => {
        const x = parseInt(event.target.getAttribute('data-x'));
        const y = parseInt(event.target.getAttribute('data-y'));
        attackFunc(x,y,player,enemy);
      });
    })
  }

  createGrid(player, target) {
    document.querySelector(target).innerHTML = '';
    player.board.board.forEach((element, x) => {
      element.forEach((element, y) => {
        const square = document.createElement('div');
        square.classList.add('grid');
        square.setAttribute('data-x',x);
        square.setAttribute('data-y',y);
        if (element.value != undefined) {
          square.classList.add('ship');
        }
        if (element.hit > 0) {
          square.classList.add('hit');
        }
        document.querySelector(target).appendChild(square); 
      });
    });
  }

  addRotationButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    const button = document.createElement('button');
    button.classList.add('axis');
    button.setAttribute('data-axis','y')
    button.innerText = 'ROTATE SHIP: HORIZONTALLY';
    button.addEventListener('click', (event) => {
      if (event.target.getAttribute('data-axis') === 'y') {
        event.target.setAttribute('data-axis','x');
        event.target.innerText = 'ROTATE SHIP: VERTICALLY';
      } else {
        event.target.setAttribute('data-axis','y');
        event.target.innerText = 'ROTATE SHIP: HORIZONTALLY';
      }
    });
    buttonContainer.append(button);
    document.querySelector('.player-container').appendChild(buttonContainer);
  }

  hideRotationButton() {
    document.querySelector('.button-container').remove();
  }

  iterateSquares(x, y, axis) {
    let i;
    let limit;
    if (axis === 'y') {
      i = x;
      limit = (x + ship.size);
    }
    
    for (i; i < limit; i++) {
      const nextSquare = 
        document.querySelector(`[data-x="${i}"][data-y="${y}"]`);
      if (nextSquare) {
        squares.push(nextSquare);
      } else {
        break
      }
    }
  }


  showModal(message) {
    const modal = document.querySelector('.modal');
    modal.querySelector('h1').innerText = message;
    modal.style = "display: flex";
  }

  followCursor(ship) {
    // when intersects with borders make red
    // when overlap another ship make red
      document.querySelectorAll('.grid').forEach(
        (square) => {
          square.addEventListener('mouseenter', (event) => {
            let squares = [];
            const targetSquare = event.target;
            const x = parseInt(event.target.getAttribute('data-x'),10);
            const y = parseInt(event.target.getAttribute('data-y'),10);
            if (
              document.querySelector('.axis')
                .getAttribute('data-axis') === 'y'
            ) {
              const limit = (x + ship.size);
              for (let i = x; i < limit; i++) {
                const nextSquare = 
                  document.querySelector(`[data-x="${i}"][data-y="${y}"]`);
                if (nextSquare) {
                  squares.push(nextSquare);
                } else {
                  break
                }
              }
            } else {
              // for x axis
              const limit = (y + ship.size);
              for (let i = y; i < limit; i++) {
                const nextSquare = 
                  document.querySelector(`[data-x="${x}"][data-y="${i}"]`);
                if (nextSquare) {
                  squares.push(nextSquare);
                } else {
                  break
                }
              }
            }
            squares.forEach(square => square.classList.add('ship-temp'));
            square.addEventListener('mouseleave', (event) => {
              squares.forEach(square => square.classList.remove('ship-temp'));
            });
          });
        }
      )



  }

  renderShip(ship) {
    const shipContainer = document.createElement('div');
    shipContainer.classList.add('ship-container');
    for (let i = 0; i < ship.size; i++) {
      shipContainer.innerHTML += `<div class="grid ship"></div>`;
    }
    document.querySelector('.player-container .board-grid').appendChild(shipContainer);
  }


  postMessage(message) {
    const statusBar  = document.querySelector('.gameflow');
    statusBar.innerText = message;
  }

}

module.exports = { GameInterface }