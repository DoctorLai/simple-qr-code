/**
 * Background service worker (Manifest V3).
 *
 * Re-creates the "Create QR Code from Selection or Tab URL" context-menu item and,
 * when it is clicked, opens the extension popup with the selected text (or the
 * tab URL when nothing is selected).
 */
importScripts("lib/qrutils.js");

var MENU_ID = "justyyuk-offline-qr-code";
var MENU_TITLE = "Create QR Code from Selection or Tab URL";

function buildContextMenu() {
  chrome.contextMenus.removeAll(function () {
    chrome.storage.sync.get("hidemenu", function (data) {
      if (!data || !data.hidemenu) {
        chrome.contextMenus.create({
          id: MENU_ID,
          title: MENU_TITLE,
          contexts: ["all"],
        });
      }
    });
  });
}

// Context menus must be (re)created on install and on browser startup.
chrome.runtime.onInstalled.addListener(buildContextMenu);
chrome.runtime.onStartup.addListener(buildContextMenu);

// Rebuild when the user toggles the "hide context menu" option.
chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === "sync" && changes.hidemenu) {
    buildContextMenu();
  }
});

function openPopupWithText(text) {
  chrome.storage.session.set({ pendingQrText: text }, function () {
    if (!chrome.action || !chrome.action.openPopup) {
      chrome.tabs.create({ url: chrome.runtime.getURL("main.html") });
      return;
    }
    try {
      var openResult = chrome.action.openPopup();
      if (openResult && typeof openResult.catch === "function") {
        openResult.catch(function () {
          chrome.tabs.create({ url: chrome.runtime.getURL("main.html") });
        });
      }
    } catch {
      chrome.tabs.create({ url: chrome.runtime.getURL("main.html") });
    }
  });
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId !== MENU_ID) {
    return;
  }
  var txt = self.QRUtils.pickQrText(info, tab);
  if (txt && txt.length > 0) {
    openPopupWithText(txt);
  }
});
