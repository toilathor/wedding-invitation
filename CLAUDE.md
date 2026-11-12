# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page Vietnamese wedding invitation ("Thiệp cưới số") built with Angular 19 (standalone components, signals), Tailwind CSS 3, and Firebase Firestore. There is no test runner or linter configured.

## Commands

- `npm start` — dev server (`ng serve --host 0.0.0.0`, port 4200)
- `npm run build` — production build to `dist/wedding-invitation` (budgets: 2MB warn / 5MB error initial; 20kB/40kB per component style)
- `npm run build:pages` — production build with `--base-href /wedding-invite/` for GitHub Pages (publish the contents of `dist/wedding-invitation/browser`; the `gh-pages` branch currently holds an unrelated Flutter site, so don't overwrite it blindly)
- `npm run watch` — dev-configuration build in watch mode
- `npm run preview:public` — builds, then serves via a Cloudflare Tunnel (`cloudflared` required) for phone testing; writes logs to `/tmp`
- `.cursor/skills/mobile-preview/SKILL.md` describes the same phone-preview flow with ngrok: run `npm run build` first, and pass the exact tunnel hostname via `ng serve --allowed-hosts <host>` (never disable host checking).

## Setup requirement

`src/environments/environment.ts` is gitignored (as are `environment.prod.ts`/`environment.development.ts`) but is imported by `src/app/core/firebase.config.ts`. Copy `src/environments/environment.example.ts` to `environment.ts` and fill in Firebase credentials, or the build fails.

## Rules that are easy to break

- **Asset paths must be relative** (`assets/images/...`, never `/assets/...`). The site is served under `/wedding-invite/` on GitHub Pages and absolute paths 404 there. Applies to `wedding-data.ts`, templates and `url()` in CSS.
- **Album photos need two files**: `src/assets/images/gallery/album_N.webp` (1800px, lightbox) and `.../gallery/thumbs/album_N.webp` (640px, grid and thumbnail strip, derived by `AlbumComponent.thumbOf`). Add both when changing the album, and keep `albums` in `wedding-data.ts` in sync.
- **CSP is a `<meta>` tag in `src/index.html`** (GitHub Pages can't send headers). Any new external host (fonts, analytics, maps embeds, scripts) must be added there or it will be blocked; inline `<script>` and inline event handlers are not allowed. `angular.json` sets `inlineCritical: false` for that reason.
- **Personalised guest links**: `?n=<tên>&x=<mã gộp tối đa 3 ký tự: nhóm xưng hô, gia đình, tự xưng>&p=<người phụ đi cùng, nhập tự do>` (see `docs/guest-links.md`, the contract with the Google Sheet that generates links). `core/guest-rules.ts` parses/validates the URL and formats tokens (`{you}`, `{We}`, `{couple}`, `{nhe}`...); `GuestService` holds the guest, `PersonalizePipe` and `GuestService.fmt()` apply it in components, and `AppComponent` runs `personalizeDeep` over `WEDDING_DATA`. When writing copy that addresses the guest or the couple, use tokens instead of "bạn"/"chúng mình"; with no params the default texts are unchanged. Never put the guest list in the repo (public). Changing group codes breaks already-sent links.
- **Photos use the shared `appImgFade` directive** (`src/app/shared/img-fade.directive.ts`, CSS in `styles.css` under "Image skeleton"): add it to any `<img>` of a real photo whose parent is a sized container (`appImgFade` = skeleton + blur-in reveal, `appImgFade="fade"` = skeleton + fade, `appImgFade="none" (imgLoaded)="…"` = load event only). Don't use it on transparent decor PNGs (the skeleton is a solid block). It is standalone: import `ImgFadeDirective` in the component.
- Never put personal data back into the client bundle: bank numbers are intentionally absent (only the QR images in `assets/images/bank` are shown), and `rsvps` must stay unreadable by clients.

## Architecture

- **All content lives in `src/app/core/wedding-data.ts`** (`WEDDING_DATA`, typed by `src/app/models/wedding-data.model.ts`): names, dates, countdown ISO timestamp, audio URLs, images, story/timeline/events, bank details. `AppComponent` passes slices of it as `@Input`s to each section component. Change copy/dates/assets there, not in the components.
- **`AppComponent` (`src/app/app.component.html`)** lays out the page as stacked `.pageview-section` divs (banner, invitation, introduction, story, timeline, events, album, guestbook, bank-gift + footer), each with an `id="page-*"`. Floating UI (toast, music player, quick menu, page-indicator dots, RSVP modal) sits on top.
- **`PageViewService`** tracks the current section (`currentPageIndex` signal) from scroll/viewport position and drives the indicator dots and active-section class; `AppComponent` registers the section elements with it. New sections must be added to both the template and the `pages` list in the component.
- **Firebase (`src/app/core/firebase.config.ts`)** exports a singleton `db` (Firestore only). Services using it:
  - `GuestbookService` — realtime `onSnapshot` on `wishes` (limit 50), per-device cap of 5 wishes via a `deviceId` in localStorage, hides messages flagged `hidden`, and censors text using `settings/moderation.sensitiveKeywords` (read live).
  - `RsvpService` — writes `rsvps/{phone}` documents (write-only for clients). It uses its own random secret in localStorage (`wedding_rsvp_secret`), deliberately different from the public `deviceId` in wishes, because the rules let only the device that created an RSVP update it.
- **`firestore.rules`** must stay in sync with client payloads and is published manually in the Firebase Console (or `firebase deploy --only firestore:rules`). `wishes`: create only, whitelisted fields, `createdAt == request.time`, public read. `settings/moderation`: public read, no writes (edited in the console). `rsvps`: keyed by phone, **no client reads/lists**, create validated, update only from the same `deviceId`. Changing a service's written fields requires updating the rules; the rules were not testable locally (no emulator), so re-test RSVP and wishes after changing them.
- **`CoverComponent` (`components/cover`)** is the tap-to-open envelope shown on load. One progress value `p` (0 closed, 1 open) driven by a spring in `requestAnimationFrame` drives the seal, flap (3D `rotateX`), the card (a scaled-down real `<app-banner>`) and the fade-out; drag up or tap to open, release velocity decides commit vs. snap back. The card ends exactly on top of the real banner, so keep the banner's layout independent of the cover. `AppComponent` locks scrolling until the cover emits `finished`, and its `opened` event starts the music (browsers need that gesture).
- **Album lightbox (`components/album`)** has its own gesture layer (pointer events): pinch, drag with inertia, double-tap/double-click and Ctrl+wheel zoom (1×–5×), spring-back at bounds, push-style slide transition, slideshow (4s) with progress bar. There is deliberately no download button and image context menus are blocked (deterrent only).
- `AudioService`/`music-player` handle background music (multiple tracks in `audioUrls`); `ToastService`/`toast` provide notifications.
- Styling: Tailwind utility classes plus custom CSS in `src/styles.css` and `app.component.css`; many local fonts under `src/assets/fonts`. UI copy is Vietnamese.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
