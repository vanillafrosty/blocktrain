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
  const square_width = canvas.width/10;
  var ctx = canvas.getContext('2d');

  const piece = [
    [0,0,0],
    [1,1,1],
    [0,1,0]
  ];

  const offset = {
    x: 4,
    y: 0
  };
  const draw = (piece, offset, ctx) => {
    for (let i=0; i<piece.length; i++) {
      for (let j=0; j<piece[0].length; j++) {
        if (piece[i][j] !== 0) {
          ctx.fillStyle = 'rgb(200,0,0)';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          let x = (offset.x+j)*square_width;
          let y = (offset.y+i)*square_width;
          ctx.fillRect(x, y, square_width, square_width);
          ctx.strokeRect(x, y, square_width, square_width);
          ctx.beginPath();
          ctx.moveTo(x+square_width/4, y+square_width*(3/4));
          ctx.lineTo(x+square_width/4, y+square_width/4);
          ctx.lineTo(x+square_width*(3/4), y+square_width/4);
          ctx.stroke();
        }
      }
    }
  }

  const clearBoard = (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  let startTime;
  let resetTime = 0;
  const render = (timestamp) => {
    resetTime += timestamp-startTime;
    if (resetTime > 1000) {
      resetTime = 0;
      offset.y += 1;
      console.log(timestamp-startTime);
      clearBoard(ctx);
      draw(piece, offset, ctx);
    }
    startTime = timestamp;
    requestAnimationFrame(render);
  }

  requestAnimationFrame((timestamp) => {
    startTime = timestamp;
    draw(piece, offset, ctx);
    render(timestamp);
  });


});
