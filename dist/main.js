/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/board.js":
/*!**********************!*\
  !*** ./src/board.js ***!
  \**********************/
/***/ ((module) => {

eval("class Gameboard {\n  constructor(size) {\n    this.board = this.create(size);\n    this.ships = [];\n  }\n\n  create(size) {\n    const boardArray = [];\n    for (let i = 0; i <= size - 1; i++) {\n      const boardLine = Array(size)\n        .fill('')\n        .map(el => new Square);\n      boardArray.push(boardLine);\n    }\n\n    return boardArray;\n  }\n\n  setLimits(x, y, axis, length) {\n    const limits = {};\n    if (axis === 'x') {\n      limits.yLimit = y + length - 1;\n      limits.xLimit = x;\n    }\n    \n    if (axis === 'y') {\n      limits.yLimit = y;\n      limits.xLimit = x + length - 1;\n    }\n    return limits;\n  }\n\n  iterateSquares(x, y, length, axis, cb) {\n    const { xLimit, yLimit } = this.setLimits(x, y, axis, length);\n    let index = 0;\n    for (let row = x; row <= xLimit; row++) {\n      for (let col = y; col <= yLimit; col++) {\n        cb(row, col);\n      }\n    }\n  }\n\n  addShip(x, y, axis, ship) {\n    const shipSize = ship.size;\n\n    console.log('SHIP SIZE inside addShip', shipSize);\n\n    if ([x, y, axis, ship].some(el => el === undefined)) {\n      return false;\n    }\n\n    if (this.isEnoughSpace(x, y, axis, shipSize)) {\n      this.iterateSquares(x, y, shipSize, axis, (row, col) => {\n        this.updateSquare(row, col, ship);\n      });\n      this.ships.push(ship);\n    } else {\n      return false;\n    }\n    return true\n  }\n\n  //method for testing\n  getSpan(x, y, axis, length) {\n    const getArray = [];\n\n    this.iterateSquares(x, y, length, axis, (row, col) => {\n      let square = this.board[row][col];\n      getArray.push(square);\n    });\n\n    return getArray;\n  }\n\n  isEnoughSpace(x, y, axis, size) {\n    let result = true;\n    this.iterateSquares(x, y, size, axis, (row, col) => {\n      if (\n        this.isInBoardBorders(row, col) === false ||\n        this.isEmptySquare(row, col) === false\n      ) {\n        result = false;\n        return;\n      }\n    });\n    return result;\n  }\n\n  isEmptySquare(x,y) {\n    if (this.board[x][y].value !== undefined) return false;\n    if (this.board[x][y].hit !== 0) return false;\n    return true;\n  }\n\n  isInBoardBorders(x,y) {\n    if (x >= this.board.length) return false;\n    if (y >= this.board.length) return false;\n    return true;\n  }\n\n  updateSquare(x, y, value) {\n    this.board[x][y].update(value);\n  }\n\n  // check if is sunk during game loop\n  // check all ships\n  receiveAttack(x,y) {\n    const square = this.board[x][y];\n    square.hit += 1;\n    if (square.value !== undefined) {\n      square.value.hit();\n      return true;\n    }\n    if (square.hit == 1) return true;\n    return false;\n  }\n\n  shipsAreSunk() {\n    return this.ships.every(el => el.isSunk());\n  }\n\n  getPrintReadyBoard() {\n    const printBoard = this.board.map((line) => {\n      const printLine = line.map(square => {\n        if (square.value === undefined) {\n          return '-';\n        } else {\n          return 'S';\n        }\n      }).join(' ');\n      return printLine;\n    });\n    return printBoard.join('\\n');\n  }\n}\n\nclass Square {\n  constructor() {\n    this.value = undefined;\n    this.hit = 0;\n  }\n\n  update(value) {\n    this.value = value;\n  }\n\n\n\n}\n\n\nmodule.exports = { Gameboard }\n\n\n//# sourceURL=webpack://battleship/./src/board.js?");

/***/ }),

