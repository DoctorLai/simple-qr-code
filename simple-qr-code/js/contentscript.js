function showQR(txt, settings) {
  if (!txt) {
    return;
  }
  if (txt.length === 0) {
    return;
  }
  settings = settings || {};

  var utils = (typeof QRUtils !== "undefined" && QRUtils) || {};
  var DEFAULTS = utils.DEFAULTS || {
    theme: "auto",
    qrColorDark: "#000000",
    qrColorLight: "#ffffff",
  };
  var normalizeHexColor =
    utils.normalizeHexColor ||
    function (value, fallback) {
      return /^#[0-9a-f]{6}$/i.test(value)
        ? value.toLowerCase()
        : fallback || "#000000";
    };
  var normalizeTheme =
    utils.normalizeTheme ||
    function (value) {
      return value === "light" || value === "dark" ? value : "auto";
    };

  var colorDark = normalizeHexColor(settings.qrColorDark, DEFAULTS.qrColorDark);
  var colorLight = normalizeHexColor(
    settings.qrColorLight,
    DEFAULTS.qrColorLight
  );
  var theme = normalizeTheme(settings.theme);
  var prefersDark = !!(
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  var dark = theme === "dark" || (theme === "auto" && prefersDark);
  var palette = dark
    ? {
        text: "#e6edf3",
        panelBg: "#1b232d",
        border: "#2c3845",
        headerBg: "#243140",
        taBg: "#0f141a",
        taText: "#e6edf3",
        btn: "#4c9be8",
        btnHover: "#5fa8ef",
      }
    : {
        text: "#1f2937",
        panelBg: "#ffffff",
        border: "#d8dee6",
        headerBg: "#f6f8fb",
        taBg: "#ffffff",
        taText: "#1f2937",
        btn: "#1769aa",
        btnHover: "#0f548c",
      };

  $(document).off("click.qrDismiss keydown.qrDismiss");
  var weibomiaopaiqrdiv = document.getElementById("weibomiaopaiqrdiv");
  if (weibomiaopaiqrdiv != null) {
    document.body.removeChild(weibomiaopaiqrdiv);
  }

  var d = document.createElement("div");
  d.setAttribute("id", "weibomiaopaiqrdiv");
  d.innerHTML =
    "<div id='weibomiaopaiqrpanel'>" +
    "<div id='weibomiaopaiqrheader'>" +
    "<span id='weibomiaopaiqrtitle'>QR Code</span>" +
    "<button id='weibomiaopaiqrclose' type='button' aria-label='Close'>\u00d7</button>" +
    "</div>" +
    "<div id='weibomiaopaiqrcode'></div>" +
    "<textarea id='weibomiaopaiqrtext' spellcheck='false'></textarea>" +
    "<div id='weibomiaopaiqractions'>" +
    "<button id='weibomiaopaiqrcopy' type='button'>Copy</button>" +
    "<button id='weibomiaopaiqrdownload' type='button'>Download</button>" +
    "</div>" +
    "</div>";
  document.body.appendChild(d);
  var panel = document.getElementById("weibomiaopaiqrpanel");
  var qrcodeElement = document.getElementById("weibomiaopaiqrcode");
  var textArea = document.getElementById("weibomiaopaiqrtext");
  var currentText = txt;

  var style = document.createElement("style");
  style.textContent =
    "#weibomiaopaiqrdiv{position:fixed;z-index:2147483647;top:16vh;left:calc(50vw - 190px);font:13px/1.4 Arial,sans-serif;color:" +
    palette.text +
    "}" +
    "#weibomiaopaiqrpanel{width:340px;padding:14px;background:" +
    palette.panelBg +
    ";border:1px solid " +
    palette.border +
    ";border-radius:8px;box-shadow:0 16px 44px rgba(15,23,42,.2)}" +
    "#weibomiaopaiqrheader{display:flex;align-items:center;justify-content:space-between;margin:-14px -14px 12px;padding:8px 8px 8px 14px;background:" +
    palette.headerBg +
    ";border-bottom:1px solid " +
    palette.border +
    ";border-radius:8px 8px 0 0;font-weight:700;cursor:move;user-select:none}" +
    "#weibomiaopaiqrtitle{font-size:14px}" +
    "#weibomiaopaiqrclose{margin:0;padding:0 6px;border:0;background:none;color:inherit;font:700 18px/1 Arial,sans-serif;cursor:pointer;opacity:.6}" +
    "#weibomiaopaiqrclose:hover{opacity:1}" +
    "#weibomiaopaiqrcode{width:250px;min-height:250px;margin:0 auto 12px;padding:18px;background:" +
    colorLight +
    ";border:1px solid " +
    palette.border +
    ";border-radius:8px;display:flex;align-items:center;justify-content:center}" +
    "#weibomiaopaiqrtext{box-sizing:border-box;width:100%;min-height:68px;margin:0 0 10px;padding:8px;border:1px solid " +
    palette.border +
    ";border-radius:6px;background:" +
    palette.taBg +
    ";color:" +
    palette.taText +
    ";font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;resize:vertical}" +
    "#weibomiaopaiqractions{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    "#weibomiaopaiqractions button{min-height:32px;border:0;border-radius:6px;background:" +
    palette.btn +
    ";color:#fff;font-weight:700;cursor:pointer}" +
    "#weibomiaopaiqractions button:hover{background:" +
    palette.btnHover +
    "}";
  d.appendChild(style);

  textArea.value = txt;
  var qrcode = new QRCode(qrcodeElement, {
    text: txt,
    width: 250,
    height: 250,
    padding: 120,
    colorDark: colorDark,
    colorLight: colorLight,
    correctLevel: QRCode.CorrectLevel.H,
  });

  // Regenerate from the textarea without writing back into it, so the field is
  // safe to update live on every keystroke.
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

  function copyText() {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }
    navigator.clipboard.writeText(currentText).then(function () {
      var btn = document.getElementById("weibomiaopaiqrcopy");
      if (!btn) {
        return;
      }
      btn.textContent = "Copied";
      setTimeout(function () {
        var current = document.getElementById("weibomiaopaiqrcopy");
        if (current) {
          current.textContent = "Copy";
        }
      }, 1200);
    });
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
  // Keep clicks/drags on the close button from starting a drag.
  var closeButton = document.getElementById("weibomiaopaiqrclose");
  closeButton.addEventListener("mousedown", function (event) {
    event.stopPropagation();
  });
  closeButton.addEventListener("click", closeQR);
  document
    .getElementById("weibomiaopaiqrcopy")
    .addEventListener("click", copyText);
  document
    .getElementById("weibomiaopaiqrdownload")
    .addEventListener("click", downloadQR);
  textArea.addEventListener("input", function () {
    updateQR(textArea.value);
  });
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
  if (request && request.type === "weibomiaopaiopenqrmodal") {
    chrome.storage.sync.get(
      ["theme", "qrColorDark", "qrColorLight"],
      function (stored) {
        showQR(request.text, stored || {});
      }
    );
  }
});
