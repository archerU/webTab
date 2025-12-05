// Background service worker for webTab extension
chrome.action.onClicked.addListener((tab) => {
  // Always create a new tab, never use the current tab
  chrome.tabs.create({ 
    url: 'chrome://newtab/',
    active: true 
  });
});

