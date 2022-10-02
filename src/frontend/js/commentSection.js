const vidContainer = document.getElementById("watch-page-video-div");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
  const video_comments = document.querySelector(".video_comments");
  const newComment = document.createElement("div");
  newComment.dataset.id = id;
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
  const input = form.querySelector("#comment");
  const text = input.value;
  const videoId = vidContainer.dataset.id;
  const onlySpaces = (str) => {
    return str.trim().length === 0;
  };
  if (text === "" || onlySpaces(text)) {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
    input.value = "";
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
