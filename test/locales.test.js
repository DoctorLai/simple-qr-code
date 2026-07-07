"use strict";

const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "..", "simple-qr-code", "_locales");
const requiredKeys = ["appName", "appShortName", "appDesc", "appTitle"];

describe("extension locales", () => {
  const localeNames = fs
    .readdirSync(localesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  test("includes broad locale coverage", () => {
    expect(localeNames.length).toBeGreaterThanOrEqual(29);
  });

  test.each(localeNames)("%s includes manifest message keys", (localeName) => {
    const messagesPath = path.join(localesDir, localeName, "messages.json");
    const messages = JSON.parse(fs.readFileSync(messagesPath, "utf8"));

    for (const key of requiredKeys) {
      expect(messages).toHaveProperty(key);
      expect(typeof messages[key].message).toBe("string");
      expect(messages[key].message.trim().length).toBeGreaterThan(0);
    }
  });

  test("every locale directory uses a valid Chrome locale code", () => {
    for (const name of localeNames) {
      expect(name).toMatch(/^[a-z]{2,3}(_[A-Za-z0-9]+)?$/);
    }
  });

  test.each(localeNames)(
    "%s has a non-empty string message for every key",
    (localeName) => {
      const messagesPath = path.join(localesDir, localeName, "messages.json");
      const messages = JSON.parse(fs.readFileSync(messagesPath, "utf8"));

      for (const key of Object.keys(messages)) {
        expect(typeof messages[key].message).toBe("string");
        expect(messages[key].message.trim().length).toBeGreaterThan(0);
      }
    }
  );
});
