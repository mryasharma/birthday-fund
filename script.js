// Add Yash's real UPI ID only when ready. Never publish a guessed payment address.
const UPI_ID = "";
const UPI_NAME = "Yash Sharma";
const MAX_GIFT = 5000;\nconst SNEAKER_GOAL = 5000;\nconst CONFIRMED_GIFTS = 0; // Increase only after confirming UPI payments.\n\nconst formatINR = value => "₹" + Number(value).toLocaleString("en-IN");\nconst pct = Math.min(100, Math.round((CONFIRMED_GIFTS / SNEAKER_GOAL) * 100));\ndocument.getElementById("raisedAmount").textContent = formatINR(CONFIRMED_GIFTS);\ndocument.getElementById("goalAmount").textContent = formatINR(SNEAKER_GOAL);\ndocument.getElementById("fundProgress").style.width = pct + "%";\ndocument.getElementById("progressPercent").textContent = pct + "% COMPLETE";\ndocument.getElementById("leftAmount").textContent = formatINR(Math.max(0, SNEAKER_GOAL - CONFIRMED_GIFTS)) + " TO GO";\ndocument.querySelector(".progress-track").setAttribute("aria-valuenow", CONFIRMED_GIFTS);
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
  if (!Number.isFinite(amount) || amount < 1 || amount > MAX_GIFT) {
    alert("Choose an amount between ₹1 and ₹5,000.");
    return;
  }
  if (!UPI_ID) {
    alert("The optional UPI gift option isn't set up yet. Yash will add his verified UPI details if he decides to enable it.");
    return;
  }
  const params = new URLSearchParams({
    pa: UPI_ID, pn: UPI_NAME, am: amount.toFixed(2),
    cu: "INR", tn: "Birthday sneaker boost"
  });
  window.location.href = "upi://pay?" + params.toString();
});

// Show a QR only when Yash has added a real QR image to the assets folder.
const qr = document.querySelector('.qr-slot img');
qr.addEventListener('load', () => {
  document.getElementById('qrSlot').hidden = false;
  document.getElementById('qrCaption').hidden = false;
});
qr.addEventListener('error', () => {
  document.getElementById('qrSlot').hidden = true;
  document.getElementById('qrCaption').hidden = true;
});
