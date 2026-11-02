# Good Signal PWA Readiness Checklist

Working checklist for taking the current PWA prototype to an SRS-aligned release. Checked items indicate that the capability is present in the current prototype; they do not imply full cross-browser acceptance testing.

## PWA foundation already present

- [x] Serve the published app over HTTPS.
- [x] Include a web app manifest with app name, start URL, standalone display mode, theme colors, and icons.
- [x] Cache the app shell and generic category guides with a service worker.
- [x] Support local device inventory and offline checklist editing after the app has been cached.
- [x] Show connectivity/offline status.
- [x] Provide local data export, validated import, and deletion controls.
- [x] Explain how to install the app when a browser install prompt is unavailable.
- [x] Keep the app usable in a regular browser tab.

## 1. Guide coverage and editorial process

- [x] Confirm initial device-category, manufacturer, and model coverage. See [guide coverage and maintenance](Guide-Coverage-and-Maintenance.md): 12 generic categories, no verified manufacturers or models.
- [x] Keep generic category guidance clearly labeled as generic and not model-verified.
- [x] Publish model-specific instructions only after reviewing supporting manufacturer documentation. The editorial gate is documented; no model-specific instructions are currently published.
- [x] For each model-specific guide, record applicable model/region/firmware details, sources, review date, guide version, and known functionality tradeoffs. The required record is defined; there are currently no model-specific guides.
- [x] Label device capabilities as verified, unverified, or unknown; avoid unsupported surveillance or privacy-guarantee claims.
- [ ] Provide a way for users to report outdated or incorrect guide content. The app now prepares shareable/downloadable reports, but direct submission needs a configured support inbox or endpoint.
- [x] Establish an owner and review schedule for guide maintenance. Good Signal project maintainer; quarterly, and after reports or relevant source/manufacturer changes.

## 2. Guide updates and offline availability

- [x] Add a maintained, versioned guide source at `Mockups/still/dist/guide-catalog.json`; guide updates have a separate check from app/service-worker updates.
- [x] Let users save available verified model-specific guides offline from the matching device screen. The current catalog contains none, so no model guide is available to save yet.
- [x] Explain that generic guide text is cached while external manufacturer documentation links require an internet connection.
- [x] Show guide version and review date on guide cards, guide details, and Offline Access settings.
- [x] Reconcile guide changes using stable step identifiers:
  - [x] Keep progress for unchanged steps.
  - [x] Start new steps as not started.
  - [x] Mark materially changed steps for user review while retaining their saved status and notes.
  - [x] Preserve removed step details, prior status, and notes in device guide history.
- [x] Summarize material guide changes without silently changing a user's recorded progress.

## 3. Local data and recovery

- [x] Use IndexedDB for inventory, checklist progress, notes, and saved model-guide metadata.
- [x] Migrate existing `still-v1` LocalStorage records on first launch. A browser preview confirmed a legacy device, progress note, and saved-guide metadata survive migration and export.
- [x] Set a 20 MB Good Signal data limit, show usage in Settings, and warn when usage reaches 80%; show the browser's estimated origin usage separately when supported.
- [x] Keep the last committed IndexedDB record intact when a write fails; retain current edits in memory and prevent accidental navigation while a save error is active.
- [x] Keep offline cache clearing separate from device-data deletion. A browser preview confirmed the device list remains after the offline cache is cleared.
- [x] Show actionable save errors with Retry and Export backup. A simulated IndexedDB write failure displayed the recovery message and controls; Retry re-attempted the save.
- [x] Explain that browser storage may be cleared or evicted, backups are user-managed files, and local data is not encrypted.
- [x] Check import validation, replacement confirmation, restoration, and full deletion in a browser preview. Invalid JSON was rejected without replacing saved data; a valid backup restored after confirmation; full deletion returned the device list to empty.

## 4. Safe app updates

- [x] Replace immediate service-worker activation with a safe update flow. The new shell installs in the background; activation waits for the user to choose the update after saves finish and any active device checklist is left.
- [x] Show an update-ready notice with “Save & update” and “Later” actions.
- [x] Verify an update-ready state is held while a device checklist is open, then applies after leaving it. A browser preview confirmed the device and checklist review count remained after activation and reload; the update stayed blocked while the checklist was open.
- [x] Verify the new worker checks that every shell asset is cached before deleting older shell caches; the updated app loaded after activation in the browser preview.

