const vidContainer = document.getElementById("watch-page-video-div");
const form = document.getElementById("commentForm");

const addComment = (text) => {
  const video_comments = document.querySelector(".video_comments ul");
  const newComment = document.createElement("div");
  newComment.className = "comment-mixin_div";
  const span = document.createElement("span");
  const timeNow = Date.now();
  span.innerText = new Date(timeNow).toDateString();

  const p = document.createElement("p");
  p.innerText = text;
  newComment.appendChild(span);
  newComment.appendChild(p);
  video_comments.appendChild(newComment);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const { id } = vidContainer.dataset;
  const onlySpaces = (str) => {
    return str.trim().length === 0;
  };
  if (text === "" || onlySpaces(text)) {
    return;
  }
  const response = await fetch(`/api/videos/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    addComment(text);
  }
  textarea.value = "";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
