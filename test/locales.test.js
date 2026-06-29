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
    expect(localeNames.length).toBeGreaterThanOrEqual(25);
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
});
