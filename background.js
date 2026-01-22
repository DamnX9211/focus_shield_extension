
 function buildRules(sites) {
    return sites.map((site, index) => ({
        id: index + 1,
        priority: 1,
        action: {
            type: "block"
        },
        condition: {
           urlFilter: site,
           resourceTypes: ["main_frame"]
        }
    }));
 }

                    // applying blocking rules
 function applyRules() {
    chrome.storage.local.get(["blockedSites", "focusEnabled"], (data) => {
        if(!data.focusEnabled) return;

        const sites = data.blockedSites || [];
        const rules = buildRules(sites);
        const ruleIds = rules.map((r) => r.id); 
        
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: ruleIds,
            addRules: rules
        },
        () => console.log("Rules Updated:", sites)
    );
     });
 }

    function disableFocus() {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: Array.from({ length: 100}, (_, i) => i+1)
        }, () => {
            chrome.storage.local.set({ focusEnabled: false, attempts: 0});
            chrome.alarms.clear("focusTimer");
            console.log('Focus mode disabled and rules cleared.');
        }
    );
    }

// ALARM LISTENER
chrome.alarms.onAlarm.addListener((alarm) => {
    if(alarm.name === "focusTimer") {
        disableFocus();
        console.log("Focus AUTO DISABLED.");
    }
})    

    // MESSAGE LISTENER
chrome.runtime.onMessage.addListener((message) => {
    if(message.type === "START_TIMED_FOCUS") {
        applyRules();
        chrome.alarms.create("focusTimer", { 
            delayInMinutes: message.minutes
        })

    }
    
    if(message.type === "DISABLE_FOCUS"){
        disableFocus();
}
  if(message.type === "UPDATE_RULES") applyRules();
});

// Attempt Tracker
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if(changeInfo.status !== "loading") return;

    chrome.storage.local.get(
        ["focusEnabled", "blockedSites", "attempts"],
        (data) => {
            if(!data.focusEnabled) return;

            const url = changeInfo.url || "";
            const sites = data.blockedSites || [];

            if(sites.some((site) => url.includes(site))) {
                const attempts = (data.attempts || 0) +1;
                chrome.storage.local.set({ attempts });
                console.log(`Blocked attempt to access ${url}. Total attempts: ${attempts}`);
            }
        }
    )
})

