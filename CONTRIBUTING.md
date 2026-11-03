# Contributing to Good Signal

Thank you for helping improve Good Signal. Contributions can improve the app, its documentation, and the accuracy or clarity of its guides.

## Before you start

- For a bug or feature idea, check existing issues and open an issue using the appropriate template before starting substantial work.
- For a guide correction, include the device category and guide version. If you are making a device-specific claim, include the exact model, region, software or firmware version, and an authoritative source that supports it.
- Do not include private information, account details, or another person's device data in an issue or pull request.
- For a security vulnerability, follow [SECURITY.md](SECURITY.md); do not report it in a public issue.

## Development

Good Signal is a static web app. Its app shell is in the repository root; there is no package installation or build step. You can preview it with any local static HTTP server, then open the served address in a browser. The service worker and offline behavior require an HTTP(S) origin; opening `index.html` directly from the file system is not a complete test.

The repository includes `browser-check.cjs` and `performance-check.cjs` for browser-based checks. They require a local Chromium/Playwright setup and are not a substitute for checking the specific user flow changed. When changing code, data, or guides, describe the checks you ran and any relevant browser limitations in your pull request.

## Guide content

Guide accuracy is a safety and trust requirement. Read [Guide Coverage and Maintenance](docs/Guide-Coverage-and-Maintenance.md) before editing `guide-catalog.json`. In particular:

- Keep category-wide guidance clearly generic; do not imply that a feature exists on every device in a category.
- Publish model-specific instructions only with reviewed manufacturer documentation and the model, region, software/firmware, sources, review date, and tradeoffs required by the maintenance policy.
- Avoid unsupported surveillance claims and guarantees that a device is private or secure.
- Preserve stable step IDs and update the catalog version, migration log, and review date when changing guide content.
- Keep user-entered data local; do not add analytics, telemetry, or data uploads without updating the product's privacy disclosures and obtaining project approval.

## Pull requests

1. Make a focused change on a branch.
2. Keep documentation and user-facing privacy or guide claims in sync with behavior.
3. Run relevant checks available for your change. Do not claim browser coverage you did not perform.
4. Open a pull request using the provided template. Explain the user impact, summarize the change, and list checks and remaining limitations.

By submitting a contribution, you agree that it is provided under the [MIT License](LICENSE).
