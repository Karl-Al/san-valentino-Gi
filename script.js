// Typewriter
const typedEl = document.getElementById("typed");
const originalText = typedEl.textContent;
const lines = [
  "Domanda semplice, risposta pericolosa:",
  "mi ami? ❤️"
];
let lineIdx = 0, charIdx = 0;

function typeNext() {
  if (lineIdx >= lines.length) return;

  const current = lines[lineIdx];
  typedEl.textContent = lines.slice(0, lineIdx).join("\n") + (lineIdx ? "\n" : "") + current.slice(0, charIdx);

  charIdx++;
  if (charIdx <= current.length) {
    setTimeout(typeNext, 35);
  } else {
    // Fine riga, passa alla prossima
    lineIdx++;
    charIdx = 0;
    setTimeout(typeNext, 500);
  }
}

// Cuoricini
const heartsLayer = document.getElementById("hearts");
function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = Math.random() > 0.15 ? "❤️" : "💗";
  h.style.left = Math.random() * 100 + "vw";
  const duration = 4 + Math.random() * 4; // 4-8s
  h.style.animationDuration = duration + "s";
  h.style.fontSize = (14 + Math.random() * 16) + "px";
  heartsLayer.appendChild(h);
  setTimeout(() => h.remove(), duration * 1000);
}
setInterval(spawnHeart, 450);

// Bottoni
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const finalBox = document.getElementById("final");
const buttonsBox = document.getElementById("buttons");

function moveNoButton() {
  const padding = 12;

  // Limiti dentro la "buttons" box (così non vola in giro per tutto lo schermo)
  const parentRect = buttonsBox.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = parentRect.width - btnRect.width - padding;
  const maxY = parentRect.height - btnRect.height - padding;

  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.right = "auto"; // disattiva il "right" iniziale
}

noBtn.addEventListener("mouseover", moveNoButton);
// Supporto mobile: quando prova a toccarlo, scappa
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("click", () => {
  typedEl.textContent = "Bel tentativo. Ma no.";
  moveNoButton();
});

yesBtn.addEventListener("click", () => {
  typedEl.textContent = originalText
  buttonsBox.classList.add("hidden");
  finalBox.classList.remove("hidden");

  // Festa finale: più cuori per 2 secondi
  const burst = setInterval(spawnHeart, 500);
  setTimeout(() => clearInterval(burst), 3000);
});

// Start
typeNext();
