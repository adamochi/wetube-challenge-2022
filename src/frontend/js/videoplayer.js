// HTMLMediaElement

const video = document.querySelector("video");
const play = document.getElementById("play");
const mute = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreen");
const watchPageDIv = document.getElementById("watch-page-video-div");
const controllls = document.getElementById("controllls");
const picInPic = document.getElementById("small-player");
const input = document.getElementById("comment");

const checkstorage = localStorage.getItem("wetubeVolume");
if (checkstorage === null || checkstorage === undefined) {
  localStorage.setItem("wetubeVolume", 0.85);
}
let volumeValue = JSON.parse(localStorage.getItem("wetubeVolume"));
video.volume = volumeValue;
volume.value = volumeValue;

let controlsTimeout = null;
let controlsMovementTimeout = null;

const handlePlayBtn = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  play.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  mute.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volume.value = video.muted ? 0 : volumeValue;
};
const myVolumeChanger = (event) => {
  const {
    target: { value },
  } = event;
  video.volume = value;
  volumeValue = value;
  value !== "0" && (video.muted = false);
  mute.classList = value === "0" ? "fas fa-volume-mute" : "fas fa-volume-up";
};
const localSaveVolume = (e) => {
  const { value } = e.target;
  localStorage.setItem("wetubeVolume", value);
};

const vidTime = (e) => {
  timeline.max = video.duration;
  timeline.step = video.duration / 1000;
  const { currentTime, duration } = e.target;
  const displayDuration = Math.floor(duration);
  const minsDuration = Math.floor(displayDuration / 60)
    .toString()
    .padStart(2, "0");
  const secsDuration = Math.floor(displayDuration % 60)
    .toString()
    .padStart(2, "0");
  const crntTime = Math.floor(currentTime);
  const secs = Math.floor(crntTime % 60)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor(crntTime / 60)
    .toString()
    .padStart(2, "0");
  timeline.value = currentTime;
  time.innerText = `${mins}:${secs} / ${minsDuration}:${secsDuration}`;

  for (let e of document.querySelectorAll(
    'input[type="range"].slider-progress'
  )) {
    e.style.setProperty("--value", e.value);
    e.style.setProperty("--min", e.min === "" ? "0" : e.min);
    e.style.setProperty("--max", e.max === "" ? duration : e.max);
    e.addEventListener("input", () => e.style.setProperty("--value", e.value));
  }
};

const seekVideo = (e) => {
  video.currentTime = e.target.value;
};

const mediaKeyParty = (e) => {
  const theKeyPressed = e.key;
  if (theKeyPressed === "f") {
    if (!document.webkitIsFullScreen) {
      video.style.height = "100vh";
      video.style.maxHeight = "100%";
      watchPageDIv.requestFullscreen();
      fullscreenBtn.classList = "fas fa-compress";
    } else if (document.webkitIsFullScreen) {
      video.style.height = "fit-content";
      video.style.maxHeight = "600px";
      fullscreenBtn.classList = "fas fa-expand";
      document.exitFullscreen();
    }
  }
  if (theKeyPressed === " ") {
    e.preventDefault();
    handlePlayBtn();
  }
};
const handleFullscreenBtn = () => {
  if (!document.webkitIsFullScreen) {
    video.style.height = "100vh";
    video.style.maxHeight = "100%";
    fullscreenBtn.classList = "fas fa-compress";
    watchPageDIv.requestFullscreen();
  } else if (document.webkitIsFullScreen) {
    video.style.height = "fit-content";
    video.style.maxHeight = "600px";
    fullscreenBtn.classList = "fas fa-expand";
    document.exitFullscreen();
  }
};
const hideControls = () => (controllls.style.opacity = "0");
const handlemouseMove = () => {
  controllls.style.opacity = "1";
  controllls.style.transition = "0. 1s";
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  controllls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 1500);
};
const handlemouseLeave = () => {
  controllls.style.opacity = "0";
  controllls.style.transition = "0.1s";
  controlsTimeout = setTimeout(() => {
    controllls.classList.remove("showing");
  }, 1500);
  controlsTimeout = setTimeout(hideControls, 1500);
};

const handlePictureInPicture = (e) => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else if (document.pictureInPictureEnabled) {
    video.style.maxHeight = "600px";
    video.style.height = "fit-content";
    video.requestPictureInPicture();
  }
};
const handleVideoEnded = () => {
  // console.log(watchPageDIv.dataset.id);
  const { id } = watchPageDIv.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" }); // fetch default is a GET request
};
if (video) {
  setTimeout(() => {
    video.play();
  }, 1000);
}

const pInPEnter = () => {
  picInPic.classList = "fas fa-arrow-up-right-from-square";
};
const pInPLeave = () => {
  picInPic.classList = "fas fa-copy";
};

picInPic.addEventListener("click", handlePictureInPicture);
window.addEventListener("enterpictureinpicture", pInPEnter);
window.addEventListener("leavepictureinpicture", pInPLeave);

play.addEventListener("click", handlePlayBtn);
mute.addEventListener("click", handleMute);
volume.addEventListener("input", myVolumeChanger);
volume.addEventListener("change", localSaveVolume);

video.addEventListener("loadedmetadata", vidTime);
video.addEventListener("timeupdate", vidTime);
window.addEventListener("keydown", mediaKeyParty);
timeline.addEventListener("input", seekVideo);

fullscreenBtn.addEventListener("click", handleFullscreenBtn);
video.addEventListener("dblclick", handleFullscreenBtn);
video.addEventListener("click", handlePlayBtn);
watchPageDIv.addEventListener("mousemove", handlemouseMove);
video.addEventListener("mouseleave", handlemouseLeave);
video.addEventListener("ended", handleVideoEnded);

const handleKeyStrokeListeners = (e) => {
  console.dir(e.target);
  window.removeEventListener("keydown", mediaKeyParty);
};
const handleKeyStrokeAddListener = () => {
  window.addEventListener("keydown", mediaKeyParty);
};
if (input) {
  input.addEventListener("focus", handleKeyStrokeListeners);
  input.addEventListener("blur", handleKeyStrokeAddListener);
}

/*
  can make anything fullscreen, any div etc.
  So I will make the video container including the
  controls fullscreen
*/
/*
To make only one video at a time play if multiple
1) target video element
2) add event listner to every player .
3) when user click to a specific video button wite
   javascript code to pause all video
   then play that specific video
   -- you can optimize the above method by storing previous
   played video element's id to a variable
   and when user click to a specific video button pause
   only that elment which is stored in previous variable

For a gallery, maybe🤔
individually play each video on mouseenter, stop on mouseleave
*/
