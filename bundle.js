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

var rotateCounter = function rotateCounter(matrix) {
  var temp = void 0;
  var transposed = transpose(matrix);
  //reverse the rows
  for (var i = 0; i < Math.floor(matrix.length / 2); i++) {
    for (var j = 0; j < matrix.length; j++) {
      temp = matrix[i][j];
      matrix[i][j] = matrix[matrix.length - 1 - i][j];
      matrix[matrix.length - 1 - i][j] = temp;
    }
  }
  return matrix;
};

window.rotate = rotate;
window.rotateCounter = rotateCounter;

document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById("canvas");
  canvas.width = 300;
  canvas.height = 720;
  var square_width = canvas.width / 10;
  var ctx = canvas.getContext('2d');

  var board = new _board2.default(canvas.width, canvas.height, ctx);
  var game = new _game2.default(board);

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
      7: '#F14D17'
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
          }
        }
      }
      return {
        reRotate: false,
        offset: offset
      };
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

    this.board = board;
    this.offset = {
      x: 4,
      y: -2
    };
    this.totalRotations = 0;
    this.pieces = new _pieces2.default();
    this.currentPiece = this.pieces.newPiece();
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
        e.preventDefault();
        switch (e.key) {
          case 'ArrowRight':
            _this.offset.x += 1;
            if (_this.board.validPos(_this.currentPiece.matrix, _this.offset)) {
              _this.boardStep();
            } else {
              _this.offset.x -= 1;
            }
            break;
          case 'ArrowLeft':
            _this.offset.x -= 1;
            if (_this.board.validPos(_this.currentPiece.matrix, _this.offset)) {
              _this.boardStep();
            } else {
              _this.offset.x += 1;
            }
            break;
          case 'ArrowDown':
            _this.offset.y += 1;
            if (_this.board.update(_this.currentPiece.matrix, _this.offset)) {
              // this.offset.y = 0;
              _this.offset.y = -2;
              _this.offset.x = 4;
              _this.totalRotations = 0;
              _this.currentPiece = _this.pieces.newPiece();
            }
            _this.resetTime = 0;
            _this.boardStep();
            break;
          case 'ArrowUp':
            _this.currentPiece = _this.handleRotate(_this.currentPiece);
            var response = _this.board.validateRotate(_this.currentPiece.matrix, _this.offset);
            if (response.reRotate) {
              _this.currentPiece = _this.handleUnrotate(_this.currentPiece);
            } else {
              _this.offset = response.offset;
            }
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
            if (_this2.board.update(_this2.currentPiece.matrix, _this2.offset)) {
              // this.offset.y = 0;
              _this2.offset.y = -2;
              _this2.offset.x = 4;
              _this2.totalRotations = 0;
              _this2.currentPiece = _this2.pieces.newPiece();
            }
            _this2.boardStep();
          }
          _this2.startTime = timestamp;
          requestAnimationFrame(render);
        };

        requestAnimationFrame(function (timestamp) {
          _this2.startTime = timestamp;
          _this2.board.drawPiece(_this2.currentPiece.matrix, _this2.offset);
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

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map