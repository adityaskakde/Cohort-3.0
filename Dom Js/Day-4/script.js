const main = document.querySelector("main");
const btn = document.querySelector("button");
const timer = document.querySelector("#timer");
const scoree = document.querySelector("#score");
const overlay = document.querySelector("#overlay");

const box = document.createElement("div");
box.classList.add("box");

let time = 0;
let score = 0;
let interval;
let gameRunning = false;

const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgb(${r}, ${g}, ${b})`;
};

const randomBox = () => {

  if (!main.contains(box)) {
    main.append(box);
  }

  box.style.backgroundColor = randomColor();

  const maxX = main.clientWidth - box.offsetWidth;
  const maxY = main.clientHeight - box.offsetHeight;

  box.style.left = `${Math.random() * maxX}px`;
  box.style.top = `${Math.random() * maxY}px`;
};

btn.addEventListener("click", () => {

  clearInterval(interval);

  overlay.style.display = "none";

  time = 0;
  score = 0;

  timer.textContent = time;
  scoree.textContent = score;

  gameRunning = true;

  randomBox();

  interval = setInterval(() => {

    time++;
    timer.textContent = time;

    if (time === 10) {

      clearInterval(interval);

      gameRunning = false;

      box.remove();

      overlay.style.display = "flex";

      setTimeout(() => {

        overlay.style.display = "none";

        time = 0;
        score = 0;

        timer.textContent = time;
        scoree.textContent = score;

      }, 3000);
    }

  }, 1000);

});

box.addEventListener("click", () => {

  if (!gameRunning) return;

  score++;
  scoree.textContent = score;

  randomBox();

});