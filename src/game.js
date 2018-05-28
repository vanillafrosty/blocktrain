import Pieces from './pieces';

export default class Game {

  constructor(board) {
    this.board = board;
    this.offset = {
      x: 4,
      y: -2
    };
    this.totalRotations = 0;
    this.pieces = new Pieces();
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

  toggleAudio(){
    debugger;
    if (!this.playingGame && !this.titleEnded) {
      if (this.titlePlaying){
        this.titleAudio.pause();
        this.titlePlaying = false;
      } else {
        this.titleAudio.play();
        this.titlePlaying = true;
      }
    } else if (this.playingGame) {
      if (this.megamanPlaying){
        this.megamanAudio.pause();
        this.megamanPlaying = false;
      } else {
        this.megamanAudio.play();
        this.megamanPlaying = true;
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
  }

  addKeyListeners() {
    document.addEventListener('keydown', (e) => {
      console.log(e.key);
      switch(e.key) {
        case 'ArrowRight':
          this.offset.x += 1;
          if (this.board.validPos(this.currentPiece.matrix, this.offset)) {
            this.boardStep();
          } else {
            this.offset.x -= 1;
          }
          break;
        case 'ArrowLeft':
          this.offset.x -= 1;
          if (this.board.validPos(this.currentPiece.matrix, this.offset)){
            this.boardStep();
          } else {
            this.offset.x += 1;
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.offset.y += 1;
          if (this.board.update(this.currentPiece.matrix, this.offset)) {
            // this.offset.y = 0;
            this.offset.y = -2;
            this.offset.x = 4;
            this.totalRotations = 0;
            this.currentPiece = this.pieces.newPiece();
          }
          this.resetTime = 0;
          this.boardStep();
          break;
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
          this.board.handleDrop(this.currentPiece.matrix, this.offset);
          this.offset.y = -2;
          this.offset.x = 4;
          this.totalRotations = 0;
          this.currentPiece = this.pieces.newPiece();
          this.boardStep();
      }
    });
  }



  play() {
    if (this.playingGame) {
      return true;
    } else {
      this.playingGame = true;
      this.titleAudio.pause();
      this.titlePlaying = false;
      this.megamanAudio.play();
      this.megamanPlaying = true;

      this.addKeyListeners();

      const render = (timestamp) => {
        this.resetTime += timestamp-this.startTime;
        if (this.resetTime > 1000) {
          this.resetTime = 0;
          this.offset.y += 1;
          if (this.board.update(this.currentPiece.matrix, this.offset)){
            // this.offset.y = 0;
            this.offset.y = -2;
            this.offset.x = 4;
            this.totalRotations = 0;
            this.currentPiece = this.pieces.newPiece();
          }
          this.boardStep();
        }
        this.startTime = timestamp;
        requestAnimationFrame(render);
      }

      requestAnimationFrame((timestamp) => {
        this.startTime = timestamp;
        this.board.drawPiece(this.currentPiece.matrix, this.offset);
        render(timestamp);
      });
    }
  }

}
