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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//transpose a square matrix with space considerations
var transpose = function transpose(matrix) {
  var temp = void 0;
  for (var i = 0; i < matrix.length; i++) {
    for (var j = i + 1; j < matrix.length; j++) {
      temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
  return matrix;
};

//we are prioritizing space over time complexity here. creating a new
//matrix should give us faster time complexity, but both ways are still O(n^2)
var rotate = function rotate(matrix) {
  var temp = void 0;
  var transposed = transpose(matrix);
  //reverse the columns
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < Math.floor(matrix.length / 2); j++) {
      temp = matrix[i][j];
      matrix[i][j] = matrix[i][matrix.length - 1 - j];
      matrix[i][matrix.length - 1 - j] = temp;
    }
  }
  return matrix;
};

window.rotate = rotate;

document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById("canvas");
  canvas.width = 300;
  canvas.height = 720;
  var square_width = canvas.width / 10;
  var ctx = canvas.getContext('2d');

  var board = new _board2.default(canvas.width, canvas.height, ctx);
  var game = new _game2.default(board);
  // debugger;
  document.addEventListener("keypress", function (event) {
    if (event.key === 'm') {
      game.toggleAudio();
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

  // game.play();

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
  function Board(width, height, ctx) {
    _classCallCheck(this, Board);

    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.rows = 24;
    this.cols = 10;
    this.grid = [];
    this.strokeStyle = '#000000';
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
      7: '#F3C73D'
    };
  }

  _createClass(Board, [{
    key: 'render',
    value: function render() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      var s_w = this.square_width;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (typeof this.grid[i][j] !== 'undefined') {
            this.ctx.fillStyle = this.colors[this.grid[i][j]];
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.lineWidth = 2;
            var x = j * s_w;
            var y = i * s_w;
            this.ctx.fillRect(x, y, s_w, s_w);
            this.ctx.strokeRect(x, y, s_w, s_w);
            this.ctx.beginPath();
            this.ctx.moveTo(x + s_w / 4, y + s_w * (3 / 4));
            this.ctx.lineTo(x + s_w / 4, y + s_w / 4);
            this.ctx.lineTo(x + s_w * (3 / 4), y + s_w / 4);
            this.ctx.stroke();
          }
        }
      }
    }
  }, {
    key: 'drawPiece',
    value: function drawPiece(piece, offset) {
      var s_w = this.square_width;
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            this.ctx.fillStyle = this.colors[piece[i][j]];
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.lineWidth = 2;
            var x = (offset.x + j) * s_w;
            var y = (offset.y + i) * s_w;
            this.ctx.fillRect(x, y, s_w, s_w);
            this.ctx.strokeRect(x, y, s_w, s_w);
            this.ctx.beginPath();
            this.ctx.moveTo(x + s_w / 4, y + s_w * (3 / 4));
            this.ctx.lineTo(x + s_w / 4, y + s_w / 4);
            this.ctx.lineTo(x + s_w * (3 / 4), y + s_w / 4);
            this.ctx.stroke();
          }
        }
      }
    }
  }, {
    key: 'update',
    value: function update(piece, offset) {
      for (var i = 0; i < piece.length; i++) {
        for (var j = 0; j < piece[0].length; j++) {
          if (piece[i][j] !== 0) {
            var x = offset.x + j;
            var y = offset.y + i;
            if (y >= this.rows || typeof this.grid[y][x] !== 'undefined') {
              this.setPiece(piece, offset.x, offset.y - 1);
              return true;
            }
          }
        }
      }
      return false;
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(board) {
    _classCallCheck(this, Game);

    this.board = board;
    this.offset = {
      x: 4,
      y: 0
    };
    this.piece = [[0, 0, 0], [1, 1, 1], [0, 1, 0]];
    this.startTime;
    this.resetTime = 0;
    this.titlePlaying = true;
    this.titleEnded = false;
    this.megamanPlaying = false;
    this.playingGame = false;
    this.megamanAudio = document.getElementById("megaman-theme");
    this.titleAudio = document.getElementById("title-theme");
  }

  _createClass(Game, [{
    key: "toggleAudio",
    value: function toggleAudio() {
      if (!this.playingGame && !this.titleEnded) {
        if (this.titlePlaying) {
          this.titleAudio.pause();
          this.titlePlaying = false;
        } else {
          this.titleAudio.play();
          this.titlePlaying = true;
        }
      } else if (this.playingGame) {
        if (this.megamanPlaying) {
          this.megamanAudio.pause();
          this.megamanPlaying = false;
        } else {
          this.megamanAudio.play();
          this.megamanPlaying = true;
        }
      }
    }
  }, {
    key: "boardStep",
    value: function boardStep() {
      this.board.render();
      this.board.drawPiece(this.piece, this.offset);
    }
  }, {
    key: "addKeyListeners",
    value: function addKeyListeners() {
      var _this = this;

      document.addEventListener('keydown', function (e) {
        switch (e.key) {
          case 'ArrowRight':
            _this.offset.x += 1;
            if (_this.board.validPos(_this.piece, _this.offset)) {
              _this.boardStep();
            } else {
              _this.offset.x -= 1;
            }
            break;
          case 'ArrowLeft':
            _this.offset.x -= 1;
            if (_this.board.validPos(_this.piece, _this.offset)) {
              _this.boardStep();
            } else {
              _this.offset.x += 1;
            }
            break;
          case 'ArrowDown':
            _this.offset.y += 1;
            if (_this.board.update(_this.piece, _this.offset)) {
              _this.offset.y = 0;
            }
            _this.resetTime = 0;
            _this.boardStep();
            break;
        }
      });
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

        this.addKeyListeners();

        var render = function render(timestamp) {
          _this2.resetTime += timestamp - _this2.startTime;
          if (_this2.resetTime > 1000) {
            _this2.resetTime = 0;
            _this2.offset.y += 1;
            if (_this2.board.update(_this2.piece, _this2.offset)) {
              _this2.offset.y = 0;
            }
            _this2.boardStep();
          }
          _this2.startTime = timestamp;
          requestAnimationFrame(render);
        };

        requestAnimationFrame(function (timestamp) {
          _this2.startTime = timestamp;
          _this2.board.drawPiece(_this2.piece, _this2.offset);
          render(timestamp);
        });
      }
    }
  }]);

  return Game;
}();

exports.default = Game;

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map