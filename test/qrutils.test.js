"use strict";

const {
  pickQrText,
  sanitizeFilename,
  normalizeHexColor,
  normalizeTheme,
  DEFAULTS,
} = require("../simple-qr-code/js/lib/qrutils");

describe("pickQrText", () => {
  test("prefers a non-empty selection over the tab URL", () => {
    expect(
      pickQrText({ selectionText: "hello" }, { url: "https://example.com" })
    ).toBe("hello");
  });

  test("preserves the original (untrimmed) selection text", () => {
    expect(pickQrText({ selectionText: "  hi  " }, { url: "u" })).toBe(
      "  hi  "
    );
  });

  test("falls back to the tab URL when the selection is blank", () => {
    expect(
      pickQrText({ selectionText: "   " }, { url: "https://example.com" })
    ).toBe("https://example.com");
    expect(pickQrText({}, { url: "https://example.com" })).toBe(
      "https://example.com"
    );
  });

  test("returns an empty string when nothing usable is available", () => {
    expect(pickQrText(null, null)).toBe("");
    expect(pickQrText({ selectionText: "" }, {})).toBe("");
    expect(pickQrText(undefined, undefined)).toBe("");
  });

  test("ignores a non-string selection and falls back to the tab URL", () => {
    expect(pickQrText({ selectionText: 123 }, { url: "https://x.dev" })).toBe(
      "https://x.dev"
    );
  });

  test("ignores a non-string tab URL", () => {
    expect(pickQrText({}, { url: 42 })).toBe("");
  });
});

describe("sanitizeFilename", () => {
  test("appends a .png extension", () => {
    expect(sanitizeFilename("hello")).toBe("hello.png");
  });

  test("strips the protocol and replaces unsafe characters", () => {
    expect(sanitizeFilename("https://example.com/path?q=1")).toBe(
      "example.com_path_q_1.png"
    );
  });

  test("trims leading/trailing separators", () => {
    expect(sanitizeFilename("...weird...")).toBe("weird.png");
  });

  test("uses the fallback when the input yields nothing", () => {
    expect(sanitizeFilename("", "fallback")).toBe("fallback.png");
    expect(sanitizeFilename("   ")).toBe("qrcode.png");
    expect(sanitizeFilename(null)).toBe("qrcode.png");
    expect(sanitizeFilename(undefined)).toBe("qrcode.png");
  });

  test("uses the default name when the fallback is also empty", () => {
    expect(sanitizeFilename("", "")).toBe("qrcode.png");
  });

  test("truncates very long input to 64 characters", () => {
    const out = sanitizeFilename("a".repeat(200));
    expect(out).toBe("a".repeat(64) + ".png");
  });
});

describe("normalizeHexColor", () => {
  test("accepts and lowercases a 6-digit hex", () => {
    expect(normalizeHexColor("#1769AA")).toBe("#1769aa");
    expect(normalizeHexColor("#abcdef")).toBe("#abcdef");
  });

  test("expands 3-digit shorthand to 6 digits", () => {
    expect(normalizeHexColor("#f0a")).toBe("#ff00aa");
    expect(normalizeHexColor("#FFF")).toBe("#ffffff");
  });

  test("trims surrounding whitespace", () => {
    expect(normalizeHexColor("  #000000  ")).toBe("#000000");
  });

  test("falls back when the value is not a valid hex color", () => {
    expect(normalizeHexColor("rgb(0,0,0)", "#ffffff")).toBe("#ffffff");
    expect(normalizeHexColor("#12345", "#abcdef")).toBe("#abcdef");
    expect(normalizeHexColor("nonsense")).toBe("#000000");
  });

  test("falls back for non-string input", () => {
    expect(normalizeHexColor(null, "#123456")).toBe("#123456");
    expect(normalizeHexColor(undefined)).toBe("#000000");
    expect(normalizeHexColor(42)).toBe("#000000");
  });

  test("ignores an invalid fallback and uses black", () => {
    expect(normalizeHexColor("bad", "also-bad")).toBe("#000000");
  });

  test("normalizes a valid uppercase fallback to lowercase", () => {
    expect(normalizeHexColor("nope", "#ABCDEF")).toBe("#abcdef");
  });
});

describe("normalizeTheme", () => {
  test("passes through supported themes", () => {
    expect(normalizeTheme("light")).toBe("light");
    expect(normalizeTheme("dark")).toBe("dark");
    expect(normalizeTheme("auto")).toBe("auto");
  });

  test("defaults unknown values to auto", () => {
    expect(normalizeTheme("solarized")).toBe("auto");
    expect(normalizeTheme("")).toBe("auto");
    expect(normalizeTheme(undefined)).toBe("auto");
    expect(normalizeTheme(null)).toBe("auto");
  });
});

describe("DEFAULTS", () => {
  test("exposes the default settings", () => {
    expect(DEFAULTS).toEqual({
      theme: "auto",
      qrColorDark: "#000000",
      qrColorLight: "#ffffff",
    });
  });
});
