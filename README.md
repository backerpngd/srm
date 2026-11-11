# Self Regulation Mastery (PWA)
Deploy: push this folder's contents to a GitHub repo -> Settings > Pages > Deploy from branch (root).
Open `https://<user>.github.io/<repo>/` on the phone, then Install / Add to Home Screen.
Update: change `VERSION` in sw.js on every release.
Time window: `ENFORCE_TIME_WINDOW` at the top of js/app.js — `true` = Track opens only 9:00 PM – 11:59 PM (release); `false` = always open (testing build).
Icons: `icon-192.png` / `icon-512.png` (rounded corners, used by the manifest, favicon, splash and login logo) and `apple-touch-icon.png` (square, 180 px — iPhone/iPad add their own rounded mask and would paint transparent corners black).
Quran verses: `VERSE` (Track, 29:45), `HV` (Track honesty reminder, 17:14) and `IVR` (Insights cards) near the top of js/app.js.

## Test data (developer only)
Open `seed.html` in the same browser as the app (e.g. `https://<user>.github.io/<repo>/seed.html`). It is not linked from the app; it only changes test profiles in the browser that opens it.
- **Seed test data** adds test profiles X (female, 35 days), Y (male, 20 days) and Z (female, 3 days, rest period still running). Today stays empty.
- **Clear seeded data** removes only the test profiles. Your own profiles are never touched.
Reload the app after seeding or clearing.
