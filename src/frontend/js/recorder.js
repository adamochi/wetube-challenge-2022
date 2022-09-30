import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const previewBtn = document.getElementById("previewRecBtn");
const recordBtn = document.getElementById("startRecBtn");
const preview = document.getElementById("preview");
const download = document.getElementById("download");

// to use async/await on the frontend, need regenerator
let stream;
let recorder;
let videoFile;
const startPreview = async () => {
  previewBtn.innerText = "See Preview";
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 1920, height: 1080 },
  });
  preview.srcObject = stream;
  preview.play();
};
const handleStart = async () => {
  await startPreview();
  recordBtn.innerText = "Stop Recording";
  recordBtn.style.backgroundColor = "red";
  recordBtn.removeEventListener("click", handleStart);
  recordBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
  });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    preview.srcObject = null;
    preview.src = videoFile;
    preview.loop = true;
    preview.play();
  };
  recorder.start();
};
const handleStop = () => {
  recordBtn.innerText = "Start Recording";
  recordBtn.style.backgroundColor = "rgb(47, 156, 245)";
  previewBtn.innerText = "Back to Preview";
  recordBtn.removeEventListener("click", handleStop);
  recordBtn.addEventListener("click", handleStart);
  recorder.stop();
};
const handleDownload = async () => {
  if (videoFile !== undefined && videoFile !== null) {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", "recording", await fetchFile(videoFile));

    await ffmpeg.run("-i", "recording", "-r", "60", "output.mp4");
    await ffmpeg.run(
      "-i",
      "recording",
      "-ss",
      "00:00:01",
      "-frames:v",
      "1",
      "thumbnail.jpg"
    );

    const mp4File = ffmpeg.FS("readFile", "output.mp4"); // console.log(mp4File); // Uint8Array - unsigned integers is an array of positive numbers, which is how files are represented.
    const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");
    // console.log(mp4File.buffer); // now we want to create a blob (file like object of immutable, raw data; can be read as text or binary data, or converted into a ReadableStream)
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

    const mp4Url = URL.createObjectURL(mp4Blob);
    const jpgUrl = URL.createObjectURL(thumbBlob);

    const a = document.createElement("a");
    a.href = mp4Url;
    a.download = "MyRecording.mp4"; // When you add the download attribute to a link, it will save it instead of going there.
    document.body.appendChild(a);
    a.click();

    const jpgA = document.createElement("a");
    jpgA.href = jpgUrl;
    jpgA.download = "MyThumbnail.jpg"; // When you add the download attribute to a link, it will save it instead of going there.
    document.body.appendChild(jpgA);
    jpgA.click();
  } else {
    alert("You haven't recorded a video to download yet");
  }
};

previewBtn.addEventListener("click", startPreview);
recordBtn.addEventListener("click", handleStart);
download.addEventListener("click", handleDownload);
