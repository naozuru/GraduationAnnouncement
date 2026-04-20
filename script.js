
/* =========================
   CONFIG (GANTI URL API)
========================= */
const API_URL = "https://script.google.com/macros/s/AKfycbxPd0cmbxvSd9IheITj4S7J0M652fhMOWoMkUzcio8-sv1BYXSRB4mWaF4czMd4pU4C/exec";


/* =========================
   ELEMENT
========================= */
const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const resultPage = document.getElementById("resultPage");
const errorMsg = document.getElementById("errorMsg");

// RESULT ELEMENTS
const nameEl = document.getElementById("name");
const nisnEl = document.getElementById("nisnResult");
const dobEl = document.getElementById("dob");
const photoEl = document.getElementById("studentPhoto");

const statusBox = document.getElementById("statusBox");
const statusTitle = document.getElementById("statusTitle");
const statusMessage = document.getElementById("statusMessage");


/* =========================
   LOGIN SUBMIT
========================= */
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nisn = document.getElementById("nisn").value.trim();
  const nis = document.getElementById("nis").value.trim();

  // VALIDASI
  if (!nisn || !nis) {
    errorMsg.textContent = "Please fill in all fields!";
    return;
  }

  errorMsg.style.color = "#333";
  errorMsg.textContent = "Checking data...";

  try {
    const response = await fetch(`${API_URL}?nisn=${nisn}&nis=${nis}`);
    const data = await response.json();

    // ERROR DARI API
    if (data.status === "error") {
      errorMsg.style.color = "#dc2626";
      errorMsg.textContent = "Data not found or wrong password!";
      return;
    }

    // SUCCESS
    showResult(data);

  } catch (error) {
    errorMsg.style.color = "#dc2626";
    errorMsg.textContent = "Connection error. Please try again!";
    console.error(error);
  }
});


/* =========================
   FORMAT DATE (DD/MM/YYYY)
========================= */
function formatDate(dateString) {
  const date = new Date(dateString);

  // kalau invalid (kadang dari spreadsheet string aneh)
  if (isNaN(date)) return dateString;

  return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
}


/* =========================
   TAMPILKAN RESULT
========================= */
function showResult(data) {
  // pindah halaman
  loginPage.classList.add("hidden");
  resultPage.classList.remove("hidden");

  // isi data
  nameEl.textContent = data.nama;
  nisnEl.textContent = data.nisn;
  dobEl.textContent = formatDate(data.tanggal_lahir);

  // foto (dengan fallback kalau error)
  photoEl.src = data.foto;
  photoEl.onerror = function () {
  photoEl.onerror = null; // 🔥 penting: stop looping
  photoEl.src = "https://via.placeholder.com/150?text=No+Photo";
};

  // reset status class
  statusBox.classList.remove("pass", "fail");

  // status kelulusan
  if (data.kelulusan.toLowerCase() === "lulus") {
    statusBox.classList.add("pass");

    statusTitle.textContent = "🎓 Congratulations!";
    statusMessage.textContent =
      "Based on the academic evaluation and final assessment, you are declared to have successfully completed your studies. We are proud of your achievement and wish you continued success in your future endeavors.";

  } else {
    statusBox.classList.add("fail");

    statusTitle.textContent = "Result Notification";
    statusMessage.textContent =
      "Based on the academic evaluation, you have not met the required criteria for graduation at this time. Please stay motivated and continue striving for improvement. Your journey does not end here.";
  }
}


/* =========================
   LOGOUT / BACK
========================= */
function logout() {
  resultPage.classList.add("hidden");
  loginPage.classList.remove("hidden");

  loginForm.reset();
  errorMsg.textContent = "";
}


/* =========================
   OPTIONAL: ENTER KEY FIX
========================= */
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !resultPage.classList.contains("hidden")) {
    // jika di halaman result, enter tidak submit ulang
    e.preventDefault();
  }
});