/***/ "./src/event.js":
/*!**********************!*\
  !*** ./src/event.js ***!
  \**********************/
/***/ ((module) => {

eval("class Event {\n  constructor(name, callback) {\n    this.name = name;\n    this.handlers = this.addHandler(callback);\n  }\n\n  addHandlers(callbackArr) {\n    callbackArr.forEach(this.addHandler);\n  }\n\n  addHandler(callback) {\n    if (callback === undefined) return;\n    if (this.handlers === undefined) return [callback];\n    if (!this.handlers.includes(callback)) {\n      this.handlers.push(callback);\n    }\n  }\n\n  removeHandler(callback) {\n    const toDelete = this.handlers.findIndex(h => h == callback);\n    if (index != -1) {\n      this.handlers.splice(index,1);\n    }\n  }\n\n  fire(args) {\n    this.handlers.forEach((cb) => {\n      if (Array.isArray(args)) {\n        cb(...args);\n      } else {\n        cb(args);\n      }\n    });\n  }\n}\n\nclass EventAggregator {\n  constructor() {\n    this.events = {};\n  }\n\n  register(name, callback) {\n    name = name.toLowerCase();\n    if (Object.keys(this.events).includes(name)) {\n      console.log(callback);\n      console.log(this.events[name]);\n      this.events[name].addHandler(callback);\n    } else {\n      this.events[name] = new Event(name, callback);\n    }\n  }\n\n  publish(name, args) {\n    name = name.toLowerCase();\n    if (Object.keys(this.events).includes(name)) {\n      this.events[name].fire(args);\n    } else {\n      this.events[name] = new Event(name);\n    }\n  }\n}\n\n\nmodule.exports = { EventAggregator }\n\n//# sourceURL=webpack://battleship/./src/event.js?");

/***/ }),

