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

    // MESSAGE LISTENER
chrome.runtime.onMessage.addListener((message) => {
    if(message.type === "ENABLE_FOCUS") applyRules();
    
    if(message.type === "DISABLE_FOCUS"){
        chrome.declarativeNetRequest.updateDynamicRules({
            
            removeRuleIds: Array.from({ length: 100}, (_, i) => i+1) },
    () =>  console.log('All Rules Removed')
    );
}
  if(message.type === "UPDATE_RULES") applyRules();
});