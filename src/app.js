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

});
