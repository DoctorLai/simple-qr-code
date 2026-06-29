function showQR(txt) {
  if (!txt) {
    return;
  }
  if (txt.length === 0) {
    return;
  }
  $(document).off("click.qrDismiss keydown.qrDismiss");
  var weibomiaopaiqrdiv = document.getElementById("weibomiaopaiqrdiv");
  if (weibomiaopaiqrdiv != null) {
    document.body.removeChild(weibomiaopaiqrdiv);
  }

  var d = document.createElement("div");
  d.setAttribute("id", "weibomiaopaiqrdiv");
  d.innerHTML =
    "<div id='weibomiaopaiqrpanel'>" +
    "<div id='weibomiaopaiqrheader'>QR Code</div>" +
    "<div id='weibomiaopaiqrcode'></div>" +
    "<textarea id='weibomiaopaiqrtext' spellcheck='false'></textarea>" +
    "<div id='weibomiaopaiqractions'>" +
    "<button id='weibomiaopaiqrupdate' type='button'>Update</button>" +
    "<button id='weibomiaopaiqrdownload' type='button'>Download</button>" +
    "<button id='weibomiaopaiqrclose' type='button'>Close</button>" +
    "</div>" +
    "</div>";
  document.body.appendChild(d);
  var panel = document.getElementById("weibomiaopaiqrpanel");
  var qrcodeElement = document.getElementById("weibomiaopaiqrcode");
  var textArea = document.getElementById("weibomiaopaiqrtext");
  var currentText = txt;

  var style = document.createElement("style");
  style.textContent =
    "#weibomiaopaiqrdiv{position:fixed;z-index:2147483647;top:16vh;left:calc(50vw - 190px);font:13px/1.4 Arial,sans-serif;color:#1f2937}" +
    "#weibomiaopaiqrpanel{width:340px;padding:14px;background:#fff;border:1px solid #d8dee6;border-radius:8px;box-shadow:0 16px 44px rgba(15,23,42,.2)}" +
    "#weibomiaopaiqrheader{margin:-14px -14px 12px;padding:10px 14px;background:#f6f8fb;border-bottom:1px solid #d8dee6;border-radius:8px 8px 0 0;font-weight:700;cursor:move;user-select:none}" +
    "#weibomiaopaiqrcode{width:250px;min-height:250px;margin:0 auto 12px;padding:18px;background:#f7f9fc;border:1px solid #d8dee6;border-radius:8px;display:flex;align-items:center;justify-content:center}" +
    "#weibomiaopaiqrtext{box-sizing:border-box;width:100%;min-height:68px;margin:0 0 10px;padding:8px;border:1px solid #d8dee6;border-radius:6px;color:#1f2937;font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;resize:vertical}" +
    "#weibomiaopaiqractions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}" +
    "#weibomiaopaiqractions button{min-height:32px;border:0;border-radius:6px;background:#1769aa;color:#fff;font-weight:700;cursor:pointer}" +
    "#weibomiaopaiqractions button:hover{background:#0f548c}";
  d.appendChild(style);

  textArea.value = txt;
  var qrcode = new QRCode(qrcodeElement, {
    text: txt,
    width: 250,
    height: 250,
    padding: 120,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  function updateQR(nextText) {
    var cleanText = String(nextText || "").trim();
    if (cleanText.length === 0) {
      return;
    }
    try {
      qrcode.clear();
      qrcode.makeCode(cleanText);
    } catch {
      return;
    }
    currentText = cleanText;
    textArea.value = cleanText;
  }

  function downloadQR() {
    var canvas = qrcodeElement.querySelector("canvas");
    var img = qrcodeElement.querySelector("img");
    var dataUrl = null;
    if (canvas && typeof canvas.toDataURL === "function") {
      dataUrl = canvas.toDataURL("image/png");
    } else if (img && img.src) {
      dataUrl = img.src;
    }
    if (!dataUrl) {
      return;
    }
    var filename =
      typeof QRUtils !== "undefined"
        ? QRUtils.sanitizeFilename(currentText, "qrcode")
        : "qrcode.png";
    var link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function closeQR() {
    $(document).off("click.qrDismiss keydown.qrDismiss");
    var activeQrDiv = document.getElementById("weibomiaopaiqrdiv");
    if (activeQrDiv) {
      document.body.removeChild(activeQrDiv);
    }
  }

  function dragElement(elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    document.getElementById("weibomiaopaiqrheader").onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  dragElement(d);

  panel.addEventListener("click", function (event) {
    event.stopPropagation();
  });
  document
    .getElementById("weibomiaopaiqrupdate")
    .addEventListener("click", function () {
      updateQR(textArea.value);
    });
  document
    .getElementById("weibomiaopaiqrdownload")
    .addEventListener("click", downloadQR);
  document
    .getElementById("weibomiaopaiqrclose")
    .addEventListener("click", closeQR);
  textArea.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      updateQR(textArea.value);
    }
  });

  $(document).on("click.qrDismiss", function (event) {
    if (!$(event.target).closest("div#weibomiaopaiqrdiv").length) {
      closeQR();
    }
  });
  $(document).on("keydown.qrDismiss", function (event) {
    if (event.key === "Escape") {
      closeQR();
    }
  });
}

chrome.runtime.onMessage.addListener(function (request) {
  switch (request.type) {
    case "weibomiaopaiopenqrmodal":
      showQR(request.text);
      break;
  }
});
