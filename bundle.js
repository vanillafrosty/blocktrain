/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ai.js":
/*!*******************!*\
  !*** ./src/ai.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _game = __webpack_require__(/*! ./game */ "./src/game.js");

var _game2 = _interopRequireDefault(_game);

var _util = __webpack_require__(/*! ./util */ "./src/util.js");

var boardUtil = _interopRequireWildcard(_util);

var _shadowBoard = __webpack_require__(/*! ./shadowBoard */ "./src/shadowBoard.js");

var _shadowBoard2 = _interopRequireDefault(_shadowBoard);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AIGame = function (_Game) {
  _inherits(AIGame, _Game);

  function AIGame(board) {
    _classCallCheck(this, AIGame);

    var _this = _possibleConstructorReturn(this, (AIGame.__proto__ || Object.getPrototypeOf(AIGame)).call(this, board));

    _this.populationSize = 6;
    _this.genomes = [];
    _this.genomeIndex = -1;
    _this.movesTaken = 0;
    _this.movesLimit = 500;
    _this.createInitialPopulation();
    _this.timeStep = 10;
    _this.score = 0;
    _this.generation = 0;
    _this.mutationRate = 0.05;
    _this.mutationStep = 0.2;
    _this.speedArr = [300, 120, 10, 0];
    _this.speedIndex = 2;
    return _this;
  }

  _createClass(AIGame, [{
    key: 'createInitialPopulation',
    value: function createInitialPopulation() {
      var genome = void 0;
      for (var i = 0; i < this.populationSize; i++) {
        genome = {
          id: Math.random(),
          rowsCleared: Math.random() - 0.5,
          weightedHeight: Math.random() - 0.5,
          cumulativeHeight: Math.random() - 0.5,
          relativeHeight: Math.random() - 0.5,
          holes: Math.random() * 0.5,
          roughness: Math.random() - 0.5
        };
        this.genomes.push(genome);
      }
      this.evaluateNextGenome();
    }
  }, {
    key: 'evaluateNextGenome',
    value: function evaluateNextGenome() {
      this.score = 0;
      this.genomeIndex += 1;
      if (this.playingGame) {
        var aiDisplay = document.getElementById('ai-display');
        aiDisplay.children[2].innerHTML = 'current genome: ' + (this.genomeIndex + 1) + '/' + this.populationSize;
        if (this.genomeIndex >= this.genomes.length) {
          this.evolve();
          aiDisplay.children[2].innerHTML = 'current genome: ' + (this.genomeIndex + 1) + '/' + this.populationSize;
        }
      }
      this.movesTaken = 0;
      this.makeNextMove();
    }
  }, {
    key: 'makeNextMove',
    value: function makeNextMove() {
      this.movesTaken += 1;
      if (this.movesTaken > this.movesLimit) {
        //evaluate the score for the current genome, and move to the next genome
        this.genomes[this.genomeIndex].fitness = this.score;
        this.evaluateNextGenome();
      } else {
        var bestFutureMove = void 0,
            bestCurrentMove = void 0;
        //possible moves with this.currentPiece
        var possibleMoves = this.getPossibleMoves(this.board, this.currentPiece);
        for (var i = 0; i < possibleMoves.length; i++) {
          this.shadowBoard = new _shadowBoard2.default(boardUtil.deepDup(this.board.grid));
          this.shadowMove(possibleMoves[i], this.currentPiece);
          bestFutureMove = this.getHighestRatedMove(this.getPossibleMoves(this.shadowBoard, this.nextPiece));
          if (bestFutureMove) {
            possibleMoves[i].rating += bestFutureMove.rating;
          }
        }
        bestCurrentMove = this.getHighestRatedMove(possibleMoves);
        //based on the bestCurrentMove, move this.currentPiece and set it on this.board
        this.updateScore(bestCurrentMove);
        //make sure realMove does not update this.offset.x to be NaN
        //if bestCurrentMove is not a real move.
        this.realMove(bestCurrentMove, this.currentPiece);
        //draw stuff because we just made the best move
        this.boardStep();
      }
    }
  }, {
    key: 'updateScore',
    value: function updateScore(move) {
      if (!move) {
        return true;
      }
      this.score += move.drop;
      switch (move.algorithm.rowsCleared) {
        case 1:
          this.score += 400;
          return true;
        case 2:
          this.score += 1000;
          return true;
        case 3:
          this.score += 3000;
          return true;
        case 4:
          this.score += 12000;
          return true;
      }
    }
  }, {
    key: 'getPossibleMoves',
    value: function getPossibleMoves(board, piece) {
      var origOffset = {
        x: this.offset.x,
        y: this.offset.y
      };
      var possibleMoves = [];
      var rotationsHsh = {
        'T': 4,
        'O': 1,
        'J': 4,
        'L': 4,
        'Z': 2,
        'S': 2,
        'I': 2
      };
      var rotations = rotationsHsh[piece.type];
      for (var i = 1; i <= rotations; i++) {
        //since handleRotate is destructive, just keep rotating once.
        //call multiRotate some other time.
        piece = this.handleRotate(piece);
        for (var trans = -5; trans <= 5; trans++) {
          var gameOver = false;
          this.offset.x = origOffset.x;
          this.offset.y = origOffset.y;
          this.offset.x += trans;
          if (board.validPos(piece.matrix, this.offset)) {
            var minDelta = boardUtil.deltaY(piece.matrix, this.offset, board.rows, board.grid);
            this.offset.y += minDelta;
            board.setPiece(piece.matrix, this.offset.x, this.offset.y - 1);
            var rowsCleared = board.fullRows(piece.length, this.offset.y - 1);
            if (rowsCleared === 0) {
              gameOver = board.checkGameOver(this.nextPiece.matrix, origOffset);
            }
            var algorithm = {
              rowsCleared: rowsCleared,
              weightedHeight: Math.pow(board.getMaxHeight(), 1.5),
              cumulativeHeight: board.getCumulativeHeight(rowsCleared),
              relativeHeight: board.getRelativeHeight(),
              holes: board.getHoles(),
              roughness: board.getRoughness()
            };
            var rating = 0;
            rating += algorithm.rowsCleared * this.genomes[this.genomeIndex].rowsCleared;
            rating += algorithm.weightedHeight * this.genomes[this.genomeIndex].weightedHeight;
            rating += algorithm.cumulativeHeight * this.genomes[this.genomeIndex].cumulativeHeight;
            rating += algorithm.relativeHeight * this.genomes[this.genomeIndex].relativeHeight;
            rating += algorithm.holes * this.genomes[this.genomeIndex].holes;
            rating += algorithm.roughness * this.genomes[this.genomeIndex].roughness;
            //if the move loses the game, slam its rating
            if (gameOver) {
              rating -= 500;
            }
            board.removePiece(piece.matrix, this.offset.x, this.offset.y - 1);
            //push all possible moves, with their associated ratings and parameter values to an array
            possibleMoves.push({ rotations: i, translation: trans, rating: rating, algorithm: algorithm, drop: minDelta - 1 });
          }
        }
      }
      this.offset = origOffset;
      this.totalRotations = 0;
      return possibleMoves;
    }
  }, {
    key: 'multiRotate',
    value: function multiRotate(piece, rotations) {
      for (var r = 0; r < rotations; r++) {
        piece = this.handleRotate(piece);
      }
      return piece;
    }
  }, {
    key: 'shadowMove',
    value: function shadowMove(move, piece) {
      var origPiece = boardUtil.deepDup(piece.matrix);
      piece = this.multiRotate(piece, move.rotations);
      var shadowOffset = {
        x: this.offset.x,
        y: this.offset.y
      };
      shadowOffset.x += move.translation;
      this.shadowBoard.handleDrop(piece.matrix, shadowOffset);
      piece.matrix = origPiece;
    }
  }, {
    key: 'realMove',
    value: function realMove(move, piece) {
      if (!move) {
        return true;
      }
      piece = this.multiRotate(piece, move.rotations);
      this.offset.x += move.translation;
      this.totalRotations = 0;
      // this.board.setPiece(piece.matrix, this.offset.x, this.offset.y);
    }
  }, {
    key: 'getHighestRatedMove',
    value: function getHighestRatedMove(moves) {
      var highestMove = moves[0];
      if (moves.length === 0) {
        return null;
      }
      for (var i = 1; i < moves.length; i++) {
        if (moves[i].rating > highestMove.rating) {
          highestMove = moves[i];
        }
      }
      return highestMove;
    }
  }, {
    key: 'play',
    value: function play() {
      var _this2 = this;

      if (this.playingGame || this.gameOver) {
        return true;
      } else {
        this.playingGame = true;
        this.megamanAudio.play();
        this.megamanPlaying = true;

        if (!this.gameOverOnce) {
          var gameStart = document.getElementById('before-game-start');
          gameStart.setAttribute("id", "game-start");
          var controls = document.getElementById('controls-container');
          while (controls.children.length > 1) {
            controls.removeChild(controls.children[1]);
          }
          var aiDisplay = document.getElementById('ai-display-none');
          aiDisplay.setAttribute("id", "ai-display");
          aiDisplay.children[1].append(' ' + this.generation);
          aiDisplay.children[2].append(' ' + (this.genomeIndex + 1) + '/' + this.populationSize);
        }

        var render = function render(timestamp) {
          _this2.resetTime += timestamp - _this2.startTime;

          if (_this2.resetTime > _this2.timeStep) {
            _this2.resetTime = 0;
            _this2.offset.y += 1;
            if (_this2.board.update(_this2.currentPiece.matrix, _this2.offset)) {
              _this2.offset.y = 0;
              _this2.offset.x = 4;
              _this2.totalRotations = 0;
              _this2.currentPiece = _this2.nextPiece;
              _this2.nextPiece = _this2.pieces.newPiece();
              _this2.makeNextMove();
            }
            _this2.boardStep();
            _this2.gameOver = _this2.board.checkGameOver(_this2.currentPiece.matrix, _this2.offset);
            if (_this2.gameOver) {
              _this2.genomes[_this2.genomeIndex].fitness = _this2.score;
              _this2.score = 0;
              _this2.totalRotations = 0;
              _this2.currentPiece = _this2.nextPiece;
              _this2.nextPiece = _this2.pieces.newPiece();
              _this2.board.emptyBoard();
              _this2.evaluateNextGenome();
            }
          }
          _this2.startTime = timestamp;
          _this2.animationFrame = requestAnimationFrame(render);
        };

        this.animationFrame = requestAnimationFrame(function (timestamp) {
          _this2.startTime = timestamp;
          _this2.board.drawPiece(_this2.currentPiece.matrix, _this2.offset);
          _this2.board.drawNext(_this2.nextPiece.matrix);
          render(timestamp);
        });
      }
    }
  }, {
    key: 'evolve',
    value: function evolve() {
      this.generation += 1;
      var node = document.getElementById('ai-display');
      node.children[1].innerHTML = 'current generation: ' + this.generation;
      this.genomeIndex = 0;
      this.score = 0;
      this.movesTaken = 0;
      this.totalRotations = 0;
      this.board.emptyBoard();
      this.currentPiece = this.pieces.newPiece();
      this.nextPiece = this.pieces.newPiece();
      this.genomes.sort(function (a, b) {
        return b.fitness - a.fitness;
      });
      var fittest = this.genomes.slice(0, Math.floor(this.populationSize / 2));
      var children = [this.genomes[0]];
      while (children.length < this.populationSize) {
        children.push(this.makeChild(fittest));
      }
      this.genomes = children;
    }
  }, {
    key: 'makeChild',
    value: function makeChild(genomes) {
      var mom = genomes[boardUtil.randNumRange(0, genomes.length - 1)];
      var dad = genomes[boardUtil.randNumRange(0, genomes.length - 1)];
      while (dad === mom) {
        dad = genomes[boardUtil.randNumRange(0, genomes.length - 1)];
      }
      var child = {
        id: Math.random(),
        rowsCleared: boardUtil.randSelect(mom.rowsCleared, dad.rowsCleared),
        weightedHeight: boardUtil.randSelect(mom.weightedHeight, dad.weightedHeight),
        cumulativeHeight: boardUtil.randSelect(mom.cumulativeHeight, dad.cumulativeHeight),
        relativeHeight: boardUtil.randSelect(mom.relativeHeight, dad.relativeHeight),
        holes: boardUtil.randSelect(mom.holes, dad.holes),
        roughness: boardUtil.randSelect(mom.roughness, dad.roughness),
        fitness: -1
      };
      if (Math.random() < this.mutationRate) {
        child.rowsCleared = child.rowsCleared + Math.random() * this.mutationStep * 2 - this.mutationStep;
      }
      if (Math.random() < this.mutationRate) {
        child.weightedHeight = child.weightedHeight + Math.random() * this.mutationStep * 2 - this.mutationStep;
      }
      if (Math.random() < this.mutationRate) {
        child.cumulativeHeight = child.cumulativeHeight + Math.random() * this.mutationStep * 2 - this.mutationStep;
      }
      if (Math.random() < this.mutationRate) {
        child.relativeHeight = child.relativeHeight + Math.random() * this.mutationStep * 2 - this.mutationStep;
      }
      if (Math.random() < this.mutationRate) {
        child.holes = child.holes + Math.random() * this.mutationStep * 2 - this.mutationStep;
      }
      if (Math.random() < this.mutationRate) {
        child.roughness = child.roughness + Math.random() * this.mutationStep * 2 - this.mutationStep;
      }
      return child;
    }
  }]);

  return AIGame;
}(_game2.default);

