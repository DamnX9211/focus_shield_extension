chrome.runtime.onInstalled.addListener(() => {
    console.log('Focus Shield Extension Installed');
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === "START_FOCUS") {
        console.log('Focus mode started');
        // Add logic to block distracting websites here
    }
})