// main.js

const startBtn = document.getElementById("startBtn");
const display = document.getElementById("display");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");

let currentItems = [];
let currentMode = "words";
let itemCount = 3;

const words = ["apple", "river", "cloud", "forest", "dream", "light", "stone", "echo", "magic", "peace", "grace"];
const digits = ["12", "34", "56", "78", "90", "23", "45", "67", "89", "01", "11"];

function levenshtein(a, b) {
  const matrix = [];
  let i, j;

  if (!a.length) return b.length;
  if (!b.length) return a.length;

  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function showItems() {
  const source = currentMode === "numbers" ? digits : words;
  currentItems = getRandomItems(source, itemCount);
  display.textContent = currentItems.join("   ");
  userInput.value = "";
  userInput.disabled = true;
  submitBtn.disabled = true;
  feedback.textContent = "";

  setTimeout(() => {
    display.textContent = "";
    setTimeout(() => {
      userInput.disabled = false;
      submitBtn.disabled = false;
      userInput.focus();
    }, 5000);
  }, 3000);
}

function checkInput() {
  const input = userInput.value.trim().toLowerCase().split(/\s+/);
  let correct = 0;
  input.forEach((item, index) => {
    const target = currentItems[index];
    if (!target) return;
    const distance = levenshtein(item, target);
    if (distance <= 1) correct++;
  });
  feedback.textContent = `You got ${correct} out of ${currentItems.length} correct.`;
  if (correct === itemCount) {
    itemCount = Math.min(itemCount + 1, 7);
  } else {
    itemCount = Math.max(itemCount - 1, 2);
  }
}

submitBtn.addEventListener("click", () => {
  checkInput();
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !userInput.disabled) {
    e.preventDefault();
    checkInput();
  }
});

document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    currentMode = e.target.dataset.mode;
    showItems();
  });
});
