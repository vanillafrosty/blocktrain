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

document.addEventListener('DOMContentLoaded', function () {
  console.log('hey');
  var game = new _game2.default();
  // debugger;
  document.addEventListener("keypress", function (event) {
    if (event.key === 'm') {
      game.toggleAudio();
    }
  });
  // const toggleButton = document.getElementById("toggleAudio");
  // toggleButton.addEventListener("click", game.toggleAudio);
  var titleAudio = document.getElementById("title-theme");
  titleAudio.addEventListener("ended", function () {
    game.titleEnded = true;
  });
  var canvas = document.getElementById("canvas");
  canvas.width = 300;
  canvas.height = 720;
  var square_width = canvas.width / 10;
  var ctx = canvas.getContext('2d');

  var board = new _board2.default(canvas.width, canvas.height);

  var piece = [[0, 0, 0], [1, 1, 1], [0, 1, 0]];

  var offset = {
    x: 4,
    y: 0
  };
  var draw = function draw(piece, offset, ctx) {
    for (var i = 0; i < piece.length; i++) {
      for (var j = 0; j < piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          ctx.fillStyle = 'rgb(200,0,0)';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          var x = (offset.x + j) * square_width;
          var y = (offset.y + i) * square_width;
          ctx.fillRect(x, y, square_width, square_width);
          ctx.strokeRect(x, y, square_width, square_width);
          ctx.beginPath();
          ctx.moveTo(x + square_width / 4, y + square_width * (3 / 4));
          ctx.lineTo(x + square_width / 4, y + square_width / 4);
          ctx.lineTo(x + square_width * (3 / 4), y + square_width / 4);
          ctx.stroke();
        }
      }
    }
  };

  // const clearBoard = (ctx) => {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  // }

  var startTime = void 0;
  var resetTime = 0;
  var render = function render(timestamp) {
    resetTime += timestamp - startTime;
    if (resetTime > 1000) {
      resetTime = 0;
      offset.y += 1;
      console.log(timestamp - startTime);
      board.render(ctx);
      draw(piece, offset, ctx);
    }
    startTime = timestamp;
    requestAnimationFrame(render);
  };

  requestAnimationFrame(function (timestamp) {
    startTime = timestamp;
    draw(piece, offset, ctx);
    render(timestamp);
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
  function Board(width, height) {
    _classCallCheck(this, Board);

    this.width = width;
    this.height = height;
    this.rows = 24;
    this.cols = 10;
    this.grid = [];
    this.offset = {
      x: 4,
      y: 0
    };
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
    this.render = this.render.bind(this);
  }

  _createClass(Board, [{
    key: 'render',
    value: function render(ctx) {
      ctx.clearRect(0, 0, this.width, this.height);
      var s_w = this.square_width;
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (typeof this.grid[i][j] !== 'undefined') {
            ctx.fillStyle = 'rgb(200,0,0)';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            var x = (this.offset.x + j) * s_w;
            var y = (this.offset.y + i) * s_w;
            ctx.fillRect(x, y, s_w, s_w);
            ctx.strokeRect(x, y, s_w, s_w);
            ctx.beginPath();
            ctx.moveTo(x + s_w / 4, y + s_w * (3 / 4));
            ctx.lineTo(x + s_w / 4, y + s_w / 4);
            ctx.lineTo(x + s_w * (3 / 4), y + s_w / 4);
            ctx.stroke();
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game() {
    _classCallCheck(this, Game);

    this.titlePlaying = true;
    this.titleEnded = false;
    this.megamanPlaying = false;
    this.playingGame = false;
    this.megamanAudio = document.getElementById("megaman-theme");
    this.titleAudio = document.getElementById("title-theme");
    this.toggleAudio = this.toggleAudio.bind(this);
    // debugger;
  }

  _createClass(Game, [{
    key: "toggleAudio",
    value: function toggleAudio() {
      // debugger;
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
  }]);

  return Game;
}();

exports.default = Game;

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map