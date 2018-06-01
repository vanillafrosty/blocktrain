import Game from './game';
import Board from './board';
import LRUCache from './lru/cache';


document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById("canvas");
  canvas.width = 300;
  canvas.height = 630;
  const nextPieceCanvas = document.getElementById("next-piece-canvas");
  nextPieceCanvas.width = 120;
  nextPieceCanvas.height = 150;

  const square_width = canvas.width/10;
  let ctx = canvas.getContext('2d');
  let nextPieceCtx = nextPieceCanvas.getContext('2d');


  let board = new Board(canvas.width, canvas.height, ctx, nextPieceCtx);
  let game = new Game(board);

  document.addEventListener("keypress", (event) => {
    if (event.key === 'm'){
      game.toggleAudio();
    } else if (event.key === 'r') {
      if (game.gameOver) {
        game.restart();
      }
    }
  });
  const titleAudio = document.getElementById("title-theme");
  titleAudio.addEventListener("ended", () => {
    game.titleEnded = true;
  });

  const tracks = [
    "./music/metal-man.mp3",
    "./music/crash-man.mp3",
    "./music/dr-wily.mp3"
  ];
  let tracksIndex = 0;
  const megamanAudio = document.getElementById("megaman-theme");
  megamanAudio.addEventListener("ended", () => {
    tracksIndex = (tracksIndex+1) % tracks.length;
    megamanAudio.src = tracks[tracksIndex];
    megamanAudio.play();
  });

  document.addEventListener("keypress", (event) => {
    if (event.key === 'p'){
      game.play();
    }
  });



});