exports.default = AIGame;

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _game = __webpack_require__(/*! ./game */ "./src/game.js");

var _game2 = _interopRequireDefault(_game);

var _board = __webpack_require__(/*! ./board */ "./src/board.js");

var _board2 = _interopRequireDefault(_board);

var _ai = __webpack_require__(/*! ./ai */ "./src/ai.js");

var _ai2 = _interopRequireDefault(_ai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById("canvas");
  canvas.width = 300;
  canvas.height = 630;
  var nextPieceCanvas = document.getElementById("next-piece-canvas");
  nextPieceCanvas.width = 120;
  nextPieceCanvas.height = 150;

  var ctx = canvas.getContext('2d');
  var nextPieceCtx = nextPieceCanvas.getContext('2d');

  var board = new _board2.default(canvas.width, canvas.height, ctx, nextPieceCtx);
  // let game = new AIGame(board);
  var game = void 0;

  document.addEventListener("keypress", function (event) {
    if (event.key === 'm') {
      game.toggleAudio();
    } else if (event.key === 'r') {
      if (game.gameOver) {
        game.restart();
      }
    }
  });

  var tracks = ["./music/metal-man.mp3", "./music/crash-man.mp3", "./music/dr-wily.mp3"];
  var tracksIndex = 0;
  var megamanAudio = document.getElementById("megaman-theme");
  megamanAudio.addEventListener("ended", function () {
    tracksIndex = (tracksIndex + 1) % tracks.length;
    megamanAudio.src = tracks[tracksIndex];
    megamanAudio.play();
  });

  document.addEventListener("keypress", function (event) {
    if (event.key === 'p') {
      if (!game) {
        game = new _game2.default(board);
      }
      game.play();
    } else if (event.key === 'a') {
      if (!game) {
        game = new _ai2.default(board);
      }
      game.play();
    }
  });
});

