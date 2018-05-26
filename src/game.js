const toggleButton = document.getElementById("toggleAudio");


const toggleAudio = () => {
  let megamanPlaying = false;
  let titlePlaying = true;
  return (e) => {
    e.preventDefault();
    if (titlePlaying || megamanPlaying) {
      megamanPlaying = toggleMegaman(megamanPlaying);

    }
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