## 5. Privacy, security, and content accuracy

- [x] Verify device inventory, notes, and progress are never sent to application servers or analytics. Static review found only same-origin requests for the app shell and guide catalog; no analytics, telemetry, or data-upload code is present.
- [x] Verify the app does not request microphone, camera, location, Bluetooth, or local-network permissions. Static review found no permission-request APIs; the app uses browser storage, service workers, connectivity state, and downloads only.
- [ ] Review CSP and other security headers on the published site. The published document’s CSP and `no-referrer` policy were reviewed. The owner-private site returns 401 to unauthenticated header inspection, so response headers such as `Permissions-Policy`, `X-Content-Type-Options`, and frame protections remain unverified.
- [x] Confirm user-entered notes and imported data render as text and cannot execute as code. Notes and device fields are HTML-escaped; imported guide-update counts are now escaped too. Import validation restricts record structure and status values.
- [x] Review privacy/tradeoff language and state clearly that checklist completion is not a privacy or security certification. Guide/settings copy now says this explicitly and identifies the generic-guide and unencrypted-local-storage limits.
- [x] Publish user-facing privacy information and known product limitations in Settings, including ordinary hosting requests, no app analytics/cloud sync, external-site practices, device-permission limits, and local-data limitations.

## 6. Accessibility and browser support

- [ ] Complete a full WCAG 2.2 AA accessibility review. A focused review is complete in local Chrome desktop, Safari on macOS, and the in-app browser; screen-reader and cross-platform coverage remain.
- [ ] Test keyboard-only navigation, visible focus, dialogs, forms, status messages, and screen-reader announcements.
  - [x] In Chrome, keyboard traversal reached the visible Skip to content link and showed a focus indicator. The guide-report dialog had an accessible label, kept Tab focus inside, closed with Escape, and returned focus to its trigger. Add-device fields had labels; required Manufacturer and Model fields blocked submission, and focus moved to Manufacturer. Progress feedback uses a status role and save errors use an alert role.
  - [ ] Verify screen-reader announcements; they remain unrun.
- [ ] Check color contrast, text resizing/zoom, reduced-motion behavior, and small touch targets.
  - [x] Palette contrast was previously checked. At 200% browser zoom, Chrome had no horizontal overflow across Home, My Devices, Guides, Settings, and a guide detail.
  - [x] Chrome honored `prefers-reduced-motion: reduce`; button transition duration was 0 seconds.
  - [x] At 320 and 390 CSS px, visible interactive targets were at least 24 px high/wide or passed the spacing exception. “How to read guide status” is 22.4 px high; its center is 79.4 px from the nearest other target.
  - [ ] Text-only resizing remains untested.
- [x] Verify layouts from 320 CSS pixels through desktop widths without unintended horizontal scrolling. Checked home, devices, guides, a guide, and settings at 320, 390, 600, 768, 1024, and 1440 CSS pixels in local previews.
- [ ] Test current stable Chrome on Android and desktop, Safari on iOS and macOS, Edge on desktop, and Firefox on desktop.
  - [x] Chrome desktop and Safari on macOS were checked previously.
  - [x] Safari on iOS 27.0 was smoke-checked in the iPhone 17e Simulator: Home and Guides rendered from the live GitHub Pages app.
  - [ ] Chrome on Android, Edge, and Firefox remain untested. Edge and Firefox are not installed here; the Android 37 emulator stayed offline in ADB on this 8 GB Mac.