/***/ }),

/***/ "./src/board.js":
/*!**********************!*\
  !*** ./src/board.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(/*! ./util */ "./src/util.js");

var boardUtil = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
  function Board(width, height, ctx, nextPieceCtx) {
    _classCallCheck(this, Board);

    this.ctx = ctx;
    this.nextPieceCtx = nextPieceCtx;
    this.width = width;
    this.height = height;
    this.rows = 21;
    this.cols = 10;
    this.grid = [];
    this.strokeStyle = '#000000';
    this.outlineStrokeStyle = '#F9F9F9';
    this.square_width = width / this.cols;
    for (var i = 0; i < this.rows; i++) {
      this.grid[i] = new Array(this.cols);
    }
    this.colors = {
      1: '#E24242',
      2: '#F5DC41',
      3: '#CC41F5',
      4: '#3E4AE8',
      5: '#3EE0E8',
      6: '#3EE848',
      7: '#F14D17'
    };
    this.emptyBoard = this.emptyBoard.bind(this);
  }

  _createClass(Board, [{
    key: 'emptyBoard',
    value: function emptyBoard() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          this.grid[i][j] = undefined;
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (typeof this.grid[i][j] !== 'undefined') {
            var x = j * this.square_width;
            var y = i * this.square_width;
            var color = this.colors[this.grid[i][j]];
            this.drawSquare(x, y, color);
          }
        }
      }
    }
  }, {
    key: 'drawPiece',
    value: function drawPiece(piece, offset) {
      var minDelta = void 0;
      var dupOffset = {
        x: offset.x,
        y: offset.y
      };
      minDelta = boardUtil.deltaY(piece, offset, this.rows, this.grid);
      dupOffset.y += minDelta - 1;
      var x = void 0,
          y = void 0,
          maxY = void 0,
          color = void 0;
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            x = (offset.x + j) * this.square_width;
            y = (offset.y + i) * this.square_width;
            maxY = (dupOffset.y + i) * this.square_width;
            color = this.colors[piece[i][j]];
            this.drawSquare(x, y, color);
            this.drawSquareOutline(x, maxY, color);
          }
        }
      }
    }
  }, {
    key: 'drawNext',
    value: function drawNext(piece) {
      var offset = {
        x: 0,
        y: 1
      };
      //hard code width and height for now
      this.nextPieceCtx.clearRect(0, 0, 120, 150);
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            var x = (offset.x + j) * this.square_width;
            var y = (offset.y + i) * this.square_width;
            var color = this.colors[piece[i][j]];
            this.drawNextSquare(x, y, color);
          }
        }
      }
    }
  }, {
    key: 'drawNextSquare',
    value: function drawNextSquare(x, y, color) {
      var s_w = this.square_width;
      this.nextPieceCtx.fillStyle = color;
      this.nextPieceCtx.strokeStyle = this.strokeStyle;
      this.nextPieceCtx.lineWidth = 2;
      this.nextPieceCtx.fillRect(x, y, s_w, s_w);
      this.nextPieceCtx.strokeRect(x, y, s_w, s_w);
      this.nextPieceCtx.beginPath();
      this.nextPieceCtx.moveTo(x + s_w / 4, y + s_w * (3 / 4));
      this.nextPieceCtx.lineTo(x + s_w / 4, y + s_w / 4);
      this.nextPieceCtx.lineTo(x + s_w * (3 / 4), y + s_w / 4);
      this.nextPieceCtx.stroke();
    }
  }, {
    key: 'drawSquare',
    value: function drawSquare(x, y, color) {
      var s_w = this.square_width;
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = this.strokeStyle;
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(x, y, s_w, s_w);
      this.ctx.strokeRect(x, y, s_w, s_w);
      this.ctx.beginPath();
      this.ctx.moveTo(x + s_w / 4, y + s_w * (3 / 4));
      this.ctx.lineTo(x + s_w / 4, y + s_w / 4);
      this.ctx.lineTo(x + s_w * (3 / 4), y + s_w / 4);
      this.ctx.stroke();
    }
  }, {
    key: 'drawSquareOutline',
    value: function drawSquareOutline(x, y, color) {
      var s_w = this.square_width;
      this.ctx.strokeStyle = this.outlineStrokeStyle;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, s_w, s_w);
    }
  }, {
    key: 'update',
    value: function update(piece, offset) {
      if (offset.y < 0) {
        return false;
      }
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            var x = offset.x + j;
            var y = offset.y + i;
            //we allow y>=this.rows because update is used to set a piece at
            //the very bottom of the board (in a fresh game). this.grid[y][x]
            //fails as a check in this case.
            if (y >= this.rows || typeof this.grid[y][x] !== 'undefined') {
              this.setPiece(piece, offset.x, offset.y - 1);
              this.clearRows(piece.length, offset.y - 1);
              return true;
            }
          }
        }
      }
      return false;
    }
  }, {
    key: 'clearRows',
    value: function clearRows(numRows, startY) {
      for (var i = 0; i < numRows; i++) {
        if (this.fullRow(startY + i)) {
          this.removeRow(startY + i);
        }
      }
    }
  }, {
    key: 'fullRow',
    value: function fullRow(row_idx) {
      var row = this.grid[row_idx];
      if (row === undefined) {
        return false;
      }
      for (var i = 0; i < row.length; i++) {
        if (typeof row[i] === 'undefined') {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'removeRow',
    value: function removeRow(row_idx) {
      var row = this.grid[row_idx];
      for (var i = row_idx - 1; i >= 0; i--) {
        for (var j = 0; j < row.length; j++) {
          this.grid[i + 1][j] = this.grid[i][j];
        }
      }
      for (var _j = 0; _j < row.length; _j++) {
        this.grid[0][_j] = undefined;
      }
    }

    //updates the grid with the piece values

  }, {
    key: 'setPiece',
    value: function setPiece(piece, x, y) {
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            this.grid[y + i][x + j] = piece[i][j];
          }
        }
      }
    }
  }, {
    key: 'validPos',
    value: function validPos(piece, offset) {
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            var x = offset.x + j;
            var y = offset.y + i;
            if (!boardUtil.between(x, 0, this.cols - 1) || !boardUtil.between(y, 0, this.rows - 1)) {
              return false;
            }
            if (typeof this.grid[y][x] !== 'undefined') {
              return false;
            }
          }
        }
      }
      return true;
    }

    //helper method for validateRotate

  }, {
    key: 'handleResponse',
    value: function handleResponse(piece, offset, newOffset) {
      if (this.validPos(piece, newOffset)) {
        return {
          reRotate: false,
          offset: newOffset
        };
      } else {
        return {
          reRotate: true,
          offset: offset
        };
      }
    }

    //helper method for validateRotate

  }, {
    key: 'handleX',
    value: function handleX(x, piece, offset) {
      var newOffset = {
        x: offset.x,
        y: offset.y
      };
      if (boardUtil.between(x, 0, this.cols - 1)) {
        return null;
      } else if (x < 0) {
        newOffset.x += 1;
        return this.handleResponse(piece, offset, newOffset);
      } else if (x > this.cols - 1) {
        //reminder: may want to subtract Math.floor(piece.length/2)
        //to account for the line pieces hugging the right side of the board
        newOffset.x -= 1;
        return this.handleResponse(piece, offset, newOffset);
      }
    }
  }, {
    key: 'handleY',
    value: function handleY(y, piece, offset) {
      var newOffset = {
        x: offset.x,
        y: offset.y
      };
      if (boardUtil.between(y, 0, this.rows - 1)) {
        return null;
      } else if (y < 0) {
        newOffset.y += 1;
        return this.handleResponse(piece, offset, newOffset);
      } else if (y > this.rows - 1) {
        newOffset.y -= 1;
        return this.handleResponse(piece, offset, newOffset);
      }
    }
  }, {
    key: 'handleP',
    value: function handleP(x, piece, offset) {
      var newOffset = {
        x: offset.x,
        y: offset.y
      };
      if (boardUtil.rightOrLeft(piece, x) === 'left') {
        newOffset.x += 1;
        //try moving the piece up one before giving up
        var response = this.handleResponse(piece, offset, newOffset);
        if (response.reRotate) {
          newOffset.x -= 1;
          newOffset.y -= 1;
          return this.handleResponse(piece, offset, newOffset);
        }
        return response;
      } else if (boardUtil.rightOrLeft(piece, x) === 'right') {
        newOffset.x -= 1;
        var _response = this.handleResponse(piece, offset, newOffset);
        if (_response.reRotate) {
          newOffset.x += 1;
          newOffset.y -= 1;
          return this.handleResponse(piece, offset, newOffset);
        }
        return _response;
      }
    }
  }, {
    key: 'validateRotate',
    value: function validateRotate(piece, offset) {
      var handledX = void 0,
          handledY = void 0;
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            var x = offset.x + j;
            var y = offset.y + i;
            handledX = this.handleX(x, piece, offset);
            if (handledX) {
              return handledX;
            }
            handledY = this.handleY(y, piece, offset);
            if (handledY) {
              return handledY;
            }
            if (typeof this.grid[y][x] !== 'undefined') {
              return this.handleP(x, piece, offset);
            }
          }
        }
      }
      return {
        reRotate: false,
        offset: offset
      };
    }
  }, {
    key: 'handleDrop',
    value: function handleDrop(piece, offset) {
      var minDelta = void 0;
      minDelta = boardUtil.deltaY(piece, offset, this.rows, this.grid);
      offset.y += minDelta;
      this.setPiece(piece, offset.x, offset.y - 1);
      this.clearRows(piece.length, offset.y - 1);
    }
  }, {
    key: 'checkGameOver',
    value: function checkGameOver(piece, offset) {
      if (offset.y !== 0) {
        return false;
      }
      if (!this.validPos(piece, offset)) {
        return true;
      }
      return false;
    }

    /*
     █████  ██     ███    ███ ███████ ████████ ██   ██  ██████  ██████  ███████
    ██   ██ ██     ████  ████ ██         ██    ██   ██ ██    ██ ██   ██ ██
    ███████ ██     ██ ████ ██ █████      ██    ███████ ██    ██ ██   ██ ███████
    ██   ██ ██     ██  ██  ██ ██         ██    ██   ██ ██    ██ ██   ██      ██
    ██   ██ ██     ██      ██ ███████    ██    ██   ██  ██████  ██████  ███████
    */

  }, {
    key: 'fullRows',
    value: function fullRows(numRows, startY) {
      var total = 0;
      for (var i = 0; i < numRows; i++) {
        if (this.fullRow(startY + i)) {
          total += 1;
        }
      }
      return total;
    }
  }, {
    key: 'getMaxHeight',
    value: function getMaxHeight() {
      var peaksRemaining = 10;
      var maxPeak = 0;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (peaksRemaining === 0) {
            break;
          }
          if (this.grid[i][j] !== undefined) {
            peaksRemaining -= 1;
            if (this.rows - i > maxPeak) {
              maxPeak = this.rows - i;
            }
          }
        }
      }
      return maxPeak;
    }
  }, {
    key: 'getCumulativeHeight',
    value: function getCumulativeHeight(fullRows) {
      var peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      var peaksRemaining = 10;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (peaksRemaining === 0) {
            break;
          }
          if (this.grid[i][j] !== undefined && peaks[j] < 0) {
            peaks[j] = this.rows - i;
            peaksRemaining -= 1;
          }
        }
      }
      var cumulativeHeight = 0;
      for (var p = 0; p < peaks.length; p++) {
        if (peaks[p] > 0) {
          cumulativeHeight += peaks[p];
        }
      }
      //do the below because remember we're not actually clearing rows,
      //just keeping track of how many rows are filled
      return cumulativeHeight - fullRows * 10;
    }
  }, {
    key: 'getRelativeHeight',
    value: function getRelativeHeight() {
      var peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      var peaksRemaining = 10;
      var minPeak = 99;
      var maxPeak = 0;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (peaksRemaining === 0) {
            break;
          }
          if (this.grid[i][j] !== undefined && peaks[j] < 0) {
            peaks[j] = this.rows - i;
            peaksRemaining -= 1;
            if (peaks[j] > maxPeak) {
              maxPeak = peaks[j];
            }
            if (peaks[j] < minPeak) {
              minPeak = peaks[j];
            }
          }
        }
      }
      return maxPeak - minPeak;
    }
  }, {
    key: 'getHoles',
    value: function getHoles() {
      var peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      var peaksRemaining = 10;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (peaksRemaining === 0) {
            break;
          }
          if (this.grid[i][j] !== undefined && peaks[j] < 0) {
            peaks[j] = this.rows - i;
            peaksRemaining -= 1;
          }
        }
      }
      var holes = 0;
      for (var p = 0; p < peaks.length; p++) {
        for (var row = 20; row > this.rows - peaks[p]; row--) {
          if (this.grid[row][p] === undefined) {
            holes += 1;
          }
        }
      }
      return holes;
    }

    //roughness is the sum of relative height differences between columns

  }, {
    key: 'getRoughness',
    value: function getRoughness() {
      var roughness = 0;
      var peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      var peaksRemaining = 10;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (peaksRemaining === 0) {
            break;
          }
          if (this.grid[i][j] !== undefined && peaks[j] < 0) {
            peaks[j] = this.rows - i;
            peaksRemaining -= 1;
          }
        }
      }
      for (var p = 0; p < peaks.length - 1; p++) {
        var currPeak = peaks[p + 1] < 0 ? 0 : peaks[p + 1];
        roughness += Math.abs(peaks[p] - currPeak);
      }
      return roughness;
    }
  }, {
    key: 'removePiece',
    value: function removePiece(piece, x, y) {
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            this.grid[y + i][x + j] = undefined;
          }
        }
      }
    }
  }]);

  return Board;
}();

