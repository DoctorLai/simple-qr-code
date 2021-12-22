/*
chrome.contextMenus.removeAll();

chrome.storage.sync.get('hidemenu', function(data) {
  var hidemenu = data.hidemenu;
  chrome.contextMenus.removeAll();
  if (!hidemenu) {
	chrome.contextMenus.create({
		title: "Get QR for Selected Text or Tab URL",
		contexts:["all"],
	});    	
  }
});  

chrome.action.onClicked.addListener(function (info, tab) {
	var txt = tab.url;
	if (info.selectionText && info.selectionText.length > 0) {
	   txt = info.selectionText;
	}
	if (txt.length) {
		chrome.tabs.query({
			active: true, 
			currentWindow: true
		}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				type: "weibomiaopaiopenqrmodal",
				text: txt
			}, function(res) {
				// response
			});
		});	
	}
});
*/