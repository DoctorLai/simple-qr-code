var check = document.querySelector('input');

function setAction(hide) {
  chrome.contextMenus.removeAll();
  if (!hide) {
    chrome.contextMenus.create({
      title: "Get QR for Selected Text or Tab URL",
      contexts:["all"],
    });   
  }
}

check.onchange = function () {
  chrome.storage.sync.set({
    hidemenu: this.checked
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