exports.default = Board;

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pieces = __webpack_require__(/*! ./pieces */ "./src/pieces.js");

var _pieces2 = _interopRequireDefault(_pieces);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(board) {
    _classCallCheck(this, Game);

    this.gameOverOnce = false; //to make sure we don't add multiple event listeners
    this.animationFrame = null;
    this.board = board;
    this.offset = {
      x: 4,
      y: 0
    };
    this.totalRotations = 0;
    this.pieces = new _pieces2.default();
    this.currentPiece = this.pieces.newPiece();
    this.nextPiece = this.pieces.newPiece();
    this.startTime;
    this.resetTime = 0;
    this.foreverTime = 0;
    this.timeStep = 1000;
    this.megamanPlaying = false;
    this.playingGame = false;
    this.gameOver = false;
    this.megamanAudio = document.getElementById("megaman-theme");
  }

  _createClass(Game, [{
    key: 'toggleAudio',
    value: function toggleAudio() {
      if (this.playingGame || this.gameOver) {
        if (this.megamanPlaying) {
          this.megamanAudio.pause();
          this.megamanPlaying = false;
        } else {
          this.megamanAudio.play();
          this.megamanPlaying = true;
        }
      }
    }

    //transpose a square matrix with space considerations

  }, {
    key: 'transpose',
    value: function transpose(matrix) {
      var temp = void 0;
      for (var i = 0; i < matrix.length; i++) {
        for (var j = i + 1; j < matrix.length; j++) {
          temp = matrix[i][j];
          matrix[i][j] = matrix[j][i];
          matrix[j][i] = temp;
        }
      }
      return matrix;
    }

    //we are prioritizing space over time complexity here. creating a new
    //matrix should give us faster time complexity, but both ways are still O(n^2)

  }, {
    key: 'rotate',
    value: function rotate(matrix) {
      var temp = void 0;
      var transposed = this.transpose(matrix);
      //reverse the columns
      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < Math.floor(matrix.length / 2); j++) {
          temp = matrix[i][j];
          matrix[i][j] = matrix[i][matrix.length - 1 - j];
          matrix[i][matrix.length - 1 - j] = temp;
        }
      }
      return matrix;
    }
  }, {
    key: 'rotateCounter',
    value: function rotateCounter(matrix) {
      var temp = void 0;
      var transposed = this.transpose(matrix);
      //reverse the rows
      for (var i = 0; i < Math.floor(matrix.length / 2); i++) {
        for (var j = 0; j < matrix.length; j++) {
          temp = matrix[i][j];
          matrix[i][j] = matrix[matrix.length - 1 - i][j];
          matrix[matrix.length - 1 - i][j] = temp;
        }
      }
      return matrix;
    }
  }, {
    key: 'handleRotate',
    value: function handleRotate(piece) {
      switch (piece.type) {
        case 'T':
        case 'O':
        case 'J':
        case 'L':
          piece.matrix = this.rotate(piece.matrix);
          return piece;
        case 'Z':
        case 'S':
        case 'I':
          this.totalRotations += 1;
          if (this.totalRotations % 2 !== 0) {
            piece.matrix = this.rotate(piece.matrix);
          } else {
            piece.matrix = this.rotateCounter(piece.matrix);
          }
          return piece;
      }
    }
  }, {
    key: 'handleUnrotate',
    value: function handleUnrotate(piece) {
      switch (piece.type) {
        case 'T':
        case 'O':
        case 'J':
        case 'L':
          piece.matrix = this.rotateCounter(piece.matrix);
          return piece;
        case 'Z':
        case 'S':
        case 'I':
          //since we're unrotating, at a high level of thinking we
          //shouldn't actually count another rotation.
          // this.totalRotations += 1;
          if (this.totalRotations % 2 !== 0) {
            piece.matrix = this.rotateCounter(piece.matrix);
          } else {
            piece.matrix = this.rotate(piece.matrix);
          }
          return piece;
      }
    }
  }, {
    key: 'boardStep',
    value: function boardStep() {
      this.board.render();
      this.board.drawPiece(this.currentPiece.matrix, this.offset);
      this.board.drawNext(this.nextPiece.matrix);
    }
  }, {
    key: 'addKeyListeners',
    value: function addKeyListeners() {
      var _this = this;

      document.addEventListener('keydown', function (e) {
        switch (e.key) {
          case 'd':
          case 'ArrowRight':
            if (!_this.gameOver) {
              _this.offset.x += 1;
              if (_this.board.validPos(_this.currentPiece.matrix, _this.offset)) {
                _this.boardStep();
              } else {
                _this.offset.x -= 1;
              }
            }
            break;
          case 'a':
          case 'ArrowLeft':
            if (!_this.gameOver) {
              _this.offset.x -= 1;
              if (_this.board.validPos(_this.currentPiece.matrix, _this.offset)) {
                _this.boardStep();
              } else {
                _this.offset.x += 1;
              }
            }
            break;
          case 's':
          case 'ArrowDown':
            e.preventDefault();
            if (!_this.gameOver) {
              _this.offset.y += 1;
              if (_this.board.update(_this.currentPiece.matrix, _this.offset)) {
                _this.offset.y = 0;
                _this.offset.x = 4;
                _this.totalRotations = 0;
                _this.currentPiece = _this.nextPiece;
                _this.nextPiece = _this.pieces.newPiece();
              }
              _this.resetTime = 0;
              _this.boardStep();
              _this.gameOver = _this.board.checkGameOver(_this.currentPiece.matrix, _this.offset);
              if (_this.gameOver) {
                _this.gameOverOnce = true;
                _this.playingGame = false;
                var notGameOver = document.getElementById('not-game-over');
                notGameOver.setAttribute("id", "game-over");
                cancelAnimationFrame(_this.animationFrame);
              }
            }
            break;
          case 'w':
          case 'ArrowUp':
            e.preventDefault();
            _this.currentPiece = _this.handleRotate(_this.currentPiece);
            var response = _this.board.validateRotate(_this.currentPiece.matrix, _this.offset);
            if (response.reRotate) {
              _this.currentPiece = _this.handleUnrotate(_this.currentPiece);
            } else {
              _this.offset = response.offset;
            }
            _this.boardStep();
            break;
          case ' ':
            e.preventDefault();
            if (!_this.gameOver) {
              e.preventDefault();
              _this.board.handleDrop(_this.currentPiece.matrix, _this.offset);
              _this.offset.y = 0;
              _this.offset.x = 4;
              _this.totalRotations = 0;
              _this.currentPiece = _this.nextPiece;
              _this.nextPiece = _this.pieces.newPiece();
              _this.boardStep();
            }
        }
      });
    }
  }, {
    key: 'restart',
    value: function restart() {
      //clear old board because we are not actually clearing HTML canvas before
      //new game starts playing
      this.board.ctx.clearRect(0, 0, this.board.width, this.board.height);
      this.board.emptyBoard();
      var gameOver = document.getElementById('game-over');
      gameOver.setAttribute("id", "not-game-over");
      this.animationFrame = null;
      this.offset = {
        x: 4,
        y: 0
      };
      this.totalRotations = 0;
      this.currentPiece = this.pieces.newPiece();
      this.nextPiece = this.pieces.newPiece();
      this.startTime = null;
      this.resetTime = 0;
      this.timeStep = 1000;
      this.foreverTime = 0;
      this.gameOver = false;
      this.play();
    }
  }, {
    key: 'play',
    value: function play() {
      var _this2 = this;

      if (this.playingGame || this.gameOver) {
        return true;
      } else {
        this.playingGame = true;
        this.megamanAudio.play();
        this.megamanPlaying = true;

        if (!this.gameOverOnce) {
          this.addKeyListeners();
          var gameStart = document.getElementById('before-game-start');
          gameStart.setAttribute("id", "game-start");
        }

        var render = function render(timestamp) {
          _this2.resetTime += timestamp - _this2.startTime;
          _this2.foreverTime += timestamp - _this2.startTime;
          if (_this2.foreverTime > 32000) {
            _this2.foreverTime = 0;
            _this2.timeStep = _this2.timeStep * 0.9;
          }
          if (_this2.resetTime > _this2.timeStep) {
            _this2.resetTime = 0;
            _this2.offset.y += 1;
            if (_this2.board.update(_this2.currentPiece.matrix, _this2.offset)) {
              _this2.offset.y = 0;
              _this2.offset.x = 4;
              _this2.totalRotations = 0;
              _this2.currentPiece = _this2.nextPiece;
              _this2.nextPiece = _this2.pieces.newPiece();
            }
            _this2.boardStep();
            _this2.gameOver = _this2.board.checkGameOver(_this2.currentPiece.matrix, _this2.offset);
            if (_this2.gameOver) {
              _this2.gameOverOnce = true;
              _this2.playingGame = false;
              var notGameOver = document.getElementById('not-game-over');
              notGameOver.setAttribute("id", "game-over");
              cancelAnimationFrame(_this2.animationFrame);
              return true;
            }
          }
          _this2.startTime = timestamp;
          _this2.animationFrame = requestAnimationFrame(render);
        };

        this.animationFrame = requestAnimationFrame(function (timestamp) {
          _this2.startTime = timestamp;
          _this2.board.drawPiece(_this2.currentPiece.matrix, _this2.offset);
          _this2.board.drawNext(_this2.nextPiece.matrix);
          render(timestamp);
        });
      }
    }
  }]);

  return Game;
}();

