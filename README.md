# Offline QR Code Generator/Editor

> A fast, ads-free, **fully offline** Chrome extension that turns the current tab URL - or any selected text - into a QR code you can edit and download.

[![CI](https://github.com/doctorlai/simple-qr-code/actions/workflows/ci.yml/badge.svg)](https://github.com/doctorlai/simple-qr-code/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-43853d?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Manifest V3](https://img.shields.io/badge/manifest-v3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kfhbhjigpkcbpmknfomdobahejfajado?logo=googlechrome&logoColor=white&label=web%20store)](https://chrome.google.com/webstore/detail/simple-qr-code-offline-no/kfhbhjigpkcbpmknfomdobahejfajado)
[![Users](https://img.shields.io/chrome-web-store/users/kfhbhjigpkcbpmknfomdobahejfajado?label=users)](https://chrome.google.com/webstore/detail/simple-qr-code-offline-no/kfhbhjigpkcbpmknfomdobahejfajado)
[![Rating](https://img.shields.io/chrome-web-store/rating/kfhbhjigpkcbpmknfomdobahejfajado?label=rating)](https://chrome.google.com/webstore/detail/simple-qr-code-offline-no/kfhbhjigpkcbpmknfomdobahejfajado)
[![License: MIT](https://img.shields.io/github/license/doctorlai/simple-qr-code?color=blue)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Last commit](https://img.shields.io/github/last-commit/doctorlai/simple-qr-code?logo=github)](https://github.com/doctorlai/simple-qr-code/commits)
[![Issues](https://img.shields.io/github/issues/doctorlai/simple-qr-code?logo=github)](https://github.com/doctorlai/simple-qr-code/issues)
[![Stars](https://img.shields.io/github/stars/doctorlai/simple-qr-code?logo=github)](https://github.com/doctorlai/simple-qr-code/stargazers)

![Popup screenshot](screenshot.jpg)

## Features

- **100% offline & fast** - QR codes are generated locally with [`qrcode.js`](https://github.com/davidshimjs/qrcodejs); no network requests, ever.
- **One click** - open the popup to instantly get a QR code for the current tab URL.
- **Context-menu support** - select any text on a page, right-click, and choose _"Create QR Code from Selection or Tab URL"_ to open the popup pre-filled with that text.
- **Inline editing** - edit QR text directly in the popup without modal prompts.
- **Download as PNG** - save generated QR images from the popup.
- **Copy QR text** - copy the current popup text back to your clipboard.
- **Keyboard shortcut** - press `Alt+Shift+Q` to open the popup without reaching for the mouse (re-bind it at `chrome://extensions/shortcuts`).
- **Custom QR colors** - pick any foreground and background color from the options page, with a live preview.
- **Light, dark & auto themes** - choose a theme in the options, or let it follow your system automatically.
- **Clean, ads-free UI** - no author links, no tracking, no nonsense.
- **Localized store listing** - the extension name and description ship in 25 Chrome locales, including English, Chinese, Arabic, Bengali, German, Spanish, French, Hindi, Indonesian, Italian, Japanese, Korean, Dutch, Polish, Portuguese, Russian, Tamil, Telugu, Thai, Turkish, and Vietnamese.

## Install

### From the Chrome Web Store (recommended)

**[Install Offline QR Code Generator/Editor](https://chrome.google.com/webstore/detail/simple-qr-code-offline-no/kfhbhjigpkcbpmknfomdobahejfajado)**

### Load the unpacked extension (for development)

1. Clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Toggle **Developer mode** (top-right).
4. Click **Load unpacked** and select the [`simple-qr-code/`](simple-qr-code) folder.

## Usage

- **Tab URL to QR:** click the toolbar icon. The popup shows a QR code for the current page and updates live as you edit the text. Copy the text, reset to the tab URL, or download the PNG.
- **Selected text to QR:** highlight text on any page, right-click, and choose _"Create QR Code from Selection or Tab URL"_. The popup opens pre-filled with the selected text; if nothing is selected, it uses the current tab URL.
- **Customize colors & theme:** open the extension **Options** to set the QR foreground/background colors and choose an Auto / Light / Dark theme.
- **Keyboard shortcut:** press `Alt+Shift+Q` (configurable at `chrome://extensions/shortcuts`) to open the popup for the current tab.
- **Hide the context menu:** open the extension **Options** and tick _"Hide context menu"_.

## Permissions

This extension asks for the minimum it needs and collects **no data**:

| Permission     | Why it is needed                                                    |
| -------------- | ------------------------------------------------------------------- |
| `activeTab`    | Read the current tab's URL when you open the popup or context menu. |
| `storage`      | Save your preferences (theme, QR colors, context-menu visibility).  |
| `contextMenus` | Add the right-click _"Create QR Code"_ menu item.                   |

## Privacy

This extension is fully offline and collects **no data** - no network requests,
no analytics, no tracking, no ads. The only things it stores are your own
preferences (theme, QR colors, and context-menu visibility). See the full
[Privacy Policy](PRIVACY.md) for details.

## Development

Requires [Node.js](https://nodejs.org/) **>= 18**.

```bash
npm install        # install dev tooling
npm run check      # lint + format check + tests with coverage threshold
npm run build      # package dist/simple-qr-code-v<version>.zip for the Web Store
```

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run lint`         | Lint with ESLint                             |
| `npm run lint:fix`     | Lint and auto-fix                            |
| `npm run format`       | Format with Prettier                         |
| `npm run format:check` | Verify formatting                            |
| `npm test`             | Run Jest unit tests                          |
| `npm run coverage`     | Run tests and enforce the coverage threshold |
| `npm run check`        | Lint + format check + coverage               |
| `npm run build`        | Build the Chrome Web Store zip into `dist/`  |
| `npm run ci`           | `check` followed by `build`                  |

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## Project structure

```
simple-qr-code/        # the unpacked extension (manifest.json at its root)
  js/
    context.js         # MV3 background service worker (context menu)
    qr.js              # popup editor, Copy Text, Download PNG
    lib/qrutils.js     # pure, unit-tested helpers
  _locales/            # i18n message catalogs
  images/              # icons
scripts/build.js       # packages the extension into dist/*.zip
test/                  # Jest unit tests
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and run
`npm run check` before opening a pull request.

## Support / Sponsor

If this extension is useful to you, consider buying the author a coffee:

- [Buy me a coffee](https://buymeacoffee.com/y0btg5r)
- [PayPal](https://www.paypal.me/doctorlai/3)
- [GitHub Sponsors / Patreon](https://github.com/doctorlai)

## License

[MIT](LICENSE) (c) Zhihua Lai ([justyy](https://justyy.com))

## Resources

- Online tools: <https://helloacm.com/tools/>
- How QR images are generated: <https://helloacm.com/how-to-generate-qr-image-using-google-api/>
- Chrome Web Store listing: <https://chrome.google.com/webstore/detail/simple-qr-code-offline-no/kfhbhjigpkcbpmknfomdobahejfajado>
