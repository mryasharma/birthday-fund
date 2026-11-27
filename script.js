// Temporary test payment account for Yash's Birthday Fund
const UPI_ID = "bhumisharma0623@oksbi";
const UPI_NAME = "Bhumi Sharma";
const MAX_GIFT = 5000;
const SNEAKER_GOAL = 5000;
const CONFIRMED_GIFTS = 2; // Update only after verifying actual payments.

const formatINR = value => "₹" + Number(value).toLocaleString("en-IN");
const pct = Math.min(100, Math.round((CONFIRMED_GIFTS / SNEAKER_GOAL) * 100));
document.getElementById("raisedAmount").textContent = formatINR(CONFIRMED_GIFTS);
document.getElementById("goalAmount").textContent = formatINR(SNEAKER_GOAL);
document.getElementById("fundProgress").style.width = pct + "%";
document.getElementById("progressPercent").textContent = pct + "% COMPLETE";
document.getElementById("leftAmount").textContent = formatINR(Math.max(0, SNEAKER_GOAL - CONFIRMED_GIFTS)) + " TO GO";
document.querySelector(".progress-track").setAttribute("aria-valuenow", CONFIRMED_GIFTS);

let selectedAmount = 0;
const custom = document.getElementById("customAmount");
const display = document.getElementById("selectedAmountDisplay");
const amountButtons = document.querySelectorAll(".amount");

function showAmount(amount) {
  display.textContent = amount ? "Selected amount: " + formatINR(amount) : "Select an amount to continue.";
}

amountButtons.forEach(button => button.addEventListener("click", () => {
  selectedAmount = Number(button.dataset.amount);
  custom.value = "";
  amountButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  showAmount(selectedAmount);
}));

custom.addEventListener("input", () => {
  selectedAmount = 0;
  amountButtons.forEach(button => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });
  const amount = Number(custom.value);
  showAmount(custom.value && Number.isFinite(amount) && amount > 0 ? amount : 0);
});

document.getElementById("payButton").addEventListener("click", () => {
  const amount = custom.value.trim() ? Number(custom.value) : selectedAmount;
  if (!Number.isFinite(amount) || amount < 1 || amount > MAX_GIFT) {
    display.textContent = "Please select or enter an amount from ₹1 to ₹5,000.";
    return;
  }
  const params = new URLSearchParams({
    pa: UPI_ID, pn: UPI_NAME, am: amount.toFixed(2),
    cu: "INR", tn: "Birthday sneaker boost"
  });
  display.textContent = "Opening UPI for " + formatINR(amount) + " to " + UPI_NAME + "…";
  window.location.href = "upi://pay?" + params.toString();
});