exports.default = Game;

/***/ }),

/***/ "./src/lru/cache.js":
/*!**************************!*\
  !*** ./src/lru/cache.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _linkedList = __webpack_require__(/*! ./linkedList */ "./src/lru/linkedList.js");

var _linkedList2 = _interopRequireDefault(_linkedList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LRUCache = function () {
  function LRUCache(maxCount, pieceValues) {
    _classCallCheck(this, LRUCache);

    this.count = 0;
    this.max = maxCount;
    this.map = {};
    this.list = new _linkedList2.default();
    this.pieceValues = pieceValues;
  }

  _createClass(LRUCache, [{
    key: 'get',
    value: function get(key) {
      if (this.map[key] !== undefined) {
        var node = this.map[key];
        node.remove();
        var newNode = this.list.add(node.key, node.val);
        this.map[key] = newNode;
      } else if (this.count < this.max) {
        var _newNode = this.list.add(key, this.pieceValues[key]);
        this.count += 1;
        this.map[key] = _newNode;
      } else {
        var oldestNode = this.list.oldest();
        oldestNode.remove();
        delete this.map[oldestNode.key];
        var _newNode2 = this.list.add(key, this.pieceValues[key]);
        this.map[key] = _newNode2;
      }
    }
  }]);

  return LRUCache;
}();

exports.default = LRUCache;

/***/ }),

