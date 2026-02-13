// Typewriter
const typedEl = document.getElementById("typed");
const originalText = typedEl.textContent;
const titleEl = document.getElementById("title");
const giftEl = document.getElementById("gift");
const giftHintEl = document.getElementById("giftHint");
const couponEl = document.getElementById("coupon");
const catModal = document.getElementById("catModal");
const catModalClose = document.getElementById("catModalClose");
const catModalBackdrop = document.getElementById("catModalBackdrop");
let giftClicks = 0;
const GIFT_TARGET = 6;
const lines = [
  "Solo una domanda:",
  "Mi ami? ❤️"
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

function openCatModal() {
  if (!catModal) return;
  catModal.classList.remove("hidden");
}
function closeCatModal() {
  if (!catModal) return;
  catModal.classList.add("hidden");
}
window.addEventListener("DOMContentLoaded", closeCatModal);
catModalClose?.addEventListener("click", closeCatModal);
catModalBackdrop?.addEventListener("click", closeCatModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCatModal();
});

// --- PARTICELLE (cuori + gatti calico) ---
const heartsLayer = document.getElementById("hearts");

// pool di emoji: più cuori rossi, qualche arancione, qualche calico
const PARTICLES = [
  { t: "❤️", w: 0.50 },
  { t: "💗", w: 0.20 },
  { t: "🧡", w: 0.15 },   
  { t: "🐱", w: 0.10 },   
  { t: "🐈", w: 0.05 },
];

function pickWeighted(list) {
  const r = Math.random();
  let acc = 0;
  for (const item of list) {
    acc += item.w;
    if (r <= acc) return item.t;
  }
  return list[list.length - 1].t;
}

function spawnParticle({ xVw = Math.random() * 100, y = null, kind = "float" } = {}) {
  const el = document.createElement("div");
  el.className = `particle ${kind}`;
  el.textContent = pickWeighted(PARTICLES);

  // posizione
  if (y === null) {
    el.style.left = xVw + "vw";
    el.style.bottom = "-30px";
  } else {
    el.style.left = xVw + "vw";
    el.style.top = y + "px";
  }

  // variabili random
  const size = 14 + Math.random() * 18;
  el.style.fontSize = size + "px";

  // durata float
  const duration = 4 + Math.random() * 4; // 4-8s
  el.style.animationDuration = duration + "s";

  // per burst: direzione e spinta
  el.style.setProperty("--dx", ((Math.random() * 2 - 1) * 360).toFixed(0) + "px");
  el.style.setProperty("--dy", (-(180 + Math.random() * 420)).toFixed(0) + "px");
  el.style.setProperty("--rot", ((Math.random() * 2 - 1) * 180).toFixed(0) + "deg");

  heartsLayer.appendChild(el);

  // rimozione
  const ttl = kind === "burst" ? 1200 : duration * 1000;
  setTimeout(() => el.remove(), ttl);
}

// float continuo (più frequente)
const floatInterval = setInterval(() => spawnParticle(), 260);

// --- BOOM quando fa "Sì" ---
function boomAtElement(domEl) {
  const r = domEl.getBoundingClientRect();
  const centerX = ((r.left + r.width / 2) / window.innerWidth) * 100; // vw
  const centerY = (r.top + r.height / 2); // px

  // mini flash
  document.body.classList.add("flash");
  setTimeout(() => document.body.classList.remove("flash"), 180);

  // “esplosione” di particelle
  const count = 80;
  for (let i = 0; i < count; i++) {
    spawnParticle({ xVw: centerX + (Math.random() * 6 - 3), y: centerY, kind: "burst" });
  }
}


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
function handleGiftClick() {
  if (!giftEl || !giftHintEl || !couponEl) return;

  giftClicks++;
  giftEl.classList.add("shake");
  setTimeout(() => giftEl.classList.remove("shake"), 200);

  const remaining = GIFT_TARGET - giftClicks;

  if (remaining > 0) {
    giftHintEl.textContent = `Quasi… ancora ${remaining} tocchi.`;
  } else {
    giftEl.textContent = "🎉";
    giftHintEl.textContent = "Aperto!";
    couponEl.classList.remove("hidden");
  }
}

if (giftEl) {
  giftEl.addEventListener("click", handleGiftClick);
  giftEl.addEventListener("touchstart", (e) => { e.preventDefault(); handleGiftClick(); }, { passive: false });
}

noBtn.addEventListener("mouseover", moveNoButton);
// Supporto mobile: quando prova a toccarlo, scappa
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("click", () => {
  typedEl.textContent = "Non ti forzo, puoi chiudere la pagina se vuoi .-.";
  openCatModal();
  moveNoButton();
});

yesBtn.addEventListener("click", () => {
  typedEl.textContent = "🫂";
  buttonsBox.classList.add("hidden");
  finalBox.classList.remove("hidden");

  titleEl.classList.add("hidden");
  buttonsBox.classList.add("hidden");
  finalBox.classList.remove("hidden");

  giftClicks = 0;
  if (giftEl) giftEl.textContent = "🎁";
  if (giftHintEl) giftHintEl.textContent = "Tocca il regalo per ogni mese passato insieme 💏.";
  if (couponEl) couponEl.classList.add("hidden");

  // BOOM + festa finale per 2.5 sec
  boomAtElement(yesBtn);

  const party = setInterval(() => spawnParticle(), 140);
  setTimeout(() => clearInterval(party), 2500);

});

// Start
typeNext();
