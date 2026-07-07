"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const extDir = path.join(root, "simple-qr-code");

const manifest = JSON.parse(
  fs.readFileSync(path.join(extDir, "manifest.json"), "utf8")
);
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8")
);

describe("manifest.json", () => {
  test("is a Manifest V3 extension", () => {
    expect(manifest.manifest_version).toBe(3);
  });

  test("version matches package.json", () => {
    expect(manifest.version).toBe(pkg.version);
  });

  test("uses a semantic version string", () => {
    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test("requests only the documented, minimal permissions", () => {
    expect([...manifest.permissions].sort()).toEqual(
      ["activeTab", "contextMenus", "storage"].sort()
    );
  });

  test("declares no host permissions (stays fully offline)", () => {
    expect(manifest.host_permissions).toBeUndefined();
  });

  test("default_locale has a matching _locales directory", () => {
    const messages = path.join(
      extDir,
      "_locales",
      manifest.default_locale,
      "messages.json"
    );
    expect(fs.existsSync(messages)).toBe(true);
  });

  test("references files that exist on disk", () => {
    const referenced = [
      manifest.action.default_popup,
      manifest.options_page,
      manifest.background.service_worker,
      ...Object.values(manifest.icons),
      ...Object.values(manifest.action.default_icon),
    ];
    for (const rel of referenced) {
      expect(fs.existsSync(path.join(extDir, rel))).toBe(true);
    }
  });

  test("localized manifest fields use __MSG_ placeholders", () => {
    for (const field of [
      manifest.name,
      manifest.short_name,
      manifest.description,
    ]) {
      expect(field).toMatch(/^__MSG_[A-Za-z]+__$/);
    }
  });
});
