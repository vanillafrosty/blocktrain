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

var _cache = __webpack_require__(/*! ./lru/cache */ "./src/lru/cache.js");

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById("canvas");
  canvas.width = 300;
  canvas.height = 630;
  var nextPieceCanvas = document.getElementById("next-piece-canvas");
  nextPieceCanvas.width = 120;
  nextPieceCanvas.height = 150;

  var square_width = canvas.width / 10;
  var ctx = canvas.getContext('2d');
  var nextPieceCtx = nextPieceCanvas.getContext('2d');

  var board = new _board2.default(canvas.width, canvas.height, ctx, nextPieceCtx);
  var game = new _game2.default(board);

  document.addEventListener("keypress", function (event) {
    if (event.key === 'm') {
      game.toggleAudio();
    } else if (event.key === 'r') {
      if (game.gameOver) {
        game.restart();
      }
    }
  });
  var titleAudio = document.getElementById("title-theme");
  titleAudio.addEventListener("ended", function () {
    game.titleEnded = true;
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
      minDelta = this.deltaY(piece, offset);
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
      // debugger;
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            this.grid[y + i][x + j] = piece[i][j];
          }
        }
      }
    }

    //checks that a number is between a lower and higher bound (inclusive)

  }, {
    key: 'between',
    value: function between(num, low, high) {
      if (num < low || num > high) {
        return false;
      } else {
        return true;
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
            if (!this.between(x, 0, this.cols - 1) || !this.between(y, 0, this.rows - 1)) {
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
      if (this.between(x, 0, this.cols - 1)) {
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
      if (this.between(y, 0, this.rows - 1)) {
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
    key: 'validateRotate',
    value: function validateRotate(piece, offset) {
      var newOffset = {
        x: offset.x,
        y: offset.y
      };
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
              if (this.rightOrLeft(piece, x) === 'left') {
                newOffset.x += 1;
                //try moving the piece up one before giving up
                var response = this.handleResponse(piece, offset, newOffset);
                if (response.reRotate) {
                  newOffset.x -= 1;
                  newOffset.y -= 1;
                  return this.handleResponse(piece, offset, newOffset);
                }
                return response;
              } else if (this.rightOrLeft(piece, x) === 'right') {
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
          }
        }
      }
      return {
        reRotate: false,
        offset: offset
      };
    }
  }, {
    key: 'rightOrLeft',
    value: function rightOrLeft(piece, x) {
      var middle = Math.floor(piece.length / 2);
      return x < middle ? 'left' : 'right';
    }
  }, {
    key: 'deltaY',
    value: function deltaY(piece, offset) {
      var minDelta = void 0,
          dy = void 0;
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            dy = 0;
            while (i + offset.y + dy < this.rows && !this.grid[i + offset.y + dy][j + offset.x]) {
              dy += 1;
            }
            if (!minDelta || dy < minDelta) {
              minDelta = dy;
            }
          }
        }
      }
      return minDelta;
    }
  }, {
    key: 'handleDrop',
    value: function handleDrop(piece, offset) {
      var minDelta = void 0;
      minDelta = this.deltaY(piece, offset);
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
    this.titlePlaying = false;
    this.titleEnded = false;
    this.megamanPlaying = false;
    this.playingGame = false;
    this.gameOver = false;
    this.megamanAudio = document.getElementById("megaman-theme");
    this.titleAudio = document.getElementById("title-theme");
  }

  _createClass(Game, [{
    key: "toggleAudio",
    value: function toggleAudio() {
      if (this.playingGame || this.gameOver) {
        if (this.megamanPlaying) {
          this.megamanAudio.pause();
          this.megamanPlaying = false;
        } else {
          this.megamanAudio.play();
          this.megamanPlaying = true;
        }
      } else if (!this.playingGame && !this.titleEnded) {
        if (this.titlePlaying) {
          this.titleAudio.pause();
          this.titlePlaying = false;
        } else {
          this.titleAudio.play();
          this.titlePlaying = true;
        }
      }
    }

    //transpose a square matrix with space considerations

  }, {
    key: "transpose",
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
    key: "rotate",
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
    key: "rotateCounter",
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
    key: "handleRotate",
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
    key: "handleUnrotate",
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
    key: "boardStep",
    value: function boardStep() {
      this.board.render();
      this.board.drawPiece(this.currentPiece.matrix, this.offset);
    }
  }, {
    key: "addKeyListeners",
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
                _this.board.drawNext(_this.nextPiece.matrix);
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
              _this.board.drawNext(_this.nextPiece.matrix);
              _this.boardStep();
            }
        }
      });
    }
  }, {
    key: "restart",
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
    key: "play",
    value: function play() {
      var _this2 = this;

      if (this.playingGame) {
        return true;
      } else {
        this.playingGame = true;
        this.titleAudio.pause();
        this.titlePlaying = false;
        this.megamanAudio.play();
        this.megamanPlaying = true;

        if (!this.gameOverOnce) {
          this.addKeyListeners();
        }

        var render = function render(timestamp) {
          _this2.resetTime += timestamp - _this2.startTime;
          _this2.foreverTime += timestamp - _this2.startTime;
          if (_this2.foreverTime > 40000) {
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
              _this2.board.drawNext(_this2.nextPiece.matrix);
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
      // debugger;
      return {
        type: piece,
        matrix: this.lru.map[piece].val
      };
    }
  }]);

  return Pieces;
}();

exports.default = Pieces;

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map