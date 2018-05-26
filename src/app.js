import Game from './game';


document.addEventListener('DOMContentLoaded', () => {
  console.log('hey');
  let game = new Game();
  // debugger;
  document.addEventListener("keypress", (event) => {
    if (event.key === 'm'){
      game.toggleAudio();
    }
  });
  // const toggleButton = document.getElementById("toggleAudio");
  // toggleButton.addEventListener("click", game.toggleAudio);
  const titleAudio = document.getElementById("title-theme");
  titleAudio.addEventListener("ended", () => {
    game.titleEnded = true;
  });
  const canvas = document.getElementById("canvas");
  canvas.width = 300;
  canvas.height = 720;
  var ctx = canvas.getContext('2d');
  // ctx.fillStyle = 'rgb(200,0,0)';
  // ctx.fillRect(0, 0, 700, 700);

  ctx.beginPath();
  ctx.strokeStyle = 'blue';
  ctx.arc(100, 100, 50, 0, 360);
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgb(200,0,0)';
  ctx.fill();
  ctx.stroke();

});
