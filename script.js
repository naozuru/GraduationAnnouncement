const API_URL =
  "https://script.google.com/macros/s/AKfycbxPd0cmbxvSd9IheITj4S7J0M652fhMOWoMkUzcio8-sv1BYXSRB4mWaF4czMd4pU4C/exec";

/* =========================
   ELEMENT
========================= */
const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const resultPage = document.getElementById("resultPage");
const errorMsg = document.getElementById("errorMsg");

const nameEl = document.getElementById("name");
const nisnEl = document.getElementById("nisnResult");
const dobEl = document.getElementById("dob");
const photoEl = document.getElementById("studentPhoto");
const statusText = document.getElementById("statusText");

/* MODAL */
const modal = document.getElementById("resultModal");
const modalTitle = document.getElementById("modalTitle");
const modalName = document.getElementById("modalName");
const modalMessage = document.getElementById("modalMessage");

/* GAME */
const circle = document.getElementById("circle");
const gameText = document.getElementById("gameText");
const gameArea = document.getElementById("gameArea");

/* TIMER (WAJIB ADA DI HTML: <div id="timer"></div>) */
const timerEl = document.getElementById("timer");

let clickCount = 0;
let maxClicks = 0;
let speed = 700;
let currentData = null;

let canClick = true;
let timer = 0;
let timerInterval = null;

/* =========================
   LOGIN
========================= */
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nisn = document.getElementById("nisn").value.trim();
  const nis = document.getElementById("nis").value.trim();

  if (!nisn || !nis) {
    errorMsg.textContent = "Please fill all fields!";
    return;
  }

  errorMsg.textContent = "Checking...";

  try {
    const res = await fetch(`${API_URL}?nisn=${nisn}&nis=${nis}`);
    const data = await res.json();

    if (data.status === "error") {
      errorMsg.textContent = "Data not found!";
      return;
    }

    showResult(data);
  } catch (err) {
    errorMsg.textContent = "Connection error!";
  }
});

/* =========================
   SHOW RESULT
========================= */
function showResult(data) {
  loginPage.classList.add("hidden");
  resultPage.classList.remove("hidden");

  currentData = data;

  nameEl.textContent = data.nama;
  nisnEl.textContent = data.nisn;
  dobEl.textContent = formatDate(data.tanggal_lahir);

  const date = new Date(data.tanggal_lahir);
  maxClicks = date.getDate();
  if (!maxClicks || maxClicks < 1) maxClicks = 10;

  statusText.textContent = "???";
  statusText.classList.remove("status-pass", "status-fail");

  photoEl.src = data.foto;
  photoEl.onerror = function () {
    photoEl.onerror = null;
    photoEl.src = "https://via.placeholder.com/150";
  };

  startGame();
}

/* =========================
   START GAME
========================= */
function startGame() {
  clickCount = 0;
  speed = 700;
  canClick = true;

  circle.style.display = "block";

  resizeCircle();
  moveCircle();

  gameText.textContent = `Click ${maxClicks} times`;

  startTimer();
}

/* =========================
   TIMER SYSTEM
========================= */
function startTimer() {
  clearInterval(timerInterval);

  timer = maxClicks + 5; // waktu = jumlah klik + buffer
  updateTimer();

  timerInterval = setInterval(() => {
    timer--;
    updateTimer();

    if (timer <= 0) {
      clearInterval(timerInterval);
      failGame();
    }
  }, 1000);
}

function updateTimer() {
  if (timerEl) {
    timerEl.textContent = `⏱ ${timer}s`;
  }
}

/* =========================
   FAIL GAME (WAKTU HABIS)
========================= */
function failGame() {
  circle.style.display = "none";
  gameText.textContent = "Time's up!";

  statusText.textContent = "TRY AGAIN";
  statusText.classList.add("status-fail");
}

/* =========================
   RESIZE CIRCLE
========================= */
function resizeCircle() {
  let size = 60 - (clickCount * 2);
  if (size < 28) size = 28;

  circle.style.width = size + "px";
  circle.style.height = size + "px";
}

/* =========================
   MOVE RANDOM
========================= */
function moveCircle() {
  const maxX = gameArea.clientWidth - circle.clientWidth;
  const maxY = gameArea.clientHeight - circle.clientHeight;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  circle.style.left = x + "px";
  circle.style.top = y + "px";
}

/* =========================
   CLICK (ANTI SPAM)
========================= */
circle.addEventListener("click", () => {

  if (!canClick) return;

  canClick = false;
  clickCount++;

  if (clickCount < maxClicks) {

    speed -= 15;
    if (speed < 120) speed = 120;

    resizeCircle();
    moveCircle();

    setTimeout(() => {
      canClick = true;
    }, speed);

    gameText.textContent = `🔥 ${clickCount}/${maxClicks}`;

  } else {
    endGame();
  }
});

/* =========================
   END GAME
========================= */
function endGame() {
  clearInterval(timerInterval);

  circle.style.display = "none";
  gameText.textContent = "Unlocked!";

  if (currentData.kelulusan.toLowerCase() === "lulus") {
    statusText.textContent = "PASS";
    statusText.classList.add("status-pass");
  } else {
    statusText.textContent = "CONDITIONAL PASS";
    statusText.classList.add("status-fail");
  }

  setTimeout(() => {
    showModal(currentData);
  }, 400);
}

/* =========================
   MODAL
========================= */
function showModal(data) {
  modal.classList.remove("hidden");

  modalName.textContent = data.nama;
  modal.classList.remove("pass", "fail");

  if (data.kelulusan.toLowerCase() === "lulus") {
    modal.classList.add("pass");

    modalTitle.textContent = "🎓 Congratulations!";
    modalMessage.textContent =
      "Based on the academic evaluation and final assessment, you are declared to have successfully completed your studies. We are proud of your achievement and wish you continued success in your future endeavors.";

    setTimeout(() => {
      launchConfetti();
    }, 200);

  } else {
    modal.classList.add("fail");

    modalTitle.textContent = "Conditional Graduation";
    modalMessage.textContent =
      "You are declared to have conditionally passed. To be officially recognized as a graduate, you are required to complete all outstanding requirements set by the school. Please contact the school administration for further guidance.";
  }
}

/* =========================
   CLOSE MODAL
========================= */
function closeModal() {
  modal.classList.add("hidden");
}

/* =========================
   LOGOUT
========================= */
function logout() {
  clearInterval(timerInterval);

  resultPage.classList.add("hidden");
  loginPage.classList.remove("hidden");

  loginForm.reset();
  errorMsg.textContent = "";
}

/* =========================
   FORMAT DATE
========================= */
function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("en-GB");
}

/* =========================
   CONFETTI
========================= */
function launchConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      spread: 70,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/* =========================
   WELCOME MODAL
========================= */
const welcomeModal = document.getElementById("welcomeModal");

function closeWelcomeModal() {
  welcomeModal.classList.add("hidden");
}