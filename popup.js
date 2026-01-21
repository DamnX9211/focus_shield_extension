const toggleBtn = document.getElementById('toggleBtn');
const addBtn = document.getElementById('addBtn');
const siteInput = document.getElementById('siteInput');
const siteList = document.getElementById('siteList');
const startBtn = document.getElementById('startBtn');
const minutesInput = document.getElementById('minutesInput');

// Loading initial state
chrome.storage.local.get(["focusEnabled", "blockedSites"], (data) => {
    updateToggle(data.focusEnabled || false);
    renderList(data.blockedSites || []);
});

// toggle button text
toggleBtn.addEventListener('click', () => {
    chrome.storage.local.get("focusEnabled", (data) => {
        const newState = !data.focusEnabled;

        chrome.storage.local.set({ focusEnabled: newState}, () => {
            chrome.runtime.sendMessage({
                type: newState ? "ENABLE_FOCUS" : "DISABLE_FOCUS"
            });
            updateToggle(newState);
        });
    });
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
    if(!minutes || minutes <= 0) return;

    chrome.storage.local.set({
        focusEnabled: true,
        focusEndTime: Date.now() + minutes * 60 * 1000
    }, () => {
        chrome.runtime.sendMessage({
            type: "START_TIMED_FOCUS",
            minutes
        });
    }
    );
});

// manual disable when time is up
toggleBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "DISABLE_FOCUS"});
});


// UI Helpers
function updateToggle(enabled) {
    toggleBtn.textContent = enabled ? "Disable Focus" : "Enable Focus";
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