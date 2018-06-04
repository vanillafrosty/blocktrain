import Pieces from './pieces';

export default class Game {

  constructor(board) {
    this.gameOverOnce = false; //to make sure we don't add multiple event listeners
    this.animationFrame = null;
    this.board = board;
    this.offset = {
      x: 4,
      y: 0
    };
    this.totalRotations = 0;
    this.pieces = new Pieces();
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

  toggleAudio(){
    if (this.playingGame || this.gameOver) {
      if (this.megamanPlaying){
        this.megamanAudio.pause();
        this.megamanPlaying = false;
      } else {
        this.megamanAudio.play();
        this.megamanPlaying = true;
      }
    }  else if (!this.playingGame && !this.titleEnded) {
      if (this.titlePlaying){
        this.titleAudio.pause();
        this.titlePlaying = false;
      } else {
        this.titleAudio.play();
        this.titlePlaying = true;
      }
    }
  }

  //transpose a square matrix with space considerations
  transpose(matrix) {
    let temp;
    for (let i=0; i<matrix.length; i++){
      for (let j=i+1; j<matrix.length; j++){
        temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }
    return matrix;
  }

  //we are prioritizing space over time complexity here. creating a new
  //matrix should give us faster time complexity, but both ways are still O(n^2)
  rotate(matrix) {
    let temp;
    let transposed = this.transpose(matrix);
    //reverse the columns
    for (let i=0; i<matrix.length; i++) {
      for (let j=0; j<Math.floor(matrix.length/2); j++){
        temp = matrix[i][j];
        matrix[i][j] = matrix[i][matrix.length-1-j];
        matrix[i][matrix.length-1-j] = temp;
      }
    }
    return matrix;
  }

  rotateCounter(matrix) {
    let temp;
    let transposed = this.transpose(matrix);
    //reverse the rows
    for (let i=0; i<Math.floor(matrix.length/2); i++) {
      for (let j=0; j<matrix.length; j++){
        temp = matrix[i][j];
        matrix[i][j] = matrix[matrix.length-1-i][j];
        matrix[matrix.length-1-i][j] = temp;
      }
    }
    return matrix;
  }

  handleRotate(piece) {
    switch(piece.type) {
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

  handleUnrotate(piece) {
    switch(piece.type) {
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

  boardStep() {
    this.board.render();
    this.board.drawPiece(this.currentPiece.matrix, this.offset);
    this.board.drawNext(this.nextPiece.matrix);
  }

  addKeyListeners() {
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'd':
        case 'ArrowRight':
          if (!this.gameOver) {
            this.offset.x += 1;
            if (this.board.validPos(this.currentPiece.matrix, this.offset)) {
              this.boardStep();
            } else {
              this.offset.x -= 1;
            }
          }
          break;
        case 'a':
        case 'ArrowLeft':
          if (!this.gameOver) {
            this.offset.x -= 1;
            if (this.board.validPos(this.currentPiece.matrix, this.offset)){
              this.boardStep();
            } else {
              this.offset.x += 1;
            }
          }
          break;
        case 's':
        case 'ArrowDown':
          e.preventDefault();
          if (!this.gameOver){
            this.offset.y += 1;
            if (this.board.update(this.currentPiece.matrix, this.offset)) {
              this.offset.y = 0;
              this.offset.x = 4;
              this.totalRotations = 0;
              this.currentPiece = this.nextPiece;
              this.nextPiece = this.pieces.newPiece();
            }
            this.resetTime = 0;
            this.boardStep();
            this.gameOver = this.board.checkGameOver(this.currentPiece.matrix, this.offset);
            if (this.gameOver) {
              this.gameOverOnce = true;
              this.playingGame = false;
              let notGameOver = document.getElementById('not-game-over');
              notGameOver.setAttribute("id", "game-over");
              cancelAnimationFrame(this.animationFrame);
            }
          }
          break;
        case 'w':
        case 'ArrowUp':
          e.preventDefault();
          this.currentPiece = this.handleRotate(this.currentPiece);
          let response = this.board.validateRotate(this.currentPiece.matrix, this.offset);
          if (response.reRotate) {
            this.currentPiece = this.handleUnrotate(this.currentPiece);
          } else {
            this.offset = response.offset;
          }
          this.boardStep();
          break;
        case ' ':
          e.preventDefault();
          if (!this.gameOver) {
            e.preventDefault();
            this.board.handleDrop(this.currentPiece.matrix, this.offset);
            this.offset.y = 0;
            this.offset.x = 4;
            this.totalRotations = 0;
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.pieces.newPiece();
            this.boardStep();
          }
      }
    });
  }

  restart() {
    //clear old board because we are not actually clearing HTML canvas before
    //new game starts playing
    this.board.ctx.clearRect(0, 0, this.board.width, this.board.height);
    this.board.emptyBoard();
    let gameOver = document.getElementById('game-over');
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

  play() {
    if (this.playingGame || this.gameOver) {
      return true;
    } else {
      this.playingGame = true;
      this.titleAudio.pause();
      this.titlePlaying = false;
      this.megamanAudio.play();
      this.megamanPlaying = true;


      if (!this.gameOverOnce) {
        this.addKeyListeners();
        let gameStart = document.getElementById('before-game-start');
        gameStart.setAttribute("id", "game-start");
      }

      const render = (timestamp) => {
        this.resetTime += timestamp-this.startTime;
        this.foreverTime += timestamp-this.startTime;
        if (this.foreverTime > 32000) {
          this.foreverTime = 0;
          this.timeStep = this.timeStep * 0.9;
        }
        if (this.resetTime > this.timeStep) {
          this.resetTime = 0;
          this.offset.y += 1;
          if (this.board.update(this.currentPiece.matrix, this.offset)){
            this.offset.y = 0;
            this.offset.x = 4;
            this.totalRotations = 0;
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.pieces.newPiece();
          }
          this.boardStep();
          this.gameOver = this.board.checkGameOver(this.currentPiece.matrix, this.offset);
          if (this.gameOver) {
            this.gameOverOnce = true;
            this.playingGame = false;
            let notGameOver = document.getElementById('not-game-over');
            notGameOver.setAttribute("id", "game-over");
            cancelAnimationFrame(this.animationFrame);
            return true;
          }
        }
        this.startTime = timestamp;
        this.animationFrame = requestAnimationFrame(render);
      }

      this.animationFrame = requestAnimationFrame((timestamp) => {
        this.startTime = timestamp;
        this.board.drawPiece(this.currentPiece.matrix, this.offset);
        this.board.drawNext(this.nextPiece.matrix);
        render(timestamp);
      });
    }
  }

}
