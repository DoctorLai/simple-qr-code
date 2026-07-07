# Security Policy

## Supported versions

The latest version published on the Chrome Web Store and the `main` branch
receive security updates. Older releases are not maintained.

| Version | Supported |
| ------- | --------- |
| 1.3.x   | ✅        |
| < 1.3   | ❌        |

## Reporting a vulnerability

Please report security issues **privately** — do **not** open a public issue,
pull request, or discussion for anything security-sensitive.

- **Preferred:** open a private
  [GitHub Security Advisory](https://github.com/doctorlai/simple-qr-code/security/advisories/new).
- **Alternatively:** email **dr.zhihua.lai@gmail.com** with the details.

Where possible, please include:

- a description of the issue and its impact,
- steps to reproduce (a minimal proof of concept helps),
- the affected version(s), and
- any suggested remediation.

## What to expect

- Acknowledgement of your report as soon as reasonably possible.
- An initial assessment and, where the report is accepted, a fix or mitigation
  plan.
- Credit for responsible disclosure if you would like it.

Please give us a reasonable amount of time to address the issue before any
public disclosure.

## Scope

This is a **fully offline** Manifest V3 Chrome extension. It makes no network
requests, loads no remote code, and collects no user data (see
[PRIVACY.md](PRIVACY.md)). Relevant concerns include, for example:

- ways the extension could exfiltrate data or make unexpected network requests,
- unsafe handling of page content, text selections, or tab URLs,
- injection issues (XSS and similar) in the popup or options pages, and
- supply-chain risks in the bundled third-party libraries.

Thank you for helping keep users safe.
