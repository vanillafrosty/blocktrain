function playAudio() {
  document.getElementById("megaman").play();
}

function pauseAudio() {
  document.getElementById("megaman").pause();
}

const toggleButton = document.getElementById("toggleAudio");

const toggleAudio = () => {
  let audioPlaying = false;
  return (e) => {
    e.preventDefault();
    const megaman = document.getElementById("megaman");
    if (!audioPlaying) {
      megaman.play();
      audioPlaying = true;
    } else {
      megaman.pause();
      audioPlaying = false;
    }
  }
};

toggleButton.addEventListener("click", toggleAudio());
