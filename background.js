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
    if(message.type === "ENABLE_FOCUS") {
        
        // logic to block distracting websites
        chrome.declarativeNetRequest.updateDynamicRules({
            
            removeRuleIds: [1],
            addRules: [BLOCK_RULE]
        },
    () =>  console.log('Focus ENABLED')
    );
}
  if(message.type === "DISABLE_FOCUS") {
        // logic to unblock distracting websites
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1]
        }, () => console.log('Focus DISABLED'));
  }

});