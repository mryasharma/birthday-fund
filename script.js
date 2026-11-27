// Configure these after receiving Yash's real payment details.
const FUND_GOAL = 5000;
const VERIFIED_RAISED = 0; // Change only after confirming real payments.
const UPI_ID = "";          // Example format: name@bank
const UPI_NAME = "Yash Sharma";

const formatINR = value => "₹" + Number(value).toLocaleString("en-IN");
const progress = Math.min(100, Math.round((VERIFIED_RAISED / FUND_GOAL) * 100));
document.getElementById("raised").textContent = formatINR(VERIFIED_RAISED);
document.getElementById("progressFill").style.width = progress + "%";
document.getElementById("percentage").textContent = progress + "% funded";
document.getElementById("remaining").textContent =
  formatINR(Math.max(0, FUND_GOAL - VERIFIED_RAISED)) + " to go";

let selectedAmount = 0;
const custom = document.getElementById("customAmount");
document.querySelectorAll(".amount").forEach(button => {
  button.addEventListener("click", () => {
    selectedAmount = Number(button.dataset.amount);
    custom.value = "";
    document.querySelectorAll(".amount").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
  });
});
custom.addEventListener("input", () => {
  selectedAmount = 0;
  document.querySelectorAll(".amount").forEach(b => b.classList.remove("active"));
});

document.getElementById("payButton").addEventListener("click", () => {
  const amount = custom.value.trim() ? Number(custom.value) : selectedAmount;
  if (!Number.isFinite(amount) || amount < 1 || amount > FUND_GOAL) {
    alert("Please choose a contribution between ₹1 and ₹5,000.");
    return;
  }
  if (!UPI_ID) {
    alert("UPI payment is not configured yet. Please use the QR code once Yash adds it.");
    return;
  }
  const params = new URLSearchParams({
    pa: UPI_ID, pn: UPI_NAME, am: amount.toFixed(2),
    cu: "INR", tn: "Yash Birthday Gift Fund"
  });
  window.location.href = "upi://pay?" + params.toString();
});