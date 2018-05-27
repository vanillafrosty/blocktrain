import Pieces from './pieces';

export default class Game {

  constructor(board) {
    this.board = board;
    this.offset = {
      x: 4,
      y: 0
    };
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

  boardStep() {
    this.board.render();
    this.board.drawPiece(this.currentPiece, this.offset);
  }

  addKeyListeners() {
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowRight':
          this.offset.x += 1;
          if (this.board.validPos(this.currentPiece, this.offset)) {
            this.boardStep();
          } else {
            this.offset.x -= 1;
          }
          break;
        case 'ArrowLeft':
          this.offset.x -= 1;
          if (this.board.validPos(this.currentPiece, this.offset)){
            this.boardStep();
          } else {
            this.offset.x += 1;
          }
          break;
        case 'ArrowDown':
          this.offset.y += 1;
          if (this.board.update(this.currentPiece, this.offset)) {
            this.offset.y = 0;
            this.offset.x = 4;
            this.currentPiece = this.pieces.newPiece();
          }
          this.resetTime = 0;
          this.boardStep();
          break;
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
          if (this.board.update(this.currentPiece, this.offset)){
            this.offset.y = 0;
            this.offset.x = 4;
            this.currentPiece = this.pieces.newPiece();
          }
          this.boardStep();
        }
        this.startTime = timestamp;
        requestAnimationFrame(render);
      }

      requestAnimationFrame((timestamp) => {
        this.startTime = timestamp;
        this.board.drawPiece(this.currentPiece, this.offset);
        render(timestamp);
      });
    }
  }

}
