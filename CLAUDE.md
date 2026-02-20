# CLAUDE.md

## Project Overview

Web UI for an LED lamp controller. A React SPA that communicates with the lamp's firmware over WebSocket. The built output is a single HTML file uploaded to the microcontroller.

## Architecture

- **Frontend**: React 16 (class + functional components), bootstrapped with Create React App
- **Communication**: WebSocket (`ws://<host>/ws`) via `reconnecting-websocket`. All state changes are sent as JSON events.
- **Mock server**: `server/server.js` — a local Node.js WebSocket server for development (port 8000)
- **Build**: Custom `scripts/build-non-split.js` produces a single `index.html` (no code splitting). Output is then gzipped via `gzipper`.

## Key Files

| Path | Purpose |
|------|---------|
| `src/App.js` | Root component; owns WebSocket lifecycle and top-level state |
| `src/helpers/requests.js` | WebSocket singleton + `sendWSEvent`, firmware upload helpers |
| `src/helpers/constants.js` | `EVENTS` map (event name strings) |
| `src/components/Effects/` | Effect picker and per-effect controls |
| `src/components/Header/` | Power button, WS reconnect, firmware update modal, WiFi link |
| `server/server.js` | Dev mock server (WebSocket + HTTP, port 8000) |
| `public/effects.json` (or `public/effects.js`) | Effect definitions loaded at runtime |

## WebSocket Protocol

Messages are JSON: `{ event: "<EVENT_NAME>", data: <payload> }`

Events (defined in `src/helpers/constants.js`):
- `EFFECTS_CHANGED` — update effect settings
- `WORKING` — toggle power on/off
- `ACTIVE_EFFECT` — change selected effect
- `ALARMS_CHANGED` — alarm configuration

The server responds to every message by broadcasting the full state object: `{ working, activeEffect, effects, alarms }`.

## Development

```bash
# Start dev server (port 3000, proxies WS to mock server)
npm start

# Start mock WebSocket server (port 8000)
npm run server

# Run tests
npm test

# Production build (single HTML file + gzip)
npm run build
```

The `proxy` field in `package.json` proxies all requests (including WebSocket) from port 3000 to `http://localhost:8000`.

## Build Output

`npm run build` produces:
- `build/` — single `index.html` (all JS/CSS inlined)
- `gzipped/` — gzipped version for upload to the microcontroller

## Conventions

- Components live in `src/components/<ComponentName>/index.js`
- Functional components preferred for new code; `App.js` is a legacy class component
- WebSocket events sent via `sendWSEvent(EVENTS.<key>, data)` from `helpers/requests.js`
- No TypeScript — plain JavaScript throughout
- Formatter: Prettier (config in `package.json` devDependencies, version 2.0.5)
