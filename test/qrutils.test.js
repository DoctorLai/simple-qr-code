"use strict";

const {
  pickQrText,
  sanitizeFilename,
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

  test("truncates very long input to 64 characters", () => {
    const out = sanitizeFilename("a".repeat(200));
    expect(out).toBe("a".repeat(64) + ".png");
  });
});
