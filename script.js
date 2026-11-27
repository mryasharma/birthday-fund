// Temporary test payment account for Yash's Birthday Fund
const UPI_ID = "bhumisharma0623@oksbi";
const UPI_NAME = "Bhumi Sharma";
const MAX_GIFT = 5000;
const SNEAKER_GOAL = 5000;
const CONFIRMED_GIFTS = 2; // Update only after verifying actual payments.

const formatINR = value => "₹" + Number(value).toLocaleString("en-IN");
const pct = Math.min(100, Number(((CONFIRMED_GIFTS / SNEAKER_GOAL) * 100).toFixed(2)));
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

  const paymentParams = new URLSearchParams();
  paymentParams.set("pa", UPI_ID);
  paymentParams.set("pn", UPI_NAME);
  paymentParams.set("am", amount.toFixed(2));
  paymentParams.set("cu", "INR");
  paymentParams.set("tn", "Birthday sneaker boost");

  // Always refresh the QR with the chosen amount as a fallback.
  const upiUri = "upi://pay?" + paymentParams.toString();
  const qr = document.getElementById("qrImage");
  qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" + encodeURIComponent(upiUri);
  document.getElementById("qrCaption").hidden = false;
  document.getElementById("qrCaption").textContent =
    "QR ready for " + formatINR(amount) + ". If the UPI button does not open your app, scan this updated QR.";
  display.textContent = "Opening UPI app for " + formatINR(amount) + " to " + UPI_NAME + "…";

  // Use a real link navigation; browsers handle UPI intent links more consistently than location assignment.
  const link = document.createElement("a");
  link.href = upiUri;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
});
