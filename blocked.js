const params = new URLSearchParams(window.location.search);
const site  = params.get("site");

function render() {
  chrome.storage.local.get(["focusEndTime", "attempts"], (data) => {
    const remaining = Math.max(
      0,
      Math.floor((data.focusEndTime - Date.now()) / 1000),
    );
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;

    document.getElementById("time").textContent =
      `Time left: ${min}:${sec.toString().padStart(2, "0")}`;
    document.getElementById("attempts").textContent =
      `Blocked Attempts: ${data.attempts || 0}`;
  });
}

document.getElementById("retryBtn").addEventListener("click", () => {
  chrome.storage.local.get("attempts", (data) => {
    chrome.storage.local.set({ attempts: (data.attempts || 0) + 1 }, () =>{
      window.location.href = "https://" + site;
    });
  });
});

render();
setInterval(render, 1000);