/***/ "./src/lru/linkedList.js":
/*!*******************************!*\
  !*** ./src/lru/linkedList.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
  function Node(key, val) {
    _classCallCheck(this, Node);

    this.key = key;
    this.val = val;
    this.next = null;
    this.last = null;
  }

  _createClass(Node, [{
    key: "remove",
    value: function remove() {
      if (this.next) {
        this.next.last = this.last;
      }
      if (this.last) {
        this.last.next = this.next;
      }
      this.next = null;
      this.last = null;
    }
  }]);

  return Node;
}();

var LinkedList = function () {
  function LinkedList() {
    _classCallCheck(this, LinkedList);

    //head node is the MRU, tail is the LRU to be ejected
    this.head = new Node();
    this.tail = new Node();
    this.head.last = this.tail;
    this.tail.next = this.head;
  }

  _createClass(LinkedList, [{
    key: "add",
    value: function add(key, val) {
      var node = new Node(key, val);
      node.next = this.head;
      node.last = this.head.last;
      this.head.last.next = node;
      this.head.last = node;
      return node;
    }
  }, {
    key: "oldest",
    value: function oldest() {
      if (this.head.last === this.tail) {
        return null;
      } else {
        return this.tail.next;
      }
    }

    // newest() {
    //   if (this.head.last === this.tail) {
    //     return null;
    //   } else {
    //     return this.head.last;
    //   }
    // }

  }]);

  return LinkedList;
}();

exports.default = LinkedList;

/***/ }),

