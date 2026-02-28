function formatTime(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function update() {
  chrome.runtime.sendMessage({ type: "getFocusState" }, res => {
    const timerEl = document.getElementById("timer");
    const sessionsEl = document.getElementById("sessions");

    sessionsEl.textContent = `Sessions today: ${res.sessionsToday || 0}`;

    if (res.focusActive && res.focusEndTime) {
      const remaining = res.focusEndTime - Date.now();
      timerEl.textContent = formatTime(remaining);
    } else {
      timerEl.textContent = "Stay Focused";
    }
  });
}

setInterval(update, 1000);
update();