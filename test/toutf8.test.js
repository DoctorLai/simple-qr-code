"use strict";

const { utf16to8 } = require("../simple-qr-code/js/toutf8");

describe("utf16to8", () => {
  test("returns an empty string unchanged", () => {
    expect(utf16to8("")).toBe("");
  });

  test("passes 7-bit ASCII through unchanged", () => {
    expect(utf16to8("Hello, World!")).toBe("Hello, World!");
  });

  test("encodes 2-byte code points (U+00A9 ©)", () => {
    expect(utf16to8("\u00A9")).toBe("\xC2\xA9");
  });

  test("encodes 3-byte code points (U+4E2D 中)", () => {
    expect(utf16to8("\u4E2D")).toBe("\xE4\xB8\xAD");
  });

  test("encodes a mixed string", () => {
    expect(utf16to8("A中")).toBe("A\xE4\xB8\xAD");
  });
});
