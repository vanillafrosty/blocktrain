import Game from './game';
import Board from './board';

document.addEventListener('DOMContentLoaded', () => {
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

  // game.play();


});
