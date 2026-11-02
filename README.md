# Good Signal — Smart Device Privacy

A browser-local PWA prototype based on the supplied SRS and Humaans design reference.

## Run

From `Mockups/still/dist`, run `python3 -m http.server 4173`, then visit http://localhost:4173. Production requires HTTPS for service workers and installation.

## Included

- Responsive overview, inventory, and twelve category-level guides: TV, smart speaker, streaming device, soundbar, headphones and Bluetooth, Wi-Fi router and home hub, camera and doorbell, smart display, thermostat, smart lighting, robot vacuum, and connected appliances
- Add, edit, remove, search, and filter devices
- Seven privacy topics with four review states and per-step notes
- Local persistence, save failure recovery, versioned JSON export/import with validation, replacement confirmation, restore recovery, and IndexedDB persistence
- Human-readable reports, reset and deletion confirmations
- App manifest, offline caching, installation guidance, separate cache controls, a versioned guide catalog, and user-controlled app updates that wait for saved checklist work
- Step-ID-based guide update handling: unchanged progress is kept, new steps start unreviewed, materially changed steps are flagged, and removed steps retain their previous status and notes in device history

## Prototype boundaries

Generic instructions only; no verified model-specific guides or verified manufacturer/model coverage yet. No device discovery or configuration. Inventory, checklist progress, notes, and saved-guide metadata use IndexedDB, with a one-time migration from the earlier `still-v1` LocalStorage record. Good Signal applies a 20 MB app-managed data limit and warns in Settings as it approaches. Browser limits and eviction behavior vary; data is not encrypted. No cloud synchronization or analytics is built into the app. The hosting service receives ordinary requests for app files and guide updates, but Good Signal does not attach device inventory, notes, or progress. A completed checklist is not a privacy/security certification or guarantee. Generic guide text and its catalog are cached offline; external manufacturer pages require a connection. Model-specific guides can be saved for offline use when reviewed guides are added to the catalog. App/service-worker updates and guide-catalog updates have separate checks.

## Validation

Chrome browser checks passed for device creation, all progress states, unresolved exclusion, notes, reload persistence, fully reviewed status, offline reload, and horizontal overflow at 390px and 320px. Desktop and mobile screenshots were visually inspected. Cross-browser and formal accessibility audits remain for production.

## Design

Warm white, brown ink, coral actions, restrained sage accents; editorial serif headlines and compact sans-serif utility text. Locally rendered CSS device illustration and local PWA icons; no external asset or font requests.
