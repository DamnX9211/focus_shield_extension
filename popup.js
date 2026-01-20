const toggleBtn = document.getElementById('toggleBtn');
const addBtn = document.getElementById('addBtn');
const siteInput = document.getElementById('siteInput');
const siteList = document.getElementById('siteList');

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

// UI Helpers
function updateToggle(enabled) {
    toggleBtn.textContent = enabled ? "Disable Focus" : "Enable Focus";
}

function renderList(sites) {
    siteList.innerHTML = "";
    sites.forEach((site) => {
        const li = document.createElement("li");
        li.textContent = site;
        siteList.appendChild(li);
    });
}
