(function () {
  "use strict";

  var utils = (typeof self !== "undefined" && self.QRUtils) || {};
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

  var colorDarkInput = document.getElementById("color-dark");
  var colorLightInput = document.getElementById("color-light");
  var hideMenuInput = document.getElementById("hide-menu");
  var resetButton = document.getElementById("reset-colors");
  var previewContainer = document.getElementById("preview");
  var statusEl = document.getElementById("status");
  var versionEl = document.getElementById("version");
  var themeInputs = Array.prototype.slice.call(
    document.querySelectorAll('input[name="theme"]')
  );

  var statusTimer = 0;

  function getSelectedTheme() {
    for (var i = 0; i < themeInputs.length; i++) {
      if (themeInputs[i].checked) {
        return themeInputs[i].value;
      }
    }
    return "auto";
  }

  function applyTheme(theme) {
    var normalized = normalizeTheme(theme);
    if (normalized === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", normalized);
    }
  }

  function renderPreview() {
    var dark = normalizeHexColor(colorDarkInput.value, DEFAULTS.qrColorDark);
    var light = normalizeHexColor(colorLightInput.value, DEFAULTS.qrColorLight);
    previewContainer.innerHTML = "";
    new QRCode(previewContainer, {
      text: "https://github.com/doctorlai/simple-qr-code",
      width: 180,
      height: 180,
      colorDark: dark,
      colorLight: light,
      correctLevel: QRCode.CorrectLevel.H,
    });
  }

  function flashStatus(message) {
    statusEl.textContent = message;
    if (statusTimer) {
      clearTimeout(statusTimer);
    }
    statusTimer = setTimeout(function () {
      statusEl.textContent = "";
    }, 1500);
  }

  function save() {
    chrome.storage.sync.set(
      {
        theme: normalizeTheme(getSelectedTheme()),
        qrColorDark: normalizeHexColor(
          colorDarkInput.value,
          DEFAULTS.qrColorDark
        ),
        qrColorLight: normalizeHexColor(
          colorLightInput.value,
          DEFAULTS.qrColorLight
        ),
        hidemenu: !!hideMenuInput.checked,
      },
      function () {
        flashStatus("Saved");
      }
    );
  }

  function onThemeChange() {
    applyTheme(getSelectedTheme());
    save();
  }

  function onColorChange() {
    renderPreview();
    save();
  }

  chrome.storage.sync.get(
    ["theme", "qrColorDark", "qrColorLight", "hidemenu"],
    function (stored) {
      var data = stored || {};
      var theme = normalizeTheme(data.theme);

      colorDarkInput.value = normalizeHexColor(
        data.qrColorDark,
        DEFAULTS.qrColorDark
      );
      colorLightInput.value = normalizeHexColor(
        data.qrColorLight,
        DEFAULTS.qrColorLight
      );
      hideMenuInput.checked = !!data.hidemenu;
      for (var i = 0; i < themeInputs.length; i++) {
        themeInputs[i].checked = themeInputs[i].value === theme;
      }

      applyTheme(theme);
      renderPreview();
    }
  );

  themeInputs.forEach(function (input) {
    input.addEventListener("change", onThemeChange);
  });
  colorDarkInput.addEventListener("input", renderPreview);
  colorDarkInput.addEventListener("change", onColorChange);
  colorLightInput.addEventListener("input", renderPreview);
  colorLightInput.addEventListener("change", onColorChange);
  hideMenuInput.addEventListener("change", save);
  resetButton.addEventListener("click", function () {
    colorDarkInput.value = DEFAULTS.qrColorDark;
    colorLightInput.value = DEFAULTS.qrColorLight;
    renderPreview();
    save();
  });

  var manifest = chrome.runtime.getManifest();
  versionEl.textContent = "v" + manifest.version;
})();
