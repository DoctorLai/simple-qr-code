# Privacy Policy

**Extension:** Offline QR Code Generator/Editor
**Developer:** Zhihua Lai ([justyy](https://steemyy.com))
**Contact:** dr.zhihua.lai@gmail.com
**Last updated:** 30 June 2026

## Summary

Offline QR Code Generator/Editor is a **fully offline** browser extension. It
generates QR codes entirely on your own device. It does **not** collect, store,
transmit, sell, or share any personal or sensitive user data. It makes **no
network requests**, contains **no analytics or tracking**, and shows **no ads**.

## What data the extension accesses

To do its one job — turning text or a page URL into a QR code — the extension
processes the following **only on your device** and **only when you ask it to**:

- **The active tab's URL** — read when you open the popup or click the
  right-click context-menu item, so it can generate a QR code for the current
  page.
- **Text you select** — read when you highlight text on a page and choose
  _"Create QR Code from Selection or Tab URL"_, so it can generate a QR code for
  that text.

This information is used immediately to render a QR image and is **never sent
anywhere**. It is not logged, not retained, and not transmitted off your device.
When you use the context menu, the selected text or tab URL is held briefly in
Chrome extension session storage so the popup can open pre-filled, then it is
cleared immediately. This session value is not synced and does not survive a
browser restart.

## What data the extension stores

The extension stores only your own non-personal preferences:

- **`theme`** — your interface theme choice (`auto`, `light`, or `dark`).
- **`qrColorDark`** / **`qrColorLight`** — the foreground and background colors
  you pick for your QR codes.
- **`hidemenu`** — whether you chose to hide the right-click context-menu item.

These preferences are saved using Chrome's `chrome.storage.sync` API. They
contain **no personal data** — only your settings. If you are signed in to
Chrome, Chrome may sync these settings across your devices; that
synchronization is handled by Google and governed by
[Google's Privacy Policy](https://policies.google.com/privacy).

## Clipboard and downloads

- **Copy Text** writes the current QR text to your clipboard, only when you click
  the copy control.
- **Download PNG** saves the generated QR image to your device, only when you
  click the download control.

Neither action sends any data over the network.

## Data sharing and transmission

The extension does **not**:

- make any network or server requests;
- use any third-party analytics, advertising, or tracking services;
- collect personally identifiable information;
- sell or share any user data with anyone.

All QR generation happens locally using the bundled
[`qrcode.js`](https://github.com/davidshimjs/qrcodejs) library.

## Permissions

| Permission     | Why it is needed                                                    |
| -------------- | ------------------------------------------------------------------- |
| `activeTab`    | Read the current tab's URL when you open the popup or context menu. |
| `storage`      | Save the preferences described above (theme, QR colors, menu).      |
| `contextMenus` | Add the right-click _"Create QR Code"_ menu item.                   |

The extension requests the minimum permissions required for these features and
uses them for no other purpose.

## Children's privacy

The extension does not collect any data and is not directed at children. No
personal information is gathered from users of any age.

## Changes to this policy

If this policy changes, the updated version will be published at this same
location with a revised "Last updated" date. Material changes will be reflected
in the extension's release notes.

## Contact

Questions about this privacy policy can be sent to **dr.zhihua.lai@gmail.com**
or raised as an issue on the
[project repository](https://github.com/doctorlai/simple-qr-code).
