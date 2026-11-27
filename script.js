// UPI payment setup for Yash's Birthday Fund
const RECEIVERS = {
  yash: { id: "8788296392@upi", name: "Yash Sharma" },
  bhumi: { id: "bhumisharma0623@oksbi", name: "Bhumi Sharma" }
};
let currentReceiver = "yash";
const MAX_GIFT = 5000;
const SNEAKER_GOAL = 5000;
const CONFIRMED_GIFTS = 0; // Update only after verifying actual payments.

const formatINR = value => "₹" + Number(value).toLocaleString("en-IN");
const pct = Math.min(100, Math.round((CONFIRMED_GIFTS / SNEAKER_GOAL) * 100));
document.getElementById("raisedAmount").textContent = formatINR(CONFIRMED_GIFTS);
document.getElementById("goalAmount").textContent = formatINR(SNEAKER_GOAL);
document.getElementById("fundProgress").style.width = pct + "%";
document.getElementById("progressPercent").textContent = pct + "% COMPLETE";
document.getElementById("leftAmount").textContent = formatINR(Math.max(0, SNEAKER_GOAL - CONFIRMED_GIFTS)) + " TO GO";
document.querySelector(".progress-track").setAttribute("aria-valuenow", CONFIRMED_GIFTS);

const qrImage = document.getElementById("qrImage");
const upiIdLine = document.getElementById("upiIdLine");
const receiverName = document.getElementById("receiverName");
function setReceiver(key) {
  currentReceiver = key;
  const receiver = RECEIVERS[key];
  const params = new URLSearchParams({ pa: receiver.id, pn: receiver.name, cu: "INR" });
  qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" + encodeURIComponent("upi://pay?" + params.toString());
  qrImage.alt = receiver.name + " UPI QR code";
  upiIdLine.innerHTML = "UPI ID: <strong>" + receiver.id + "</strong>";
  receiverName.textContent = "Paying " + receiver.name;
  document.querySelectorAll(".receiver-option").forEach(button => {
    const active = button.dataset.receiver === key;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
document.querySelectorAll(".receiver-option").forEach(button => button.addEventListener("click", () => setReceiver(button.dataset.receiver)));

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
  const receiver = RECEIVERS[currentReceiver];
  const params = new URLSearchParams({
    pa: receiver.id, pn: receiver.name, am: amount.toFixed(2),
    cu: "INR", tn: "Birthday sneaker boost"
  });
  display.textContent = "Opening UPI for " + formatINR(amount) + " to " + receiver.name + "…";
  window.location.href = "upi://pay?" + params.toString();
});
