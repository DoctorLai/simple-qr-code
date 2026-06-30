document.addEventListener(
  "DOMContentLoaded",
  function () {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const utils = (typeof self !== "undefined" && self.QRUtils) || {};
      const DEFAULTS = utils.DEFAULTS || {
        theme: "auto",
        qrColorDark: "#000000",
        qrColorLight: "#ffffff",
      };
      const normalizeHexColor =
        utils.normalizeHexColor ||
        function (value, fallback) {
          return /^#[0-9a-f]{6}$/i.test(value)
            ? value.toLowerCase()
            : fallback || "#000000";
        };
      const normalizeTheme =
        utils.normalizeTheme ||
        function (value) {
          return value === "light" || value === "dark" ? value : "auto";
        };

      const manifest = chrome.runtime.getManifest();
      const appName = manifest.name + " v" + manifest.version;
      const output = document.getElementById("output");
      const status = document.getElementById("output2");
      const textInput = document.getElementById("qr-text");
      const qrcodeContainer = document.getElementById("qrcode");
      const url = tabs[0] && tabs[0].url ? tabs[0].url : "";

      chrome.storage.sync.get(
        ["theme", "qrColorDark", "qrColorLight"],
        function (stored) {
          const data = stored || {};
          const theme = normalizeTheme(data.theme);
          const colorDark = normalizeHexColor(
            data.qrColorDark,
            DEFAULTS.qrColorDark
          );
          const colorLight = normalizeHexColor(
            data.qrColorLight,
            DEFAULTS.qrColorLight
          );

          if (theme === "auto") {
            document.documentElement.removeAttribute("data-theme");
          } else {
            document.documentElement.setAttribute("data-theme", theme);
          }

          let currentText = url;
          status.textContent = appName;
          output.textContent = url;
          textInput.value = url;

          const qrcode = new QRCode(qrcodeContainer, {
            text: url,
            width: 250,
            height: 250,
            colorDark: colorDark,
            colorLight: colorLight,
            padding: 120,
            correctLevel: QRCode.CorrectLevel.H,
          });

          function setStatus(message) {
            status.textContent = message || appName;
          }

          // Regenerate the QR from `text`. Does not write back into the
          // textarea, so it is safe to call on every keystroke.
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
            textInput.value = url;
            updateQR(url);
          });
          $("#open-options").click(function () {
            if (chrome.runtime.openOptionsPage) {
              chrome.runtime.openOptionsPage();
            }
          });
          textInput.addEventListener("input", function () {
            updateQR(textInput.value);
          });
          textInput.addEventListener("keydown", function (event) {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              updateQR(textInput.value);
            }
          });

          textInput.focus();
        }
      );
    });
  },
  false
);
