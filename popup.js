const blockBtn = document.getElementById("blockCurrent");
const openListBtn = document.getElementById("openList");
const statusDiv = document.getElementById("status");
const startFocusBtn = document.getElementById("startFocus");
const stopFocusBtn = document.getElementById("stopFocus");

function loadStatus() {
  chrome.runtime.sendMessage({ type: "getBlocklist" }, res => {
    const list = res.blocklist || [];
    statusDiv.textContent = list.length
      ? `${list.length} site(s) blocked`
      : "No sites blocked";
  });
}

blockBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "addCurrentSite" }, () => {
    statusDiv.textContent = "Site blocked. Refresh the page.";
  });
});

openListBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

startFocusBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "startFocus" });
});

stopFocusBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "stopFocus" });
});

loadStatus();