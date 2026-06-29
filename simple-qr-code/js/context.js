/**
 * Background service worker (Manifest V3).
 *
 * Re-creates the "Get QR for Selected Text or Tab URL" context-menu item and,
 * when it is clicked, asks the content script on the active tab to render a QR
 * code for the selected text (or the tab URL when nothing is selected).
 */
importScripts("lib/qrutils.js");

var MENU_ID = "justyyuk-offline-qr-code";
var MENU_TITLE = "Get QR for Selected Text or Tab URL";

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

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId !== MENU_ID) {
    return;
  }
  var txt = self.QRUtils.pickQrText(info, tab);
  if (txt && txt.length > 0 && tab && tab.id != null) {
    chrome.tabs.sendMessage(tab.id, {
      type: "weibomiaopaiopenqrmodal",
      text: txt,
    });
  }
});
