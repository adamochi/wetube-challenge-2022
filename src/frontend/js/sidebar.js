const burger = document.getElementById("burger");
const menu = document.getElementById("sidebar");
const bars = document.querySelector(".fa-bars");

let open = false;

const closeMenu = (e) => {
  if (e.target !== burger && e.target !== bars) {
    if (open) {
      open = false;
      menu.style.opacity = 0;
      menu.style.left = "-500px";
      return;
    } else return;
  }
};

const handleMenu = (e) => {
  if (!open) {
    open = true;
    menu.style.opacity = 1;
    menu.style.left = 0;
    menu.style.height = "fit-content";
    menu.style.transition = "0.3s";
    window.addEventListener("click", closeMenu);
    return;
  }
  if (open) {
    open = false;
    menu.style.opacity = 0;
    menu.style.left = "-500px";
    window.removeEventListener("click", closeMenu);
    return;
  }
};

burger.addEventListener("click", handleMenu);
