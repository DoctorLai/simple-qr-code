"use strict";

const globals = require("globals");

/**
 * Flat ESLint config.
 *
 * Two file groups:
 *   1. Extension runtime code  -> browser + service worker + webextension globals
 *   2. Tooling / tests         -> Node + Jest globals
 *
 * Minified third-party bundles (jQuery, qrcode) are ignored.
 */
module.exports = [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "simple-qr-code/js/jquery.js",
      "simple-qr-code/js/qrcode.min.js",
    ],
  },
  {
    files: ["simple-qr-code/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        ...globals.webextensions,
        $: "readonly",
        jQuery: "readonly",
        QRCode: "readonly",
        QRUtils: "readonly",
        module: "writable",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
    },
  },
  {
    files: ["scripts/**/*.js", "test/**/*.js", "*.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
    },
  },
];
