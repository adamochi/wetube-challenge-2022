const form = document.querySelector(".form");
const loader = document.querySelector(".loading_partial");
const blueLink = document.querySelector(".blue-link");

const handleThisAction = (e) => {
  loader.style.display = "flex";
};

if (form) {
  form.addEventListener("submit", handleThisAction);
}
if (blueLink) {
  blueLink.addEventListener("click", handleThisAction);
}
