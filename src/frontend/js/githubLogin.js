const blueLink = document.querySelector(".blue-link");

const handleDisappear = (e) => {
  e.target.parentElement.remove();
};

blueLink.addEventListener("click", handleDisappear);
