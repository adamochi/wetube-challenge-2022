const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const vidContainer = document.getElementById("watch-page-video-div");
// const submitBtn = form.querySelector("button");
import Comment from "../../models/Comment";

const handleSubmit = (e) => {
  e.preventDefault();
  const id = vidContainer.dataset;
  console.log(id);

  console.dir(textarea.value);
};

form.addEventListener("submit", handleSubmit);