/***/ "./src/gameInterface.js":
/*!******************************!*\
  !*** ./src/gameInterface.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { EventAggregator } = __webpack_require__(/*! ./event */ \"./src/event.js\");\n\nclass GameInterface {\n  constructor() {\n    this.is = 'isis';\n    const events = new EventAggregator();\n    window.events = events;\n  }\n\n\n  addCompBoard(target='.main-container') {\n    const board = document.createElement('div');\n    board.classList.add('comp-container');\n    board.innerHTML = `<h2>Computer</h2>\n    <div class=\"board-grid\"></div>`;\n    document.querySelector(target).appendChild(board);\n  }\n\n  createCompGrid(player, target = '.comp-container .board-grid') {\n    document.querySelector(target).innerHTML = '';\n    player.board.board.forEach((element, x) => {\n      element.forEach((element, y) => {\n        const square = document.createElement('div');\n        square.classList.add('grid');\n        square.setAttribute('data-x',x);\n        square.setAttribute('data-y',y);\n        if (element.hit > 0) {\n          square.classList.add('hit');\n          if (element.value != undefined) {\n            square.classList.add('ship');\n          }\n        }\n        document.querySelector(target).appendChild(square); \n      });\n    });\n  }\n\n  compGridListener(player, enemy) {\n    const compGrid = document\n      .querySelectorAll('.comp-container .board-grid .grid');\n    compGrid.forEach((square) => {\n      square.addEventListener('mousedown', (event) => {\n        const x = parseInt(event.target.getAttribute('data-x'));\n        const y = parseInt(event.target.getAttribute('data-y'));\n        this.receiveAttack(x,y,player,enemy);\n      });\n    })\n  }\n\n  receiveAttack(x,y, player, enemy) {\n    console.log(x,y,player,enemy);\n    const attack = enemy.board.receiveAttack(x, y);\n    if (attack) {\n      this.createCompGrid(enemy);\n      this.compGridListener(player, enemy);\n      if (enemy.board.shipsAreSunk()) {\n        alert('YOU WON');\n        return;\n      }\n      const compTurn = enemy.turn(...enemy.makeDecision());\n      player.board.receiveAttack(...compTurn);\n      this.createGrid(player,'.player-container .board-grid');\n      if (player.board.shipsAreSunk()) alert('COMP WON');\n    }\n  }\n\n  createGrid(player, target) {\n    document.querySelector(target).innerHTML = '';\n    player.board.board.forEach((element, x) => {\n      element.forEach((element, y) => {\n        const square = document.createElement('div');\n        square.classList.add('grid');\n        square.setAttribute('data-x',x);\n        square.setAttribute('data-y',y);\n        if (element.value != undefined) {\n          square.classList.add('ship');\n        }\n        if (element.hit > 0) {\n          square.classList.add('hit');\n        }\n        document.querySelector(target).appendChild(square); \n      });\n    });\n  }\n\n  addRotationButton() {\n    const buttonContainer = document.createElement('div');\n    buttonContainer.classList.add('button-container');\n    const button = document.createElement('button');\n    button.classList.add('axis');\n    button.setAttribute('data-axis','y')\n    button.innerText = 'ROTATE SHIP: HORIZONTALLY';\n    button.addEventListener('click', (event) => {\n      if (event.target.getAttribute('data-axis') === 'y') {\n        event.target.setAttribute('data-axis','x');\n        event.target.innerText = 'ROTATE SHIP: VERTICALLY';\n      } else {\n        event.target.setAttribute('data-axis','y');\n        event.target.innerText = 'ROTATE SHIP: HORIZONTALLY';\n      }\n    });\n    buttonContainer.append(button);\n    document.querySelector('.player-container').appendChild(buttonContainer);\n  }\n\n  hideRotationButton() {\n    document.querySelector('.button-container').remove();\n  }\n\n  iterateSquares(x, y, axis) {\n    let i;\n    let limit;\n    if (axis === 'y') {\n      i = x;\n      limit = (x + ship.size);\n    }\n    \n    for (i; i < limit; i++) {\n      const nextSquare = \n        document.querySelector(`[data-x=\"${i}\"][data-y=\"${y}\"]`);\n      if (nextSquare) {\n        squares.push(nextSquare);\n      } else {\n        break\n      }\n    }\n  }\n\n  followCursor(ship) {\n    // when intersects with borders make red\n    // when overlap another ship make red\n      document.querySelectorAll('.grid').forEach(\n        (square) => {\n          square.addEventListener('mouseenter', (event) => {\n            let squares = [];\n            const targetSquare = event.target;\n            const x = parseInt(event.target.getAttribute('data-x'),10);\n            const y = parseInt(event.target.getAttribute('data-y'),10);\n            if (\n              document.querySelector('.axis')\n                .getAttribute('data-axis') === 'y'\n            ) {\n              const limit = (x + ship.size);\n              for (let i = x; i < limit; i++) {\n                const nextSquare = \n                  document.querySelector(`[data-x=\"${i}\"][data-y=\"${y}\"]`);\n                if (nextSquare) {\n                  squares.push(nextSquare);\n                } else {\n                  break\n                }\n              }\n            } else {\n              // for x axis\n              const limit = (y + ship.size);\n              for (let i = y; i < limit; i++) {\n                const nextSquare = \n                  document.querySelector(`[data-x=\"${x}\"][data-y=\"${i}\"]`);\n                if (nextSquare) {\n                  squares.push(nextSquare);\n                } else {\n                  break\n                }\n              }\n            }\n            squares.forEach(square => square.classList.add('ship-temp'));\n            square.addEventListener('mouseleave', (event) => {\n              squares.forEach(square => square.classList.remove('ship-temp'));\n            });\n          });\n        }\n      )\n\n\n\n  }\n\n  renderShip(ship) {\n    const shipContainer = document.createElement('div');\n    shipContainer.classList.add('ship-container');\n    for (let i = 0; i < ship.size; i++) {\n      shipContainer.innerHTML += `<div class=\"grid ship\"></div>`;\n    }\n    document.querySelector('.player-container .board-grid').appendChild(shipContainer);\n  }\n\n}\n\nmodule.exports = { GameInterface }\n\n//# sourceURL=webpack://battleship/./src/gameInterface.js?");

