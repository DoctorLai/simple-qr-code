#!/usr/bin/env node
"use strict";

/**
 * Build script: package the extension into a Chrome Web Store-ready zip.
 *
 * The archive contains the CONTENTS of `simple-qr-code/` (so `manifest.json`
 * sits at the zip root, which is what the Chrome Web Store expects) and is
 * written to `dist/simple-qr-code-v<version>.zip`.
 */

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "simple-qr-code");
const distDir = path.join(root, "dist");

const manifestPath = path.join(sourceDir, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const version = manifest.version;

const zipName = `simple-qr-code-v${version}.zip`;
const outPath = path.join(distDir, zipName);

fs.mkdirSync(distDir, { recursive: true });
if (fs.existsSync(outPath)) {
  fs.unlinkSync(outPath);
}

const output = fs.createWriteStream(outPath);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  const kb = (archive.pointer() / 1024).toFixed(1);
  console.log(`Created ${path.relative(root, outPath)} (${kb} KB)`);
});

archive.on("warning", (err) => {
  if (err.code === "ENOENT") {
    console.warn(err.message);
  } else {
    throw err;
  }
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);
archive.glob("**/*", {
  cwd: sourceDir,
  ignore: ["**/.DS_Store", "**/Thumbs.db"],
  dot: false,
});
archive.finalize();
