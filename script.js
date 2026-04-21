const API_URL =
  "https://script.google.com/macros/s/AKfycbxPd0cmbxvSd9IheITj4S7J0M652fhMOWoMkUzcio8-sv1BYXSRB4mWaF4czMd4pU4C/exec";

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

function showResult(data) {
  // tampilkan halaman result
  loginPage.classList.add("hidden");
  resultPage.classList.remove("hidden");

  // isi data siswa
  nameEl.textContent = data.nama;
  nisnEl.textContent = data.nisn;
  dobEl.textContent = formatDate(data.tanggal_lahir);
  statusText.classList.remove("status-pass", "status-fail");

  if (data.kelulusan.toLowerCase() === "lulus") {
    statusText.textContent = "PASS";
    statusText.classList.add("status-pass");
  } else {
    statusText.textContent = "CONDITIONAL PASS";
    statusText.classList.add("status-fail");
  }

  photoEl.src = data.foto;
  photoEl.onerror = function () {
    photoEl.onerror = null;
    photoEl.src = "https://via.placeholder.com/150";
  };

  // 🔥 DELAY KECIL BIAR HALAMAN MUNCUL DULU
  setTimeout(() => {
    showModal(data);
  }, 300);
}

function showModal(data) {
  modal.classList.remove("hidden");

  modalName.textContent = data.nama;

  modal.classList.remove("pass", "fail");

  if (data.kelulusan.toLowerCase() === "lulus") {
    modal.classList.add("pass");

    modalTitle.textContent = "🎓 Congratulations!";
    modalMessage.textContent =
      "You have successfully graduated. We are proud of your achievement and wish you success in your future journey.";
  } else {
    modal.classList.add("fail");

    modalTitle.textContent = "Conditional Graduation";
    modalMessage.textContent =
      "You are declared to have conditionally passed. To be officially recognized as a graduate, you are required to complete all outstanding requirements set by the school. Please contact the school administration for further guidance.";
  }
}

function closeModal() {
  modal.classList.add("hidden");
}

function logout() {
  resultPage.classList.add("hidden");
  loginPage.classList.remove("hidden");

  loginForm.reset();
  errorMsg.textContent = "";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("en-GB");
}

function launchConfetti() {
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
    });

    confetti({
      particleCount: 5,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
