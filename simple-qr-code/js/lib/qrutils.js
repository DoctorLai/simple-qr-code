/**
 * Shared, dependency-free helpers for the Offline QR Code Generator/Editor.
 *
 * Written in a small UMD wrapper so the same file can be:
 *   - imported by the MV3 service worker via importScripts("lib/qrutils.js")
 *   - loaded in extension pages (popup/options) via a <script> tag
 *   - required by the Jest unit tests in Node
 *
 * It must NOT reference chrome.* or the DOM so it stays pure and testable.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  /* istanbul ignore next: browser/service-worker global, not exercised under Node */
  if (typeof self !== "undefined" && self) {
    // Service worker / browser global scope.
    self.QRUtils = api;
  }
  if (typeof module !== "undefined" && module.exports) {
    // Node / Jest.
    module.exports = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /**
   * Decide which text should be encoded into a QR code given a context-menu
   * click. Prefers the user's selection, falling back to the tab URL.
   *
   * @param {{selectionText?: string}} info  contextMenus.onClicked info object
   * @param {{url?: string}} tab             the tab the menu was invoked on
   * @returns {string} the text to encode (empty string when nothing usable)
   */
  function pickQrText(info, tab) {
    if (info && typeof info.selectionText === "string") {
      var selection = info.selectionText.trim();
      if (selection.length > 0) {
        return info.selectionText;
      }
    }
    if (tab && typeof tab.url === "string") {
      return tab.url;
    }
    return "";
  }

  /**
   * Turn arbitrary QR text into a safe ".png" download filename.
   *
   * @param {string} text       the encoded text (may be a URL or free text)
   * @param {string} [fallback] name to use when text yields nothing usable
   * @returns {string} a filesystem-safe filename ending in ".png"
   */
  function sanitizeFilename(text, fallback) {
    var base = (text == null ? "" : String(text))
      .trim()
      .replace(/^[a-z]+:\/\//i, "") // drop protocol for nicer URL filenames
      .replace(/[^a-z0-9._-]+/gi, "_")
      .replace(/^[._-]+|[._-]+$/g, "")
      .slice(0, 64);
    if (base.length === 0) {
      base = String(fallback || "qrcode");
    }
    return base + ".png";
  }

  /** Default user-configurable settings. */
  var DEFAULTS = {
    theme: "auto",
    qrColorDark: "#000000",
    qrColorLight: "#ffffff",
  };

  /**
   * Validate and normalize a CSS hex color into lowercase "#rrggbb" form.
   * Accepts "#rgb" shorthand (expanded) and is case-insensitive. Anything
   * invalid returns the provided fallback (or black).
   *
   * @param {unknown} value      the candidate color
   * @param {string} [fallback]  value to use when `value` is not a valid hex
   * @returns {string} a normalized "#rrggbb" color
   */
  function normalizeHexColor(value, fallback) {
    var fb =
      typeof fallback === "string" && /^#[0-9a-f]{6}$/i.test(fallback)
        ? fallback.toLowerCase()
        : "#000000";
    if (typeof value !== "string") {
      return fb;
    }
    var v = value.trim();
    var short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v);
    if (short) {
      return (
        "#" +
        short[1] +
        short[1] +
        short[2] +
        short[2] +
        short[3] +
        short[3]
      ).toLowerCase();
    }
    if (/^#[0-9a-f]{6}$/i.test(v)) {
      return v.toLowerCase();
    }
    return fb;
  }

  /**
   * Normalize a theme preference to one of the supported values.
   *
   * @param {unknown} value  the candidate theme
   * @returns {"auto"|"light"|"dark"} a supported theme (defaults to "auto")
   */
  function normalizeTheme(value) {
    return value === "light" || value === "dark" ? value : "auto";
  }

  return {
    pickQrText: pickQrText,
    sanitizeFilename: sanitizeFilename,
    normalizeHexColor: normalizeHexColor,
    normalizeTheme: normalizeTheme,
    DEFAULTS: DEFAULTS,
  };
});
