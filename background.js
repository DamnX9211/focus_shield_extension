 const BLOCK_RULE = {
    id:1,
    priority: 1,
    action: {
        type: "block"
    },
    condition: {
        urlFilter: "example.com",
        resourceTypes: ["main_frame"]
    }
 };

chrome.runtime.onMessage.addListener((message) => {
    if(message.type === "START_FOCUS") {
        
        // logic to block distracting websites
        chrome.declarativeNetRequest.updateDynamicRules({
            
            removeRuleIds: [1],
            addRules: [BLOCK_RULE],
        },
    () => {
        console.log('Blocking rules ENABLED');
    });
    }
});