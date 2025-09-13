# COM PSU Mobile (Expo)

A lightweight native wrapper around the Next.js web app using `react-native-webview`.

## Configure

- Set the web URL in `apps/mobile/app.json` under `expo.extra.WEB_URL`.
  - Local dev: `http://localhost:3000`
  - Device on LAN: `http://<your-ip>:3000`
  - Production: `https://your-domain`

## Run

- Start the Next.js app: `npm run dev`
- In another terminal, run the mobile app:
  - Start Metro: `npm --prefix apps/mobile run start`
  - iOS: `npm --prefix apps/mobile run ios`
  - Android: `npm --prefix apps/mobile run android`

## Notes

- Pull-to-refresh is enabled.
- Errors are logged to the native console.
- You can add deep links via `expo.scheme` in `app.json`.
