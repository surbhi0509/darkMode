chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (req.message === "checkDarkMode") {
    // Retrieve the dark mode state from chrome.storage.sync
    var tabHostname = new URL(sender.tab.url).hostname;
    chrome.storage.sync.get(tabHostname, function (result) {
      var darkModeEnabled = result[tabHostname];
      sendResponse({ darkModeEnabled: darkModeEnabled });
    });
    return true; // Keep the message channel open for sendResponse
  }
});