/***/ "./src/pieces.js":
/*!***********************!*\
  !*** ./src/pieces.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cache = __webpack_require__(/*! ./lru/cache */ "./src/lru/cache.js");

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pieces = function () {
  function Pieces() {
    _classCallCheck(this, Pieces);

    this.pieces = {
      'I': [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
      'O': [[0, 0, 0, 0], [0, 2, 2, 0], [0, 2, 2, 0], [0, 0, 0, 0]],
      'T': [[0, 0, 0], [3, 3, 3], [0, 3, 0]],
      'L': [[0, 4, 0], [0, 4, 0], [0, 4, 4]],
      'J': [[0, 5, 0], [0, 5, 0], [5, 5, 0]],
      'Z': [[0, 0, 0], [6, 6, 0], [0, 6, 6]],
      'S': [[0, 0, 0], [0, 7, 7], [7, 7, 0]]
    };
    this.bag = ['I', 'O', 'T', 'L', 'J', 'Z', 'S'];
    this.lru = new _cache2.default(3, this.pieces);
  }

  //the fisher-yates shuffle


  _createClass(Pieces, [{
    key: 'shuffle',
    value: function shuffle() {
      var randomIndex = void 0,
          current = void 0;
      for (var i = this.bag.length - 1; i >= 0; i--) {
        randomIndex = Math.floor(Math.random() * (i + 1));
        current = this.bag[i];
        this.bag[i] = this.bag[randomIndex];
        this.bag[randomIndex] = current;
      }
      return this.bag;
    }
  }, {
    key: 'newPiece',
    value: function newPiece() {
      var piece = this.shuffle()[0];
      while (this.lru.map[piece] !== undefined) {
        piece = this.shuffle()[0];
      }
      this.lru.get(piece);
      return {
        type: piece,
        matrix: this.lru.map[piece].val
      };
    }
  }]);

  return Pieces;
}();

exports.default = Pieces;

/***/ }),

/***/ "./src/shadowBoard.js":
/*!****************************!*\
  !*** ./src/shadowBoard.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(/*! ./util */ "./src/util.js");

