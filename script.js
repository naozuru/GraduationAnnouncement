// GANTI INI NANTI DENGAN URL WEB APP DARI APPS SCRIPT
const API_URL =
  "https://script.google.com/macros/s/AKfycbxPd0cmbxvSd9IheITj4S7J0M652fhMOWoMkUzcio8-sv1BYXSRB4mWaF4czMd4pU4C/exec";

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

// LOGIN SUBMIT
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nisn = document.getElementById("nisn").value.trim();
  const nis = document.getElementById("nis").value.trim();

  errorMsg.textContent = "Checking...";

  try {
    const response = await fetch(`${API_URL}?nisn=${nisn}&nis=${nis}`);
    const data = await response.json();

    if (data.status === "error") {
      errorMsg.textContent = "Data not found or wrong password!";
      return;
    }

    showResult(data);
  } catch (error) {
    errorMsg.textContent = "Connection error!";
    console.error(error);
  }
});

// TAMPILKAN HASIL
function showResult(data) {
  loginPage.classList.add("hidden");
  resultPage.classList.remove("hidden");

  nameEl.textContent = data.nama;
  nisnEl.textContent = data.nisn;
  const date = new Date(data.tanggal_lahir);
  const formattedDate = date.toLocaleDateString("en-GB"); // dd/mm/yyyy
  dobEl.textContent = formattedDate;
  photoEl.src = data.foto;

  // RESET CLASS
  statusBox.classList.remove("pass", "fail");

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

// LOGOUT / BACK
function logout() {
  resultPage.classList.add("hidden");
  loginPage.classList.remove("hidden");

  loginForm.reset();
  errorMsg.textContent = "";
}
