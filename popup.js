const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({
        type: "START_FOCUS"
    });
});

