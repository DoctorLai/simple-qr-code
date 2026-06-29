document.addEventListener(
  "DOMContentLoaded",
  function () {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const manifest = chrome.runtime.getManifest();
      const appName = manifest.name + " v" + manifest.version;
      const output = document.getElementById("output");
      const status = document.getElementById("output2");
      const textInput = document.getElementById("qr-text");
      const qrcodeContainer = document.getElementById("qrcode");
      var url = tabs[0] && tabs[0].url ? tabs[0].url : "";
      var currentText = url;

      status.textContent = appName;
      output.textContent = url;
      textInput.value = url;

      const qrcode = new QRCode(qrcodeContainer, {
        text: url,
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff",
        padding: 120,
        correctLevel: QRCode.CorrectLevel.H,
      });

      function setStatus(message) {
        status.textContent = message || appName;
      }

      function updateQR(text) {
        const nextText = String(text || "").trim();
        if (nextText.length === 0) {
          setStatus("Enter text to generate a QR code.");
          return;
        }
        try {
          qrcode.clear();
          qrcode.makeCode(nextText);
        } catch {
          setStatus("Text is too long to encode as a QR code.");
          return;
        }
        currentText = nextText;
        textInput.value = nextText;
        output.textContent = nextText;
        setStatus(appName);
      }

      function downloadQR() {
        const canvas = qrcodeContainer.querySelector("canvas");
        const img = qrcodeContainer.querySelector("img");
        let dataUrl = null;
        if (canvas && typeof canvas.toDataURL === "function") {
          dataUrl = canvas.toDataURL("image/png");
        } else if (img && img.src) {
          dataUrl = img.src;
        }
        if (!dataUrl) {
          return;
        }
        const filename =
          typeof QRUtils !== "undefined"
            ? QRUtils.sanitizeFilename(currentText, "qrcode")
            : "qrcode.png";
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setStatus("Downloaded QR PNG.");
      }

      function copyText() {
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
          setStatus("Clipboard is not available.");
          return;
        }
        navigator.clipboard
          .writeText(currentText)
          .then(function () {
            setStatus("Copied QR text.");
          })
          .catch(function () {
            setStatus("Could not copy text.");
          });
      }

      $("#generate").click(function () {
        updateQR(textInput.value);
      });
      $("#download").click(downloadQR);
      $("#copy-text").click(copyText);
      $("#reset").click(function () {
        updateQR(url);
      });
      textInput.addEventListener("keydown", function (event) {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
          updateQR(textInput.value);
        }
      });
    });
  },
  false
);
