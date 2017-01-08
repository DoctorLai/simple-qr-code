function showQR(txt) {
	if (!txt) {
		return;
	}
	if (txt.length == 0) {
		return;
	}
	//txt = utf16to8(txt);

	$(document).off('click');
	var weibomiaopaiqrdiv = document.getElementById('weibomiaopaiqrdiv');
	if (weibomiaopaiqrdiv != null) {
		document.body.removeChild(weibomiaopaiqrdiv);		
	}
	/*
	var div = "<button style='display:none' id=weibomiaopaiqrdivbtn type=button class=\"btn btn-info btn-lg\" data-toggle=\"modal\" data-target=\"#weibomiaopaimodaldialog\">Open Modal</button>" + 
			  "<div id=weibomiaopaimodaldialog class=\"modal fade\" role=\"dialog\">" +
			  "<div class=\"modal-dialog\">" +
			  "<div class=\"modal-content\">" +
			  "<div class=\"modal-header\">" +
			  "<button type=button class=close data-dismiss=\"modal\">&times;</button>" +
			  "<h4 class=\"modal-title\" id=weibomiaopaimodaldialogoutput style='word-wrap:break-word;width:250px'>" + txt + "</h4>" +
			  "</div>" +
			  "<div class=\"modal-body\">" +
			  "<div id=weibomiaopaiqrcode></div>" +
			  "</div>" +
			  "<div class=\"modal-footer\">" +
			  "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>" +
			  "</div>" +
			  "</div>" +
			  "</div>";
	*/
	// <div id=weibomiaopaimodaldialogoutput style='word-wrap:break-word;width:250px;text-align:center'></div>
	var div = "<div style='z-index:999999;position:fixed;top:20%;left:30%' id=weibomiaopaiqrcode></div>";
	var d = document.createElement("div");
	d.setAttribute("id", "weibomiaopaiqrdiv");
	d.innerHTML = div;
	document.body.appendChild(d);
	var qrcode = new QRCode(document.getElementById("weibomiaopaiqrcode"), {
	    text: txt,
	    width: 250,
	    height: 250,
	    colorDark : "#000000",
	    colorLight : "#ffffff",
	    correctLevel : QRCode.CorrectLevel.H
	});


	$(document).on('click', function(event) {
		if (!$(event.target).closest('div#weibomiaopaiqrdiv').length) {
			var weibomiaopaiqrdiv = document.getElementById('weibomiaopaiqrdiv');
			if (weibomiaopaiqrdiv != null) {
				document.body.removeChild(weibomiaopaiqrdiv);
			}
		} else {			
			var curTxt = '';
			var qrcode1 = document.getElementById("weibomiaopaiqrcode");
			if (qrcode1 != null) {
				curTxt = qrcode1.title;
			}							
			var msg = prompt("Any Text to QR", curTxt);
			if (msg.length > 0 && curTxt != msg) {				
				var weibomiaopaiqrdiv = document.getElementById('weibomiaopaiqrdiv');
				if (weibomiaopaiqrdiv != null) {
					document.body.removeChild(weibomiaopaiqrdiv);
				}				
				var div = "<div style='z-index:999999;position:fixed;top:20%;left:30%' id=weibomiaopaiqrcode></div>";
				var d = document.createElement("div");
				d.setAttribute("id", "weibomiaopaiqrdiv");
				d.innerHTML = div;
				document.body.appendChild(d);
				var qrcode = new QRCode(document.getElementById("weibomiaopaiqrcode"), {
				    text: msg,
				    width: 250,
				    height: 250,
				    colorDark : "#000000",
				    colorLight : "#ffffff",
				    correctLevel : QRCode.CorrectLevel.H
				});
			}				
		}
	});	
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch (request.type){
        case "weibomiaopaiopenqrmodal":
        	showQR(request.text);
            break;  
	}                   
});