/***/ }),

/***/ "./src/gameLoop.js":
/*!*************************!*\
  !*** ./src/gameLoop.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { Ship } = __webpack_require__(/*! ./ship */ \"./src/ship.js\");\nconst { Gameboard } = __webpack_require__(/*! ./board */ \"./src/board.js\");\nconst { Player } = __webpack_require__(/*! ./player */ \"./src/player.js\");\nconst { GameInterface } = __webpack_require__(/*! ./gameInterface */ \"./src/gameInterface.js\");\nconst { EventAggregator } = __webpack_require__(/*! ./event */ \"./src/event.js\");\n\nclass Game {\n  constructor(name = 'Player') {\n    this.player = new Player(\n      name,\n      new Gameboard(10),\n    )\n    this.enemy = new Player(\n      'Comp',\n      new Gameboard(10),\n    );\n    this.players = [\n      this.player,\n      this.enemy,\n    ];\n    this.current = 1;\n    this.events = new EventAggregator();\n    this.inter = new GameInterface();\n    this.playerShipsPlaced = false;\n  }\n\n  updateGrid(x,y,axis,ship) {\n    this.players[this.current].board.addShip(x,y,axis,ship);\n    console.log(this.player.board.getPrintReadyBoard());\n    this.inter.createGrid.call(this, this.player,'.player-container .board-grid');\n    const nextShip = this.addNextShip(this.players[this.current]);\n    if (nextShip) {\n      this.inter.followCursor(nextShip);\n    }\n  }\n\n  registerGridClick() {\n    const handler = (event) => {\n      let axis;\n      let ship;\n\n      try {\n        axis = document.querySelector('.axis')\n        .getAttribute('data-axis');\n        ship = this.addNextShip(this.players[this.current]);\n      } catch {\n        document.querySelector('.player-container .board-grid').removeEventListener('mousedown', handler);\n        document.querySelector('.player-container .board-grid').style = \"pointer-events: none; cursor: not-allowed;\"\n        return;\n      }\n\n      window.events.publish(\n        'squareClick',\n        [\n          parseInt(event.target.getAttribute('data-x')),\n          parseInt(event.target.getAttribute('data-y')),\n          document.querySelector('.axis')\n            .getAttribute('data-axis'),\n            ship,\n        ]\n      );\n    }\n\n    document.querySelector('.player-container .board-grid')\n    .addEventListener('mousedown', handler);\n  }\n\n  start() {\n\n    // new game with form\n    // write something in status bar\n    // put chosen name above the board\n    // win modal\n    // replay button\n\n    const player = this.nextTurn();\n\n    this.registerGridClick();\n    window.events.register('squareClick',this.updateGrid.bind(this));\n\n    window.events.register('playerShipsPlaced', () => {\n      this.playerShipsPlaced = true;\n    });\n\n    this.inter.createGrid.call(this, player,'.player-container .board-grid');\n    this.inter.addRotationButton();\n    this.inter.followCursor(this.addNextShip(player));\n\n    // waiting choice of player\n    const waitPlayerChoice =  setInterval(() => {\n      // playerShips = [];\n      if (this.playerShipsPlaced) {\n        clearInterval(waitPlayerChoice);\n        this.inter.hideRotationButton();\n        const computer = this.nextTurn();\n        this.inter.addCompBoard();\n        const compShips = this.giveShips();\n        computer.placeShips(compShips);\n        this.inter.createCompGrid(computer);\n        this.inter.compGridListener(this.player, this.enemy);\n        this.run();\n      }\n    }, 1000);\n  }\n\n  run() {\n    console.log(this.enemy.board.getPrintReadyBoard());\n  }\n\n  addNextShip(player, x, y, axis) {\n    const index = player.board.ships.length;\n    const ships = this.giveShips();\n    if (index > 4) {\n      window.events.publish('playerShipsPlaced');\n      return false;\n    }\n    return ships[index];\n  }\n\n\n  giveShips() {\n    return [\n      new Ship(5),\n      new Ship(4),\n      new Ship(3),\n      new Ship(3),\n      new Ship(2),\n    ];\n  }\n\n  shipsPlaced() {\n\n  }\n\n  gameEnded() {\n\n  }\n\n  nextTurn() {\n    if (this.current === 0) {\n      this.current = 1;\n    } else {\n      this.current = 0;\n    }\n    return this.players[this.current];\n  }\n}\n\nconst game = new Game();\n\n\ndocument.addEventListener('DOMContentLoaded',() => {\n  game.start();\n})\n\n\n\n\n\n\n// give list of ships to first player\n// receive choice of the first player\n// give list of ships to first player\n// when ready, receive choice of AI\n// give turn to first player\n// check results\n// -- if no ships, end game\n// -- show the winner\n// give tuen to second player\n// -- repeat check\n// continue until one of players don't win\n\n\nmodule.exports = { Game }\n\n//# sourceURL=webpack://battleship/./src/gameLoop.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const { Game } = __webpack_require__(/*! ./gameLoop */ \"./src/gameLoop.js\");\n// const { Interface } = require('./interface');\n\n\n\n\nnew Game();\n\n\nconsole.log('I WORK');\n\n//# sourceURL=webpack://battleship/./src/index.js?");

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((module) => {

eval("class Player {\n  constructor(name, board) {\n    this.name = name;\n    this.turns = [];\n    this.board = board;\n  }\n\n  turn(x, y) {\n    if (x === undefined || y === undefined) {\n      return false;\n    }\n    this.turns.push([x,y]);\n    return [x,y];\n  }\n\n  makeDecision() {\n    let decision = false;\n    let decisions = [];\n    for (let row = 0; row < this.board.board.length; row++) {\n      for (let col = 0; col < this.board.board.length; col++) {\n       decisions.push([row,col]);\n      }\n    }\n\n    while(!decision) {\n      if (decisions.length <= 0) decision = false;\n      const randomChoice = Math.floor(Math.random() * decisions.length);\n      const decisionCandidate = decisions.splice(randomChoice,1).flat();\n      decision = this.checkSquare(decisionCandidate) === true ? decisionCandidate : false;\n    }\n\n    return decision;\n  }\n\n  checkSquare(square) {\n    const [x,y] = square;\n    return this.turns.every(turn => {\n      return JSON.stringify(turn) !== JSON.stringify(square);\n    });\n  }\n\n  placeShips(shipArray) {\n    shipArray.forEach(ship => this.placeShip(ship));\n  }\n\n  placeShip(ship) {\n    let placed = false;\n    const axises = ['x','y'];\n\n    while(!placed) {\n      const axis = axises[Math.floor(Math.random() * 2)];\n      const x = Math.floor(Math.random() * 10);\n      const y = Math.floor(Math.random() * 10);\n      placed = this.board.addShip(x, y, axis, ship);\n    }\n  }\n}\n\nmodule.exports = { Player }\n\n//# sourceURL=webpack://battleship/./src/player.js?");

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((module) => {

eval("class Ship {\n  constructor(size) {\n    this.size = size;\n    this.hits = 0;\n    this.name = this.getName(size);\n  }\n\n  hit() {\n    this.hits += 1;\n  }\n\n  isSunk() {\n    return (this.size - this.hits) <= 0;\n  }\n\n  getName(size) {\n    const threeNames = ['Destroyer','Submarine'];\n    switch(size) {\n      case 5: return 'Carrier';\n      case 4: return 'Battleship';\n      case 3: return threeNames.shift();\n      case 2: return 'Patrol Boat';\n    }\n  }\n\n}\n\nmodule.exports = { Ship }\n\n//# sourceURL=webpack://battleship/./src/ship.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;