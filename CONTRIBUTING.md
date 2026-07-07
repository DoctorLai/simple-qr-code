# Contributing

Thanks for your interest in improving the **Offline QR Code Generator/Editor**!

## Prerequisites

- [Node.js](https://nodejs.org/) **>= 18** and npm

## Getting started

```bash
git clone https://github.com/doctorlai/simple-qr-code.git
cd simple-qr-code
npm install
```

## Project layout

```
simple-qr-code/        # the unpacked extension (manifest.json lives here)
  js/                  # extension scripts
    lib/qrutils.js     # pure, unit-tested helpers
  _locales/            # i18n message catalogs
  images/              # icons
scripts/build.js       # packages the extension into dist/*.zip
test/                  # Jest unit tests
```

## Useful scripts

| Command                | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| `npm run lint`         | Lint all source with ESLint                            |
| `npm run lint:fix`     | Lint and auto-fix where possible                       |
| `npm run format`       | Format the codebase with Prettier                      |
| `npm run format:check` | Verify formatting without writing                      |
| `npm test`             | Run the Jest unit tests                                |
| `npm run coverage`     | Run tests and enforce the coverage threshold           |
| `npm run check`        | Lint + format check + coverage (run before committing) |
| `npm run build`        | Produce `dist/simple-qr-code-v<version>.zip`           |
| `npm run ci`           | `check` followed by `build`                            |

## Loading the extension locally

1. Run `npm run build` (or just use the `simple-qr-code/` folder directly).
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the `simple-qr-code/` folder.

## Submitting changes

1. Create a feature branch.
2. Make your change and add/adjust tests where it makes sense.
3. Run `npm run check` and make sure it passes.
4. If you changed behaviour, bump the `version` in both
   [`simple-qr-code/manifest.json`](simple-qr-code/manifest.json) and
   [`package.json`](package.json).
5. Open a pull request with a clear description of the change.

## Coding style

- Formatting is handled by **Prettier** - run `npm run format` before pushing.
- Keep [`simple-qr-code/js/lib/qrutils.js`](simple-qr-code/js/lib/qrutils.js)
  free of `chrome.*` and DOM access so it stays pure and testable.

## Adding or updating a translation

The store listing is localized through Chrome's i18n system under
[`simple-qr-code/_locales/`](simple-qr-code/_locales). Each locale is a folder
named with its Chrome locale code (for example `en`, `fr`, `zh_CN`) containing a
single `messages.json`.

To add a language:

1. Create `simple-qr-code/_locales/<locale>/messages.json`.
2. Provide at least the `appName`, `appShortName`, `appDesc`, and `appTitle`
   messages (missing keys fall back to the `en` default locale).
3. Keep the technical tokens `QR` and `URL` as-is; translate the words around
   them.
4. Run `npm run check` - the locale test suite validates every catalog.

## Reporting security issues

Please do not file public issues for security problems. Follow the
[Security Policy](SECURITY.md) to disclose vulnerabilities privately.

By contributing you agree that your contributions are licensed under the
project's [MIT License](LICENSE).
