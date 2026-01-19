const toggleBtn = document.getElementById('toggleBtn');

chrome.storage.local.get("focusEnabled", (data) => {
    const isEnabled = data.focusEnabled || false;
    updateButton(isEnabled);
});

toggleBtn.addEventListener('click', () => {
    chrome.storage.local.get("focusEnabled", (data) => {
        const newState = !data.focusEnabled;

        chrome.storage.local.set({ focusEnabled: newState}, () => {
            chrome.runtime.sendMessage({
                type: newState ? "ENABLE_FOCUS" : "DISABLE_FOCUS"
            });
            updateButton(newState);
        });
    });
});

function updateButton(enabled) {
    toggleBtn.textContent = enabled ? "Disable Focus" : "Enable Focus";
}
