# Wunschliste (Angular)

Web-Version der Wunschlisten-App. Sie nutzt dasselbe Firebase-Projekt (`wishlist-676f9`),
dieselben Firestore-/Storage-Regeln und dasselbe Design wie die Flutter-App
[`wishlist_app`](https://github.com/NiklasZeiler/wishlist_app).

## Entwicklung

```bash
npm ci
npm start        # http://localhost:4200
npm test         # Karma/Jasmine
npm run build    # Ausgabe in dist/browser
```

Auf localhost gibt App Check ein Debug-Token in der Konsole aus. Es muss in der
Firebase-Konsole unter *App Check → Apps → Debug-Tokens* eingetragen werden.

## Aufbau

| Ordner | Inhalt |
| --- | --- |
| `src/app/core` | Services (Auth, Wünsche, Feedback, Profil, Theme), Guards, Validatoren, Modelle |
| `src/app/pages` | Routen: Login, Registrierung, E-Mail-Verifizierung, Wunschliste, Wunsch hinzufügen, Teilen, Profil, Feedback, Datenschutz, Impressum |
| `src/app/shared` | Layout mit Menü, Wunschkarte, Dialoge, Bestätigungs-Button |

## Abgleich mit der Flutter-App

- `firestore.rules`, `storage.rules` und `firestore.indexes.json` sind identisch mit denen in
  `wishlist_app`. Änderungen immer in beiden Repos nachziehen und mit
  `firebase deploy --only firestore:rules,storage` ausrollen.
- Das Farbschema wird wie `ColorScheme.fromSeed` aus der Akzentfarbe (Standard `#05171f`)
  erzeugt und im Browser gespeichert.
- Share-Links haben die Form `<Domain>/share?code=<Code>`. Ältere Links
  (`/wishes/share?shareCode=…`) werden weiterhin aufgelöst.

## Hosting (Vercel)

Die Web-App wird über Vercel ausgeliefert (`vercel.json`: Build `npm run build`, Ausgabe
`dist/browser`, SPA-Rewrite auf `/index.html`). Backend (Auth, Firestore, Storage, App Check)
läuft in Firebase. Die Vercel-Domain muss in Firebase unter *Authentication → Autorisierte
Domains* sowie im reCAPTCHA-Key und in der App-Check-Registrierung der Web-App stehen.

## Android (Capacitor)

```bash
npm run build
npx cap sync android
npx cap open android
```

Die App-ID ist `com.wunschliste.app`; vor einem Release müssen Version, Signing-Konfiguration und
`minifyEnabled` in `android/app/build.gradle` gesetzt werden.
