document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function(tab) {  
    var url = tab.url;
    //var img = "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=" + encodeURIComponent(url);
    $('div#output').html(url);
    var qrcode = new QRCode(document.getElementById("qrcode"), {
	    text: url,
	    width: 250,
	    height: 250,
	    colorDark : "#000000",
			colorLight : "#ffffff",
			padding: 120,
	    correctLevel : QRCode.CorrectLevel.H
	});
	$('div#qrcode').click(function() {
		var msg = prompt("Any Text to QR", url);
		if ((msg != null) && (msg.length > 0) && (msg != url)) {
			qrcode.clear();
			qrcode.makeCode(msg);
			$('div#output').html(msg);
		}
	});
  });
}, false);
