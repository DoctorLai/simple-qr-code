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
	var div = "<div style='z-index:999999;position:absolute;top:20%;left:30%;padding:30px;background:white' id=weibomiaopaiqrcode></div>";
	var d = document.createElement("div");
	d.setAttribute("id", "weibomiaopaiqrdiv");
	d.innerHTML = div;
	document.body.appendChild(d);
	var qrcode = new QRCode(document.getElementById("weibomiaopaiqrcode"), {
	    text: txt,
	    width: 250,
			height: 250,
			padding: 120,
	    colorDark : "#000000",
	    colorLight : "#ffffff",
	    correctLevel : QRCode.CorrectLevel.H
	});


	function dragElement(elmnt) {
	  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	  if (document.getElementById(elmnt.id + "header")) {
	    /* if present, the header is where you move the DIV from:*/
	    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	  } else {
	    /* otherwise, move the DIV from anywhere inside the DIV:*/
	    elmnt.onmousedown = dragMouseDown;
	  }

	  function dragMouseDown(e) {
	    e = e || window.event;
	    // get the mouse cursor position at startup:
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    document.onmouseup = closeDragElement;
	    // call a function whenever the cursor moves:
	    document.onmousemove = elementDrag;
	  }

	  function elementDrag(e) {
	    e = e || window.event;
	    // calculate the new cursor position:
	    pos1 = pos3 - e.clientX;
	    pos2 = pos4 - e.clientY;
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    // set the element's new position:
	    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	  }

	  function closeDragElement() {
	    /* stop moving when mouse button is released:*/
	    document.onmouseup = null;
	    document.onmousemove = null;
	  }
	}

	dragElement(document.getElementById("weibomiaopaiqrcode"));

	$(document).on('click', function(event) {
		var weibomiaopaiqrdiv = document.getElementById('weibomiaopaiqrdiv');
		if (!$(event.target).closest('div#weibomiaopaiqrdiv').length) {			
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
				if (weibomiaopaiqrdiv != null) {
					document.body.removeChild(weibomiaopaiqrdiv);
				}				
				var div = "<div style='z-index:999999;position:fixed;top:20%;left:30%;padding:30px;background:white' id=weibomiaopaiqrcode></div>";
				var d = document.createElement("div");
				d.setAttribute("id", "weibomiaopaiqrdiv");
				d.innerHTML = div;
				document.body.appendChild(d);
				var qrcode = new QRCode(document.getElementById("weibomiaopaiqrcode"), {
				    text: msg,
				    width: 250,
						height: 250,
						padding: 120,
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