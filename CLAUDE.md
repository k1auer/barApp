# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**barApp** is a German-language Progressive Web App (PWA) for managing a point-of-sale system for a bar/event venue. It allows staff to register drinks and food items, calculate totals, and generate receipts. The app works offline via service worker caching.

## Architecture

### Pages & Venues
The app has three main pages that share the same `app.js` logic but with different configurations:
- **index.html** - "Kiosk" mode (standard venue pricing)
- **tribuene.html** - "Tribüne" mode (different pricing tier, e.g., viewing area)
- **essen.html** - Food/snacks menu

Each page displays different items and prices based on the venue, but all use the same underlying state management and UI functions from `app.js`.

### Core Files
- **app.js** - Main application logic (259 lines)
  - `addItem(name, price, color, withPfand)` - Add item to cart
  - `renderItems()` - Render item list in header
  - `renderReceipt()` - Generate receipt table
  - `resetAll()` - Clear cart
  - State: `total` (float), `items` (object keyed by name)

- **app.css** - Styling (139 lines)
  - Grid-based button layout for items
  - Responsive design with flexbox
  - Color-coded buttons matching item types

- **service-worker.js** - PWA offline support
  - Caches static assets (manifest, HTML, vendor files)
  - Cache name: `dragstar-rechner-v{N}` (currently v10)
  - Implements cache-first strategy with network fallback

- **manifest.json / manifest.webmanifest** - PWA metadata

## Key Implementation Details

### State Management
All state is client-side and in-memory:
```javascript
let total = 0;  // Running total in euros
let items = {}; // { itemName: { count, price, color }, ... }
```

Items are keyed by name. When an item is clicked, it's removed from the cart. The `withPfand` parameter automatically adds 0.25€ deposit when `true`.

### Rendering
- `renderItems()` creates colored divs for each item in the header, with count badges
- `renderReceipt()` generates an HTML table with item count × price calculations
- No external templating library—direct DOM manipulation

### Service Worker Versioning
The cache version is hardcoded in `service-worker.js`. To invalidate the cache (e.g., after CSS or HTML changes):
1. Bump `CACHE_NAME` (e.g., `v9` → `v10`)
2. Add any new static assets to `urlsToCache`
3. The `activate` event cleans up old cache versions automatically

### Vibration Feedback
Clicking an item vibrates the device (300ms) if the browser supports `navigator.vibrate`.

## Development

### Running Locally
No build process required. Serve the files with any HTTP server:
```bash
# Python 3
python3 -m http.server 8000

# or Node.js
npx http-server

# or macOS
python -m SimpleHTTPServer 8000
```

Then navigate to `http://localhost:8000` in a browser. The app requires HTTP/HTTPS for service worker registration.

### Modifying Items & Prices
Edit the button elements in the respective HTML file. The pattern is:
```html
<button class="button" style="background-color: #HEX_COLOR;" 
  onclick="addItem('Display Name', PRICE, '#HEX_COLOR', WITH_PFAND?)">
  Label
</button>
```
- `WITH_PFAND` is optional; pass `true` to auto-add 0.25€ deposit
- Prices are in euros (floats)
- Colors should match between `style` and `onclick` for consistency

### Updating the Cache
After changes, bump the version in `service-worker.js`:
```javascript
const CACHE_NAME = 'dragstar-rechner-v11'; // was v10
```

### Testing Across Devices
The PWA uses viewport constraints (`maximum-scale=1.0, user-scalable=no`) for mobile devices. Test on mobile or use browser dev tools device emulation.

## Language & Localization
The app is in German. UI strings use German labels (e.g., "Gesamt: X€" for total, "Quittung" for receipt). Keep German terminology when adding new features.

## Notes for Future Work
- **No build tooling**: All code is vanilla JS, HTML, CSS—no bundlers or transpilation.
- **Shared logic across pages**: Changes to `app.js` affect all three pages. Use HTML button parameters to vary behavior per venue.
- **No external dependencies**: Except driver.js in vendor (for onboarding).
- **Offline-first**: Service worker is critical for offline functionality; changes to static assets must trigger cache version bumps.
