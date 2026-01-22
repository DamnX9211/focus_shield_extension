const stopBtn = document.getElementById('stopBtn');
const addBtn = document.getElementById('addBtn');
const siteInput = document.getElementById('siteInput');
const siteList = document.getElementById('siteList');
const startBtn = document.getElementById('startBtn');
const minutesInput = document.getElementById('minutesInput');
const statusDiv = document.getElementById("status");
const attemptsDiv = document.getElementById("attempts");

// Loading initial state
chrome.storage.local.get(["focusEnabled", "blockedSites", "attempts", "focusEndTime"], (data) => {
    render(data);
});

// Adding new sites
addBtn.addEventListener("click", () => {
    const site = siteInput.value.trim();
    if(!site) return;

    chrome.storage.local.get("blockedSites", (data) => {
        const sites = data.blockedSites || [];
        if (sites.includes(site)) return;

        sites.push(site);

        chrome.storage.local.set({ blockedSites: sites}, () => {
            siteInput.value = "";
            renderList(sites);
            chrome.runtime.sendMessage({ type: "UPDATE_RULES"});
        });
    });
});

// Start focus session with timer
startBtn.addEventListener("click", ()=> {
    const minutes = parseInt(minutesInput.value);
    if(!minutes) return;

    chrome.storage.local.set({
        focusEnabled: true,
        focusEndTime: Date.now() + minutes * 60 * 1000,
        attempts: 0
    }, () => {
        chrome.runtime.sendMessage({
            type: "START_TIMED_FOCUS",
            minutes
        });
    }
    );
});

// manual disable when time is up
stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "DISABLE_FOCUS"});
});


// Render loop
setInterval(() => {
    chrome.storage.local.get(
        ["focusEnabled", "focusEndTime", "attempts", "blockedSites"],
        render
    );
}, 1000);

function render(data) {
    if(!data.focusEnabled) {
        statusDiv.textContent = "Focus Mode is OFF";
        attemptsDiv.textContent = "";
    } else {
        const remaining = Math.max(0, Math.floor((data.focusEndTime - Date.now()) / 1000));
        const min = Math.floor(remaining / 60);
        const sec = remaining % 60;

        statusDiv.textContent = `Time left: ${min}: ${sec.toString().padStart(2, "0")}`;

        attemptsDiv.textContent = `Blocked Attempts: ${data.attempts || 0}`;
    }

    renderList(data.blockedSites || []);
}

// UI render list of blocked sites
function renderList(sites) {
    siteList.innerHTML = "";
    sites.forEach((site) => {
        const li = document.createElement("li");
        li.textContent = site;
        siteList.appendChild(li);
    });
}