import Game from './game';
import Board from './board';

document.addEventListener('DOMContentLoaded', () => {
  console.log('hey');
  let game = new Game();
  // debugger;
  document.addEventListener("keypress", (event) => {
    if (event.key === 'm'){
      game.toggleAudio();
    }
  });
  const titleAudio = document.getElementById("title-theme");
  titleAudio.addEventListener("ended", () => {
    game.titleEnded = true;
  });
  const canvas = document.getElementById("canvas");
  canvas.width = 300;
  canvas.height = 720;
  const square_width = canvas.width/10;
  var ctx = canvas.getContext('2d');

  let board = new Board(canvas.width, canvas.height);

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
      if (board.validPos(piece, offset)) {
        board.render(ctx);
        board.drawPiece(piece, offset, ctx);
      } else {
        offset.x -= 1;
      }
    } else if (e.key === 'ArrowLeft') {
      offset.x -= 1;
      if (board.validPos(piece, offset)){
        board.render(ctx);
        board.drawPiece(piece, offset, ctx);
      } else {
        offset.x += 1;
      }
    } else if (e.key === 'ArrowDown') {
      offset.y += 1;
      if (board.update(piece, offset)) {
        offset.y = 0;
      }
      resetTime = 0;
      board.render(ctx);
      board.drawPiece(piece, offset, ctx);
    }
  });

  const render = (timestamp) => {
    resetTime += timestamp-startTime;
    if (resetTime > 1000) {
      resetTime = 0;
      offset.y += 1;
      if (board.update(piece, offset)){
        offset.y = 0;
      }
      board.render(ctx);
      board.drawPiece(piece, offset, ctx);
    }
    startTime = timestamp;
    requestAnimationFrame(render);
  }

  requestAnimationFrame((timestamp) => {
    startTime = timestamp;
    board.drawPiece(piece, offset, ctx);
    render(timestamp);
  });


});
