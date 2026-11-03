# Good Signal guide coverage and maintenance

Last reviewed: November 2, 2026  
Guide content version: 1.3

## Initial coverage

The maintained, versioned source is `guide-catalog.json`. It contains guide versions, review dates, sources, category steps, stable step identifiers, and a migration log. The app checks guide updates separately from service-worker/app updates and caches the catalog for offline use.

Good Signal currently offers generic category checklists for:

1. Smart TVs
2. Smart speakers
3. Streaming devices
4. Soundbars
5. Headphones and Bluetooth audio
6. Wi-Fi routers and home hubs
7. Smart cameras and doorbells
8. Smart displays
9. Smart thermostats
10. Smart lighting
11. Robot vacuums
12. Connected appliances

Manufacturer-specific verified coverage: none. Model-specific verified coverage: none. No region or firmware combination has been verified. Users may record a manufacturer and model in their local inventory, but this does not imply that Good Signal has reviewed that device.

## Guide status and claim rules

- **Verified** means the capability or instruction is supported by current, reviewed documentation for the guide’s explicitly named model, region, and firmware/software scope.
- **Unverified** means the available checklist is generic and has not been validated against the user’s model.
- **Unknown** means the presence or behavior of a capability has not been established from documentation.
- Generic checklists must remain labeled generic and must not imply that a device has a microphone, camera, telemetry option, advertising control, or other capability unless that is verified for the device in scope.
- A user's checklist status records their own review only; it does not change a guide's verification status.
- Do not make unsupported surveillance claims or promise that a device is private, secure, or free of collection. A completed checklist is not a privacy or security certification.
- State known functionality tradeoffs alongside the relevant setting or checklist step.

## Model-specific publication gate

Do not publish model-specific instructions until the content maintainer has reviewed supporting manufacturer documentation. Each guide record must include:

- Category, manufacturer, exact model(s), region, and applicable firmware/software versions
- Official manufacturer source URLs and the relevant claims each source supports
- Review date, guide version, and reviewer/maintainer
- Verified, unverified, or unknown status for each device capability described
- Known functionality tradeoffs and any limitations in the source material

If any of these details cannot be established, keep the content generic and mark the relevant capability unknown or the instruction unverified.

## Sources checked for current generic guidance

The following sources were opened or checked on November 2, 2026. They support general privacy and security topics; they do not verify any specific manufacturer, model, region, firmware, or device capability.

- FTC, [Securing Your Internet-Connected Devices at Home](https://consumer.ftc.gov/articles/securing-your-internet-connected-devices-home)
- FTC, [How To Secure Your Voice Assistant and Protect Your Privacy](https://consumer.ftc.gov/articles/how-secure-your-voice-assistant-protect-your-privacy)
- FTC, [How To Secure Your Home Security Cameras](https://consumer.ftc.gov/articles/how-secure-your-home-security-cameras)
- CISA, [5 Steps to Protecting Your Digital Home](https://www.cisa.gov/sites/default/files/publications/NCSAM_YourDigitalHome_2020.pdf)

The Samsung and Google manufacturer pages reviewed during this pass are not used as model-specific Good Signal instructions. They lack an editorially recorded scope in this prototype and must not be read as evidence that all devices in a category share those features.

## Guide updates and offline use

- The guide catalog has its own version and review date, separate from the app shell version.
- Generic checklists and their catalog are included in offline preparation. Manufacturer source links require connectivity.
- A verified model-specific guide must be saved explicitly from the matching device screen. The current feed has no model-specific guides, so none can currently be saved.
- Keep step IDs stable when wording or order changes. Add new IDs for new steps; they begin as not started. For materially changed steps, keep the ID and list it under `changed` so existing progress remains intact and is flagged for review. For removed steps, include the prior step record and reason under `removed`; the app preserves prior status and notes in device guide history.
- Add a migration entry for every version transition. Record `from`, `to`, whether the change is material, a user-readable summary, and per-category `added`, `changed`, and `removed` step entries. Never rewrite or discard saved progress as part of a guide update.

## User reports

Guide detail screens offer a report form that prepares a text report with the category, guide version, issue description, optional source URL, and optional model/region/firmware details. Reports are not transmitted or stored by Good Signal. The reporter can share or download the report and send it to the project maintainer. The current site has no centralized submission inbox; configure a support address or reporting endpoint before claiming automatic submission.

## Ownership and review cadence

- Owner: Good Signal project maintainer (content-maintainer role).
- Routine review: quarterly.
- Triggered review: after a user report, a source change, or a known manufacturer update that could affect advice.
- When a source no longer supports a claim, remove or revise that claim, update the guide version and review date, and summarize material changes.

## Review record

| Date | Version | Scope | Outcome |
| --- | --- | --- | --- |
| November 2, 2026 | 1.2 | 12 generic category checklists and listed FTC/CISA references | No model-specific guide published; no manufacturer/model/region/firmware coverage verified. Added explicit status definitions, scope display, report preparation, and quarterly maintenance policy. |
| November 2, 2026 | 1.3 | Versioned guide catalog and offline/update workflow | Content unchanged; stable step IDs retained. Added separate guide update checking, offline catalog caching, progress migration rules, update summaries, and removed-step history. |
