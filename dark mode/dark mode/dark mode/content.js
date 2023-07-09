console.log("this is content script");

// const toggleSwitch = document.getElementsByClassName("onoff");

let set;
let enabled = true;
var blockedSites = [];

document.addEventListener("DOMContentLoaded", function () {
  // Send a message to the background script to update the button state
  chrome.runtime.sendMessage({ message: "updateButtonState" });
});

// Check if dark mode is enabled for the current site
chrome.runtime.sendMessage({ message: "checkDarkMode" }, function (response) {
  if (response.darkModeEnabled === true) {
    set = setInterval(() => {
      enabled = true;
      applyDarkMode();
    }, 100);
  } else if (response.darkModeEnabled === false) {
    clearInterval(set);
    enabled = false;
    removeDarkMode();
  }
});

chrome.runtime.onMessage.addListener(function (req, sender, senResponse) {
  // var tabId = sender.tab.id;

  if (req.message === "enabled") {
    console.log("first");
    set = setInterval(() => {
      enabled = true;
      applyDarkMode();
    }, 100);
  } else if (req.message === "disabled") {
    console.log("second");
    clearInterval(set);
    enabled = false;
    removeDarkMode();
  } else if (req.message === "siteBlocked") {
    console.log("message recieved that site is blocked");
    enabled = false;
    clearInterval(set).then(() => {
      console.log("interval cleared");
    });

    removeDarkMode();
  }
  else if (req.message === "blockSite" || req.message === "unblockSite") {
    const blockbtn = document.getElementById("ristrict_btn");
    const unblock = document.getElementById("removeris_btn");
    enabled = false;
    clearInterval(set);
    removeDarkMode();
    if (blockbtn && unblock) {
      const isBlocked = req.message === "blockSite";
      blockbtn.style.display = isBlocked ? "none" : "block";
      unblock.style.display = isBlocked ? "block" : "none";
    }
  }
});



function applyDarkMode() {
  const darkModeEnabled = localStorage.getItem("darkModeEnabled");

  const currentUrl = window.location.hostname;
  if (blockedSites.includes(currentUrl)) {
    console.log("This site is blocked");
    return; // Exit the function and do not apply dark mode
  }
  let body = document.querySelector("body");
  body.style.filter = "invert(100%)";
  body.style.background = "#222";
  body.style.color = "#fff";
  

  let media = document.querySelectorAll("img, video, picture, canvas");

  let r_media = Array.from(media);
  r_media.map((item) => {
    item.style.filter = "invert(100%) brightness(100%)";
  });
}

function removeDarkMode() {
  const darkModeEnabled = localStorage.getItem("darkModeEnabled");
  let body = document.querySelector("body");
  body.style.filter = "none";
  body.style.background = "#fff";
  body.style.color = "#222";
  

  let media = document.querySelectorAll("img, video, picture, canvas");

  let r_media = Array.from(media);
  r_media.map((item) => {
    item.style.filter = "none";
  });
}
