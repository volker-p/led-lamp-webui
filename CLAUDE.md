# LED Lamp WebUI

React-based web UI for controlling an LED lamp via WebSocket.

## Build

```
npm run build
```

> Note: `NODE_OPTIONS=--openssl-legacy-provider` is set in the build script to work around an OpenSSL compatibility issue between Node.js 17+ and the old webpack version used by `react-scripts@3`.

Produces output in `./build/` and gzipped files in `./gzipped/`.

The build uses a custom script (`scripts/build-non-split.js`) that disables code splitting and outputs predictable filenames:
- `static/js/index-main.js`
- `static/css/index-main.css`

## Development

```
npm start
```

Runs the app at `http://localhost:3000`.

## Other Scripts

- `npm test` — run tests
- `npm run server` — start the example WebSocket server (`server/server.js`)

## Deployment

The build script runs a custom webpack config (scripts/build-non-split.js) that outputs a single JS + CSS bundle 
(no code splitting) to ./build/, then postbuild gzips everything to ./gzipped/.

To deploy to the lamp, copy the gzipped output into the firmware's data/ directory and flash the filesystem:

```
cp -r gzipped/* ~/CLionProjects/GyverLampCpp/data/
cd ~/CLionProjects/GyverLampCpp
make buildfs && make uploadfs
```

## Notes
The store URL is currently hardcoded as http://localhost:3000/api/v1 in StoreModal/index.js — change STORE_API to the production URL when deploying.