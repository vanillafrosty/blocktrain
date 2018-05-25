function playAudio() {
  document.getElementById("megaman").play();
}

function pauseAudio() {
  document.getElementById("megaman").pause();
}

const toggleButton = document.getElementById("toggleAudio");

// const toggleAudio = () => {
//   let megamanPlaying = false;
//   return (e) => {
//     e.preventDefault();
//     const megaman = document.getElementById("megaman");
//     if (!megamanPlaying) {
//       megaman.play();
//       megamanPlaying = true;
//     } else {
//       megaman.pause();
//       megamanPlaying = false;
//     }
//   }
// };

const toggleAudio = () => {
  let megamanPlaying = false;
  return (e) => {
    e.preventDefault();
    megamanPlaying = toggleMegaman(megamanPlaying);
  }
};


toggleButton.addEventListener("click", toggleAudio());

const toggleMegaman = (playing) => {
  const megaman = document.getElementById("megaman");
  if (!playing) {
    megaman.play();
    return true;
  } else {
    megaman.pause();
    return false;
  }
};


// const titlePlaying = true;
//
// const toggleTitle = () => {
//
// }
