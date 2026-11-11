# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page Vietnamese wedding invitation ("Thiệp cưới số") built with Angular 19 (standalone components, signals), Tailwind CSS 3, and Firebase Firestore. There is no test runner or linter configured.

## Commands

- `npm start` — dev server (`ng serve --host 0.0.0.0`, port 4200)
- `npm run build` — production build to `dist/wedding-invitation` (budgets: 2MB warn / 5MB error initial; 20kB/40kB per component style)
- `npm run watch` — dev-configuration build in watch mode
- `npm run preview:public` — builds, then serves via a Cloudflare Tunnel (`cloudflared` required) for phone testing; writes logs to `/tmp`
- `.cursor/skills/mobile-preview/SKILL.md` describes the same phone-preview flow with ngrok: run `npm run build` first, and pass the exact tunnel hostname via `ng serve --allowed-hosts <host>` (never disable host checking).

## Setup requirement

`src/environments/environment.ts` is gitignored (as are `environment.prod.ts`/`environment.development.ts`) but is imported by `src/app/core/firebase.config.ts`. Copy `src/environments/environment.example.ts` to `environment.ts` and fill in Firebase credentials, or the build fails.

## Architecture

- **All content lives in `src/app/core/wedding-data.ts`** (`WEDDING_DATA`, typed by `src/app/models/wedding-data.model.ts`): names, dates, countdown ISO timestamp, audio URLs, images, story/timeline/events, bank details. `AppComponent` passes slices of it as `@Input`s to each section component. Change copy/dates/assets there, not in the components.
- **`AppComponent` (`src/app/app.component.html`)** lays out the page as stacked `.pageview-section` divs (banner, invitation, introduction, story, timeline, events, album, guestbook, bank-gift + footer), each with an `id="page-*"`. Floating UI (toast, music player, quick menu, page-indicator dots, RSVP modal) sits on top.
- **`PageViewService`** tracks the current section (`currentPageIndex` signal) from scroll/viewport position and drives the indicator dots and active-section class; `AppComponent` registers the section elements with it. New sections must be added to both the template and the `pages` list in the component.
- **Firebase (`src/app/core/firebase.config.ts`)** exports a singleton `db` (Firestore only). Services using it:
  - `GuestbookService` — realtime `onSnapshot` on `wishes` (limit 50), per-device cap of 5 wishes via a `deviceId` in localStorage, hides messages flagged `hidden`, and censors text using `settings/moderation.sensitiveKeywords` (read live).
  - `RsvpService` — writes `rsvps/{phone}` documents.
- **`firestore.rules`** must stay in sync with client payloads: `wishes` create accepts only `name, content, deviceId, createdAt` with size limits and no update/delete; `settings/moderation` is public-read, no writes (edited via console); `rsvps` is keyed by phone with create/update only. Changing a service's written fields requires updating these rules.
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
