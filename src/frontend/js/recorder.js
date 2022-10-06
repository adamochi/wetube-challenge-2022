import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const previewBtn = document.getElementById("previewRecBtn");
const recordBtn = document.getElementById("startRecBtn");
const preview = document.getElementById("preview");
const download = document.getElementById("download");
const header = document.querySelector(".page__header");

function detectMob() {
  return window.innerWidth <= 600 || window.innerHeight <= 800;
}
const detected = detectMob();
if (detected) {
  previewBtn.style.display = "none";
  recordBtn.style.display = "none";
  preview.style.display = "none";
  download.style.display = "none";
  header.innerText = "Upload a video";
}

// to use async/await on the frontend, need regenerator
let stream;
let recorder;
let videoFile;

const files = {
  input: "recording",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

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
  recordBtn.innerText = "Record Again";
  recordBtn.style.backgroundColor = "rgb(47, 156, 245)";
  previewBtn.innerText = "Back to Preview";
  recordBtn.removeEventListener("click", handleStop);
  recordBtn.addEventListener("click", handleStart);
  recorder.stop();
  download.addEventListener("click", handleDownload);
  download.style.display = "flex";
  download.style.backgroundColor = "lightgreen";
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName; // When you add the download attribute to a link, it will save it instead of going there.
  document.body.appendChild(a);
  a.click();
  download.innerText = "Download Recording";
  download.style.backgroundColor = "rgb(47, 156, 245)";
  download.style.display = "none";
};

const handleDownload = async () => {
  if (videoFile !== undefined && videoFile !== null) {
    download.removeEventListener("click", handleDownload);
    download.innerText = "Transcoding Video";
    download.style.backgroundColor = "rgb(50,50,50)";

    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    await ffmpeg.run("-i", files.input, "-r", "60", files.output);
    await ffmpeg.run(
      "-i",
      files.input,
      "-ss",
      "00:00:01",
      "-frames:v",
      "1",
      files.thumb
    );

    const mp4File = ffmpeg.FS("readFile", files.output); // console.log(mp4File); // Uint8Array - unsigned integers is an array of positive numbers, which is how files are represented.
    const thumbFile = ffmpeg.FS("readFile", files.thumb); // console.log(mp4File.buffer); // now we want to create a blob (file like object of immutable, raw data; can be read as text or binary data, or converted into a ReadableStream)

    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

    const mp4Url = URL.createObjectURL(mp4Blob);
    const jpgUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(jpgUrl, "MyThumbnail.jpg");
    // When you add the download attribute to a link, it will save it instead of going there.
    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(jpgUrl);
    URL.revokeObjectURL(videoFile);
    videoFile = null;
  } else {
    alert("Nothing to download, please record");
  }
};

previewBtn.addEventListener("click", startPreview);
recordBtn.addEventListener("click", handleStart);
download.addEventListener("click", handleDownload);
