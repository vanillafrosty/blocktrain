import Game from './game';
import Board from './board';

document.addEventListener('DOMContentLoaded', () => {
  console.log('hey');
  const canvas = document.getElementById("canvas");
  canvas.width = 300;
  canvas.height = 720;
  const square_width = canvas.width/10;
  var ctx = canvas.getContext('2d');

  let board = new Board(canvas.width, canvas.height, ctx);
  let game = new Game(board);
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

  game.play();


});
