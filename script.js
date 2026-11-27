// UPI payment setup for Yash's Birthday Fund
const UPI_ID = "yash14867@okaxis";
const UPI_NAME = "Yash Sharma";
const MAX_GIFT = 5000;
const SNEAKER_GOAL = 5000;
const CONFIRMED_GIFTS = 0; // Update only after checking actual payments.

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
const amountButtons = document.querySelectorAll(".amount");

amountButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedAmount = Number(button.dataset.amount);
    custom.value = "";
    amountButtons.forEach(item => item.classList.toggle("active", item === button));
  });
});

custom.addEventListener("input", () => {
  selectedAmount = 0;
  amountButtons.forEach(button => button.classList.remove("active"));
});

document.getElementById("payButton").addEventListener("click", () => {
  const amount = custom.value.trim() ? Number(custom.value) : selectedAmount;
  if (!Number.isFinite(amount) || amount < 1 || amount > MAX_GIFT) {
    alert("Choose an amount between ₹1 and ₹5,000.");
    return;
  }
  const params = new URLSearchParams({
    pa: UPI_ID, pn: UPI_NAME, am: amount.toFixed(2),
    cu: "INR", tn: "Birthday sneaker boost"
  });
  window.location.href = "upi://pay?" + params.toString();
});