var boardUtil = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShadowBoard = function () {
  function ShadowBoard(grid) {
    _classCallCheck(this, ShadowBoard);

    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0].length;
    this.emptyBoard = this.emptyBoard.bind(this);
  }

  _createClass(ShadowBoard, [{
    key: 'emptyBoard',
    value: function emptyBoard() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          this.grid[i][j] = undefined;
        }
      }
    }
  }, {
    key: 'update',
    value: function update(piece, offset) {
      if (offset.y < 0) {
        return false;
      }
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            var x = offset.x + j;
            var y = offset.y + i;
            if (y >= this.rows || typeof this.grid[y][x] !== 'undefined') {
              this.setPiece(piece, offset.x, offset.y - 1);
              this.clearRows(piece.length, offset.y - 1);
              return true;
            }
          }
        }
      }
      return false;
    }
  }, {
    key: 'clearRows',
    value: function clearRows(numRows, startY) {
      for (var i = 0; i < numRows; i++) {
        if (this.fullRow(startY + i)) {
          this.removeRow(startY + i);
        }
      }
    }
  }, {
    key: 'fullRow',
    value: function fullRow(row_idx) {
      var row = this.grid[row_idx];
      if (row === undefined) {
        return false;
      }
      for (var i = 0; i < row.length; i++) {
        if (typeof row[i] === 'undefined') {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'removeRow',
    value: function removeRow(row_idx) {
      var row = this.grid[row_idx];
      for (var i = row_idx - 1; i >= 0; i--) {
        for (var j = 0; j < row.length; j++) {
          this.grid[i + 1][j] = this.grid[i][j];
        }
      }
      for (var _j = 0; _j < row.length; _j++) {
        this.grid[0][_j] = undefined;
      }
    }

    //updates the grid with the piece values

  }, {
    key: 'setPiece',
    value: function setPiece(piece, x, y) {
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            this.grid[y + i][x + j] = piece[i][j];
          }
        }
      }
    }
  }, {
    key: 'validPos',
    value: function validPos(piece, offset) {
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            var x = offset.x + j;
            var y = offset.y + i;
            if (!boardUtil.between(x, 0, this.cols - 1) || !boardUtil.between(y, 0, this.rows - 1)) {
              return false;
            }
            if (typeof this.grid[y][x] !== 'undefined') {
              return false;
            }
          }
        }
      }
      return true;
    }

    //helper method for validateRotate

  }, {
    key: 'handleResponse',
    value: function handleResponse(piece, offset, newOffset) {
      if (this.validPos(piece, newOffset)) {
        return {
          reRotate: false,
          offset: newOffset
        };
      } else {
        return {
          reRotate: true,
          offset: offset
        };
      }
    }

    //helper method for validateRotate

  }, {
    key: 'handleX',
    value: function handleX(x, piece, offset) {
      var newOffset = {
        x: offset.x,
        y: offset.y
      };
      if (boardUtil.between(x, 0, this.cols - 1)) {
        return null;
      } else if (x < 0) {
        newOffset.x += 1;
        return this.handleResponse(piece, offset, newOffset);
      } else if (x > this.cols - 1) {
        //reminder: may want to subtract Math.floor(piece.length/2)
        //to account for the line pieces hugging the right side of the board
        newOffset.x -= 1;
        return this.handleResponse(piece, offset, newOffset);
      }
    }
  }, {
    key: 'handleY',
    value: function handleY(y, piece, offset) {
      var newOffset = {
        x: offset.x,
        y: offset.y
      };
      if (boardUtil.between(y, 0, this.rows - 1)) {
        return null;
      } else if (y < 0) {
        newOffset.y += 1;
        return this.handleResponse(piece, offset, newOffset);
      } else if (y > this.rows - 1) {
        newOffset.y -= 1;
        return this.handleResponse(piece, offset, newOffset);
      }
    }
  }, {
    key: 'handleP',
    value: function handleP(x, piece, offset) {
      var newOffset = {
        x: offset.x,
        y: offset.y
      };
      if (boardUtil.rightOrLeft(piece, x) === 'left') {
        newOffset.x += 1;
        //try moving the piece up one before giving up
        var response = this.handleResponse(piece, offset, newOffset);
        if (response.reRotate) {
          newOffset.x -= 1;
          newOffset.y -= 1;
          return this.handleResponse(piece, offset, newOffset);
        }
        return response;
      } else if (boardUtil.rightOrLeft(piece, x) === 'right') {
        newOffset.x -= 1;
        var _response = this.handleResponse(piece, offset, newOffset);
        if (_response.reRotate) {
          newOffset.x += 1;
          newOffset.y -= 1;
          return this.handleResponse(piece, offset, newOffset);
        }
        return _response;
      }
    }
  }, {
    key: 'validateRotate',
    value: function validateRotate(piece, offset) {
      var handledX = void 0,
          handledY = void 0;
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            var x = offset.x + j;
            var y = offset.y + i;
            handledX = this.handleX(x, piece, offset);
            if (handledX) {
              return handledX;
            }
            handledY = this.handleY(y, piece, offset);
            if (handledY) {
              return handledY;
            }
            if (typeof this.grid[y][x] !== 'undefined') {
              return this.handleP(x, piece, offset);
            }
          }
        }
      }
      return {
        reRotate: false,
        offset: offset
      };
    }
  }, {
    key: 'handleDrop',
    value: function handleDrop(piece, offset) {
      var minDelta = void 0;
      var setY = void 0;
      minDelta = boardUtil.deltaY(piece, offset, this.rows, this.grid);
      offset.y += minDelta;
      if (offset.y === 0) {
        setY = 0;
      } else {
        setY = offset.y - 1;
      }
      this.setPiece(piece, offset.x, setY);
      this.clearRows(piece.length, setY);
    }
  }, {
    key: 'checkGameOver',
    value: function checkGameOver(piece, offset) {
      if (offset.y !== 0) {
        return false;
      }
      if (!this.validPos(piece, offset)) {
        return true;
      }
      return false;
    }

    /*
     █████  ██     ███    ███ ███████ ████████ ██   ██  ██████  ██████  ███████
    ██   ██ ██     ████  ████ ██         ██    ██   ██ ██    ██ ██   ██ ██
    ███████ ██     ██ ████ ██ █████      ██    ███████ ██    ██ ██   ██ ███████
    ██   ██ ██     ██  ██  ██ ██         ██    ██   ██ ██    ██ ██   ██      ██
    ██   ██ ██     ██      ██ ███████    ██    ██   ██  ██████  ██████  ███████
    */

  }, {
    key: 'fullRows',
    value: function fullRows(numRows, startY) {
      var total = 0;
      for (var i = 0; i < numRows; i++) {
        if (this.fullRow(startY + i)) {
          total += 1;
        }
      }
      return total;
    }
  }, {
    key: 'getMaxHeight',
    value: function getMaxHeight() {
      var peaksRemaining = 10;
      var maxPeak = 0;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (peaksRemaining === 0) {
            break;
          }
          if (this.grid[i][j] !== undefined) {
            peaksRemaining -= 1;
            if (this.rows - i > maxPeak) {
              maxPeak = this.rows - i;
            }
          }
        }
      }
      return maxPeak;
    }
  }, {
    key: 'getCumulativeHeight',
    value: function getCumulativeHeight(fullRows) {
      var peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      var peaksRemaining = 10;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (peaksRemaining === 0) {
            break;
          }
          if (this.grid[i][j] !== undefined && peaks[j] < 0) {
            peaks[j] = this.rows - i;
            peaksRemaining -= 1;
          }
        }
      }
      var cumulativeHeight = 0;
      for (var p = 0; p < peaks.length; p++) {
        if (peaks[p] > 0) {
          cumulativeHeight += peaks[p];
        }
      }
      //do the below because remember we're not actually clearing rows,
      //just keeping track of how many rows are filled
      return cumulativeHeight - fullRows * 10;
    }
  }, {
    key: 'getRelativeHeight',
    value: function getRelativeHeight() {
      var peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      var peaksRemaining = 10;
      var minPeak = 99;
      var maxPeak = 0;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (peaksRemaining === 0) {
            break;
          }
          if (this.grid[i][j] !== undefined && peaks[j] < 0) {
            peaks[j] = this.rows - i;
            peaksRemaining -= 1;
            if (peaks[j] > maxPeak) {
              maxPeak = peaks[j];
            }
            if (peaks[j] < minPeak) {
              minPeak = peaks[j];
            }
          }
        }
      }
      return maxPeak - minPeak;
    }
  }, {
    key: 'getHoles',
    value: function getHoles() {
      var peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      var peaksRemaining = 10;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (peaksRemaining === 0) {
            break;
          }
          if (this.grid[i][j] !== undefined && peaks[j] < 0) {
            peaks[j] = this.rows - i;
            peaksRemaining -= 1;
          }
        }
      }
      var holes = 0;
      for (var p = 0; p < peaks.length; p++) {
        for (var row = 0; row < peaks[p]; row++) {
          if (this.grid[row][p] === undefined) {
            holes += 1;
          }
        }
      }
      return holes;
    }

    //roughness is the sum of relative height differences between columns

  }, {
    key: 'getRoughness',
    value: function getRoughness() {
      var roughness = 0;
      var peaks = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      var peaksRemaining = 10;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (peaksRemaining === 0) {
            break;
          }
          if (this.grid[i][j] !== undefined && peaks[j] < 0) {
            peaks[j] = this.rows - i;
            peaksRemaining -= 1;
          }
        }
      }
      for (var p = 0; p < peaks.length - 1; p++) {
        var currPeak = peaks[p + 1] < 0 ? 0 : peaks[p + 1];
        roughness += Math.abs(peaks[p] - currPeak);
      }
      return roughness;
    }
  }, {
    key: 'removePiece',
    value: function removePiece(piece, x, y) {
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            this.grid[y + i][x + j] = undefined;
          }
        }
      }
    }
  }]);

  return ShadowBoard;
}();

exports.default = ShadowBoard;

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var rightOrLeft = exports.rightOrLeft = function rightOrLeft(piece, x) {
  var middle = Math.floor(piece.length / 2);
  return x < middle ? 'left' : 'right';
};

var between = exports.between = function between(num, low, high) {
  if (num < low || num > high) {
    return false;
  } else {
    return true;
  }
};

var deltaY = exports.deltaY = function deltaY(piece, offset, rows, grid) {
  var minDelta = void 0,
      dy = void 0;
  for (var i = 0; i < piece.length; i++) {
    for (var j = 0; j < piece[0].length; j++) {
      if (piece[i][j] !== 0) {
        dy = 0;
        while (i + offset.y + dy < rows && !grid[i + offset.y + dy][j + offset.x]) {
          dy += 1;
        }
        if (!minDelta || dy < minDelta) {
          minDelta = dy;
        }
      }
    }
  }
  return minDelta;
};

var deepDup = exports.deepDup = function deepDup(arr) {
  var duped = new Array(arr.length);
  for (var i = 0; i < duped.length; i++) {
    duped[i] = new Array(arr[0].length);
  }
  for (var row = 0; row < arr.length; row++) {
    for (var col = 0; col < arr[0].length; col++) {
      duped[row][col] = arr[row][col];
    }
  }
  return duped;
};

var randNumRange = exports.randNumRange = function randNumRange(min, max) {
  return Math.floor(Math.pow(Math.random(), 2) * (max - min + 1) + min);
};

var randSelect = exports.randSelect = function randSelect(a, b) {
  return Math.round(Math.random()) === 0 ? a : b;
};

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map