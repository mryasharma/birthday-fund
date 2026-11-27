// Birthday fund progress — update only after confirming received payments.
const SNEAKER_GOAL = 5000;
const CONFIRMED_GIFTS = 2;

const formatINR = value => "₹" + Number(value).toLocaleString("en-IN");
const pct = Math.min(100, Number(((CONFIRMED_GIFTS / SNEAKER_GOAL) * 100).toFixed(2)));
document.getElementById("raisedAmount").textContent = formatINR(CONFIRMED_GIFTS);
document.getElementById("goalAmount").textContent = formatINR(SNEAKER_GOAL);
document.getElementById("fundProgress").style.width = pct + "%";
document.getElementById("progressPercent").textContent = pct + "% COMPLETE";
document.getElementById("leftAmount").textContent = formatINR(Math.max(0, SNEAKER_GOAL - CONFIRMED_GIFTS)) + " TO GO";
document.querySelector(".progress-track").setAttribute("aria-valuenow", CONFIRMED_GIFTS);

document.getElementById("copyUpiButton").addEventListener("click", async () => {
  const upiId = document.getElementById("upiIdText").textContent.trim();
  const status = document.getElementById("copyStatus");
  try {
    await navigator.clipboard.writeText(upiId);
    status.textContent = "UPI ID copied! Paste it in your UPI app.";
  } catch {
    const field = document.createElement("textarea");
    field.value = upiId;
    field.setAttribute("readonly", "");
    field.style.position = "absolute";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    status.textContent = copied ? "UPI ID copied! Paste it in your UPI app." : "Please select and copy the UPI ID above.";
  }
});
