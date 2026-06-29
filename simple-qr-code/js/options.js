var check = document.querySelector("input");

function setAction(hide) {
  // removeAll() is async; create the menu from its callback so we never race
  // into a "duplicate id" error.
  chrome.contextMenus.removeAll(function () {
    if (!hide) {
      chrome.contextMenus.create({
        id: "justyyuk-offline-qr-code",
        title: "Get QR for Selected Text or Tab URL",
        contexts: ["all"],
      });
    }
  });
}

check.onchange = function () {
  chrome.storage.sync.set({
    hidemenu: this.checked,
  });
  setAction(this.checked);
  chrome.tabs.getCurrent(function (tab) {
    chrome.tabs.remove(tab.id);
  });
};

chrome.storage.sync.get(function (options) {
  check.checked = !!options && options.hidemenu;
  setAction(check.checked);
});
