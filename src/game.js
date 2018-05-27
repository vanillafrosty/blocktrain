export default class Game {

  constructor(board) {
    this.board = board;
    this.titlePlaying = true;
    this.titleEnded = false;
    this.megamanPlaying = false;
    this.playingGame = false;
    this.megamanAudio = document.getElementById("megaman-theme");
    this.titleAudio = document.getElementById("title-theme");
    this.toggleAudio = this.toggleAudio.bind(this);
    this.play = this.play.bind(this);
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

  play() {
    const piece = [
      [0,0,0],
      [1,1,1],
      [0,1,0]
    ];

    let offset = {
      x: 4,
      y: 0
    };
    let startTime;
    let resetTime = 0;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        offset.x += 1;
        if (this.board.validPos(piece, offset)) {
          this.board.render();
          this.board.drawPiece(piece, offset);
        } else {
          offset.x -= 1;
        }
      } else if (e.key === 'ArrowLeft') {
        offset.x -= 1;
        if (this.board.validPos(piece, offset)){
          this.board.render();
          this.board.drawPiece(piece, offset);
        } else {
          offset.x += 1;
        }
      } else if (e.key === 'ArrowDown') {
        offset.y += 1;
        if (this.board.update(piece, offset)) {
          offset.y = 0;
        }
        resetTime = 0;
        this.board.render();
        this.board.drawPiece(piece, offset);
      }
    });
    const render = (timestamp) => {
      resetTime += timestamp-startTime;
      if (resetTime > 1000) {
        resetTime = 0;
        offset.y += 1;
        if (this.board.update(piece, offset)){
          offset.y = 0;
        }
        this.board.render();
        this.board.drawPiece(piece, offset);
      }
      startTime = timestamp;
      requestAnimationFrame(render);
    }

    requestAnimationFrame((timestamp) => {
      startTime = timestamp;
      this.board.drawPiece(piece, offset);
      render(timestamp);
    });
  }

}
