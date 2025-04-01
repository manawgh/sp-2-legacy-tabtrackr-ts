/// <reference types="chrome" />
import services from '../src/services/services'
import { Visit } from '../../types';

let activeTabId: number | undefined = undefined;
let activeTabUrl: string = ''; // Hostname of the active tab
let lastTick: number = Date.now();
// let tabUsage = {}; // Accumulates usage per site
// todo done: refactored to satisfy TypeScript's need for key names (pt.1) > + consistent format all around now!
let tabUsage: Visit[] = []; 

// Record elapsed time for the current active tab
function recordUsage() {
  const now: number = Date.now();
  const elapsed: number = now - lastTick;
  lastTick = now;
  if (activeTabId && activeTabUrl) {
    // tabUsage[activeTabUrl] = (tabUsage[activeTabUrl] || 0) + elapsed;
    // todo done: refactored to fit new tabUsage type (pt.2)
    const visitIndex: number = tabUsage.findIndex( visit => visit.site === activeTabUrl);
    if (visitIndex !== -1) {
      tabUsage[visitIndex].timeSpent += elapsed; }
    else {
      const newVisit: Visit = { site: activeTabUrl, timeSpent: elapsed };
      tabUsage.push(newVisit);
    }
    // console.log(`Tick: logged ${elapsed}ms for ${activeTabUrl}`); // todo done: commented logs out
  }
}

// Update the active tab and record any pending time from the previous tab
function updateActiveTab(newTabId: number | undefined) {
  // Record any usage from the previous active tab
  recordUsage();
  activeTabId = newTabId;

  /* if (newTabId) {
    chrome.tabs.get(newTabId, (tab: chrome.tabs.Tab) => {
      if (chrome.runtime.lastError || !tab || !tab.url) {
        activeTabUrl = '';
      } else {
        activeTabUrl = new URL(tab.url).hostname;
        // console.log(`Switched to tab ${newTabId}: ${activeTabUrl}`);
      }
    });
  } else {
    activeTabUrl = '';
    // console.log("No active tab");
  } */

  // todo done: refactored
  activeTabUrl = '';
  if (newTabId) {
    chrome.tabs.get(newTabId, (tab: chrome.tabs.Tab) => {
      if (!chrome.runtime.lastError && tab && tab.url) {
        activeTabUrl = new URL(tab.url).hostname;
      }
    });
  }
}

// VIC SAYS:

/* function isTabValid (tab: chrome.tabs.Tab): boolean {
 return (!chrome.runtime.lastError && tab && tab.url)
}
......
      if ( isTabValid(tab) ) {
        activeTabUrl = new URL(tab.url).hostname;
      } */
     

// Listen for tab activation changes
chrome.tabs.onActivated.addListener((activeInfo: chrome.tabs.TabActiveInfo) => {
  updateActiveTab(activeInfo.tabId);
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId: number) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    updateActiveTab(undefined); // Browser lost focus
  } else {
    chrome.tabs.query({ active: true, windowId }, (tabs: chrome.tabs.Tab[]) => {
      if (tabs.length) {
        updateActiveTab(tabs[0].id);
      }
    });
  }
});

// Listen for url changes within the active tab
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
  if (tabId === activeTabId && changeInfo.url) {
    // Record time for the previous url, then update to the new one
    recordUsage();
    activeTabUrl = new URL(changeInfo.url).hostname;
    // console.log(`Tab ${tabId} updated URL to: ${activeTabUrl}`);
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId: number) => {
  if (tabId === activeTabId) {
    updateActiveTab(undefined);
  }
});

// todo: why? (ask archie)
//Record usage every second
setInterval(recordUsage, 1000);

/* setInterval(() => {
  recordUsage();
  if (Object.keys(tabUsage).length > 0) {
    const usageData = Object.entries(tabUsage).map(([site, timespent]) => ({
      site,
      timespent,
    }));
    console.log("Sending tabUsage:", usageData);
    fetch("http://localhost:3000/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usage: usageData }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to send data");
        return response.json();
      })
      .then(() => {
        tabUsage = {};
      })
      .catch((error) => {
        console.error("Error sending usage data:", error);
      });
  }
}, 30000);
 */

// todo done: moved fetch call into postSites function in services.ts...
// todo done: ...and refactored according to new tabUsage data format (pt.3) > + more efficient now!
// Send usage data every 30 seconds
setInterval(() => {
  //Capture the latest time before sending
  recordUsage();
  if (tabUsage.length) {
    // console.log("Sending tabUsage:", usageData);
    services.postSites(tabUsage).then(() => { tabUsage = [] }); // Clear usage if request succeeds
  }
}, 30000);


// console.log("background tab tracking script is running");