- [ ] Verify both browser-tab and installed standalone experiences; document platform-specific install limitations.
  - [x] Chrome’s install prompt displayed the Good Signal icon. The installed Chrome app was verified with its local preview server stopped: cached Home loaded and navigation worked for My Devices, Guides, a guide detail, and Settings.
  - [x] The iOS 27.0 Simulator loaded the live Home and Guides screens in Safari browser tabs.
  - [ ] Android install, iOS Add to Home Screen, and iOS standalone launch remain untested. Platform install paths: Chrome on Android offers Install (or Install and create shortcut) from the menu ([Google Chrome Help](https://support.google.com/chrome/answer/9658361)); Safari on iPhone supports Add to Home Screen and Open as Web App ([Apple Support](https://support.apple.com/en-gb/guide/iphone/iphea86e5236/27/ios/27)).

## 7. Performance and acceptance testing

- [ ] Measure cached app-shell launch under 2 seconds on the SRS mid-range Android reference device. Desktop Chrome mobile emulation at 412×915 CSS px, DPR 2.6, and 4× CPU throttling: 5 cached offline launches were 54.7, 56.0, 55.1, 54.8, and 57.4 ms (median 55.1 ms). This is a desktop emulation result; the Android reference-device measurement is still required.
- [ ] Measure ordinary checklist saves under 500 ms on the SRS reference device. In the same desktop emulation and 50-device fixture, seven IndexedDB save measurements were 23.5, 22.3, 22.6, 22.8, 22.8, 23.1, and 25.5 ms (median 22.8 ms). The real Android reference-device measurement remains open.
- [x] Verify the compressed initial shell stays under 500 KB, excluding optional guide content. Summed gzip-compressed sizes for the 10 required shell assets, including the generic guide catalog, were 384,842 bytes (375.8 KiB); raw combined size was 534,191 bytes.
- [x] Run the performance fixture with 50 devices and guides of up to 100 steps; record at least five measurements. Added repeatable fixture at `Mockups/still/performance-check.cjs`; it uses 50 devices, 4,950 saved progress entries, and 99 steps per category before a guide update adds step 100. Five fixture online loads were 73.7, 64.4, 57.2, 57.5, and 62.4 ms. The run used desktop Chrome on macOS, mobile emulation, and 4× CPU throttling.
- [x] Test first online load, repeat load, offline reopen, offline edits, reconnect, guide updates, and update during an active checklist. Initial online shell: 414.7 ms. All listed lifecycle scenarios passed in the local Chrome fixture; the waiting app update stayed blocked on the checklist and applied after leaving it.
- [x] Test empty inventory, search with no results, unavailable guides, malformed imports, storage failures, and recovery paths. All passed in the local Chrome fixture, including backup export and Retry after a simulated IndexedDB write failure.
- [ ] Confirm all SRS acceptance criteria and browser-specific limitations. The selected performance and lifecycle scenarios passed in desktop Chrome; the iPhone 17e Simulator smoke-check confirms Safari can render Home and Guides, but actual mid-range Android measurements, iOS interaction/offline/standalone coverage, macOS Safari, Edge, Firefox, assistive-technology, and broader release acceptance coverage remain outstanding. The Android 37 emulator stayed offline in ADB on this 8 GB Mac; its startup warned that 16 GB RAM is recommended.

## 8. Release operations

- [ ] Confirm the final product title, app icons, and install name display as Good Signal on supported platforms.
  - [x] The PWA manifest names the app and short name “Good Signal” and references SVG, 192×192, 512×512, and 180×180 Apple touch icons; the referenced PNG files are valid at those dimensions.
  - [x] Good Signal branding is visible in the iOS Safari smoke check. The Chrome install prompt previously showed the Good Signal icon, and the user confirmed the iOS Home Screen icon works.
  - [ ] Verify the installed app name/icon on every supported platform. Android and iOS standalone installs were not tested. In browser tabs, the document title is route-specific (for example “Overview”), not “Good Signal”.
- [ ] Decide whether to keep the current `still-device-privacy` URL or move to a Good Signal URL; update redirects/bookmarks if the address changes.
  - [x] The Sites project is live at `still-device-privacy.slopedteal.chatgpt.site`; the GitHub Pages app has also been opened at `boredpolymath.github.io/GoodSignal/`.
  - [ ] Confirm which URL is canonical and whether the other should redirect; no redirect or bookmark migration is documented.
- [ ] Document how guide content is reviewed, versioned, published, and rolled back.
  - [x] `Mockups/docs/Guide-Coverage-and-Maintenance.md` documents the content owner, review cadence, source/scope rules, review record, versioning, migration entries, and stable step IDs.
  - [x] `.github/workflows/deploy-pages.yml` publishes `Mockups/still/dist` to GitHub Pages on pushes to the default branch.
  - [ ] A rollback procedure for a guide catalog or site release is not documented.
- [ ] Publish release notes and support/reporting instructions.
  - [x] The guide maintenance document explains that reports stay on the device and can be downloaded or shared; it explicitly says reports are not sent automatically.
  - [ ] Publish release notes and configure a support contact or reporting destination; neither is present in the current project documentation.

## Reference

See the [Smart Device Privacy Setup SRS](</Volumes/External/BPStudios/Docs/Inbox/10-26-26/3 Smart Device Privacy Setup.md>) for the full requirements and acceptance criteria.
