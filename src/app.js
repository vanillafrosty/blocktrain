import Game from './game';
import Board from './board';
import LRUCache from './lru/cache';

// const piecesObj = {
//   'I': [[0,1,0,0],
//         [0,1,0,0],
//         [0,1,0,0],
//         [0,1,0,0]],
//   'O': [[0,0,0,0],
//         [0,2,2,0],
//         [0,2,2,0],
//         [0,0,0,0]],
//   'T': [[0,0,0],
//         [3,3,3],
//         [0,3,0]],
//   'L': [[0,4,0],
//         [0,4,0],
//         [0,4,4]],
//   'J': [[0,5,0],
//         [0,5,0],
//         [5,5,0]],
//   'Z': [[0,0,0],
//         [6,6,0],
//         [0,6,6]],
//   'S': [[0,0,0],
//         [0,7,7],
//         [7,7,0]]
// };
// window.lru = new LRUCache(3, piecesObj);

//transpose a square matrix with space considerations
const transpose = (matrix) => {
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
const rotate = (matrix) => {
  let temp;
  let transposed = transpose(matrix);
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

window.rotate = rotate;


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



});
