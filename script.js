// UPI payment setup for Yash's Birthday Fund
const UPI_ID = "8788296392@upi";
const UPI_NAME = "YASH MOHANSHYAM SHARMA";
const MAX_GIFT = 5000;
const SNEAKER_GOAL = 5000;
const CONFIRMED_GIFTS = 0; // Only update after verifying received payments.

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

amountButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedAmount = Number(button.dataset.amount);
    custom.value = "";
    amountButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    showAmount(selectedAmount);
  });
});

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

  const params = new URLSearchParams();
  params.set("pa", UPI_ID);
  params.set("pn", UPI_NAME);
  params.set("am", amount.toFixed(2));
  params.set("cu", "INR");
  params.set("tn", "Birthday sneaker boost");
  const upiUrl = "upi://pay?" + params.toString();

  // Navigate directly from the user's tap; synthetic anchor clicks can be blocked on mobile browsers.
  display.textContent = "Opening your UPI app for " + formatINR(amount) + "…";
  window.location.href = upiUrl;
});
