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

  let startTime;
  let resetTime = 0;
  const render = (timestamp) => {
    resetTime += timestamp-startTime;
    if (resetTime > 1000) {
      resetTime = 0;
      offset.y += 1;
      console.log(timestamp-startTime);
      board.render(ctx);
      board.drawPiece(piece, ctx);
    }
    startTime = timestamp;
    requestAnimationFrame(render);
  }

  requestAnimationFrame((timestamp) => {
    startTime = timestamp;
    board.drawPiece(piece, ctx);
    render(timestamp);
  });


});
