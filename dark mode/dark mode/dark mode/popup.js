var disable = document.getElementById("disable_btn");
var enable = document.getElementById("enable_btn");
var logoflip = document.getElementsByClassName("logodis");
var logo = document.getElementsByClassName("logo");
let unblock=document.getElementById("removeris_btn");
let blockbtn = document.getElementById("ristrict_btn");
//check if site is blocked by user

let blockedSites = JSON.parse(localStorage.getItem("blockedSites")) || [];

function updateButtonState() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    var tabHostname = new URL(currentTab.url).hostname;

    if (blockedSites.includes(tabHostname)) {
      blockbtn.style.display = "none";
      unblock.style.display = "block";
    } else {
      blockbtn.style.display = "block";
      unblock.style.display = "none";
    }
  });
}

updateButtonState();

blockbtn.addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // var currentUrl = tabs[0].url;

    // blockbtn.style.display="none";
    // unblock.style.display="block";

    // // Retrieve the blocked sites array from local storage
    //  blockedSites = JSON.parse(localStorage.getItem("blockedSites")) || [];

    // Check if the current URL is already in the blocked sites array
    var currentTabb = tabs[0];
    var tabHostnamee = new URL(currentTabb.url).hostname;

    if (blockedSites.includes(tabHostnamee)) {
      blockedSites = blockedSites.filter((item) => item !== tabHostnamee);
      localStorage.setItem("blockedSites", JSON.stringify(blockedSites));
      chrome.tabs.sendMessage(tabs[0].id, { message: "unblockSite" });
      blockbtn.style.display = "block";
      unblock.style.display = "none";
      
      console.log("Removed from the blacklist.");
    }

    else {
      // Add the current URL to the blocked sites array
      blockedSites.push(tabHostnamee);
      localStorage.setItem("blockedSites", JSON.stringify(blockedSites));
      chrome.tabs.sendMessage(tabs[0].id, { message: "blockSite" });
      disable.style.display = "none";
      enable.style.display = "block";
      blockbtn.style.display = "none";
      unblock.style.display = "block";
      console.log("Added to the blacklist.");
    }

  });
  updateButtonState();

});


unblock.addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentTab = tabs[0];
    let currentHost = new URL(currentTab.url).hostname;

        console.log("unblocking")
        console.log(currentHost);
    if (blockedSites.includes(currentHost)) {
      console.log("Unblocking");
      blockedSites = blockedSites.filter((item) => item !== currentHost);
      console.log(blockedSites);

      localStorage.setItem("blockedSites", JSON.stringify(blockedSites));
      chrome.tabs.sendMessage(tabs[0].id, { message: "unblockSite" });

      enable.style.display = "block";
      disable.style.display = "none";

      blockbtn.style.display = "block";
      unblock.style.display = "none";

    }
  });
  updateButtonState();

});


// Enable dark mode

enable.addEventListener("click", () => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      var currentTab = tabs[0];
      var tabId = currentTab.id;
      var tabHostname = new URL(currentTab.url).hostname;
      console.log(tabHostname);
      var newArr = [];
      newArr = JSON.parse(localStorage.getItem("blockedSites"));
      console.log(newArr);
      console.log(tabHostname);
      if (newArr != null && newArr.includes(tabHostname)) {
        console.log("this site is blocked");
        showMessage("This site is restricted from using dark mode", 2000);
        return;
      }

      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      console.log("clickeddddddddddddd");

      disable.style.display = "block";
      enable.style.display = "none";

      chrome.tabs.sendMessage(tab.id, {
        message: "enabled",
        sender: { tab: tab },
      });

      chrome.storage.sync.set({ [tabHostname]: true });

      if (newArr != null && newArr.includes(tabHostname)) {
        enabledSites.push(tabHostname);
        localStorage.setItem("enabledSites", JSON.stringify(enabledSites));
      }
      localStorage.setItem("darkModeEnabled_" + tabHostname, true);
    }
  );
});

//Disable dark mode

disable.addEventListener("click", async () => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      var currentTab = tabs[0];
      var tabHostname = new URL(currentTab.url).hostname;
      var tabId = currentTab.id;
      console.log("clicked");
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      chrome.tabs.sendMessage(tabId, {
        message: "disabled",
        sender: { tab: tab },
      });

      disable.style.display = "none";
      enable.style.display = "block";

      chrome.storage.sync.remove(tabHostname);

      localStorage.setItem("darkModeEnabled_" + tabHostname, false);
    }
  );
});

// Store Dark mode state

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var tabId = tabs[0].id;
  var currentTab = tabs[0];

  var tabHostname = new URL(currentTab.url).hostname;

  chrome.storage.sync.get(tabHostname, function (result) {
    var darkModeEnabled = result[tabHostname];

    if (darkModeEnabled === true) {
      enable.style.display = "none";
      disable.style.display = "block";
    } else {
      enable.style.display = "block";
      disable.style.display = "none";
    }
  });
});


// Store bloced sites

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   // var tabId = tabs[0].id;
//   var currentTab = tabs[0];
//   chrome.storage.sync.set({ [tabHostname]: true }, function () {
//     console.log(tabHostname,"tabHostname in set func")
//     console.log('Value set successfully');
//   });
//   var tabHostname = new URL(currentTab.url).hostname;

//   console.log(tabHostname,"tab-----------")
//   chrome.storage.sync.get(tabHostname, function (req) {
//     console.log(req,"req==")
//     var blocked = req[tabHostname];
//     console.log(blocked,"blocked----------------",typeof blocked);
//     console.log(blockedSites,"blockedSites----------------", typeof blockedSites)
//     if (blockedSites.includes(tabHostname)) {
//       blockbtn.style.display = "none";
//       unblock.style.display = "block";
//     } else {
//       blockbtn.style.display = "block";
//       unblock.style.display = "none";
//     }
//   });
// });


chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var currentTab = tabs[0];
  var tabHostname = new URL(currentTab.url).hostname;

  console.log(tabHostname, "tab-----------");

  chrome.storage.sync.set({ [tabHostname]: tabHostname }, function () {
    console.log(tabHostname, "tabHostname in set func");
    console.log('Value set successfully');

    chrome.storage.sync.get(tabHostname, function (req) {
      console.log(req, "req==");
      var blocked = req[tabHostname];
      console.log(blocked, "blocked----------------", typeof blocked);
      console.log(blockedSites, "blockedSites----------------", typeof blockedSites);

      if (blockedSites.includes(blocked)) {
        blockbtn.style.display = "none";
        unblock.style.display = "block";
      } else {
        blockbtn.style.display = "block";
        unblock.style.display = "none";
      }
    });
  });
});



//Show message function
function showMessage(message, duration) {
  var messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageElement.className = "message";
  document.body.appendChild(messageElement);

  setTimeout(function () {
    document.body.removeChild(messageElement);
  }, duration);
}
