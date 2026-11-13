# Graph Report - wedding-invitation  (2026-11-13)

## Corpus Check
- 42 files · ~30,506 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .css 2, .rules 1)

## Summary
- 520 nodes · 940 edges · 31 communities (13 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d7b9feea`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app.component.ts
- package.json
- options
- AlbumComponent
- compilerOptions
- AppComponent
- InvitationComponent
- guestbook.component.ts
- Link cá nhân hoá cho khách mời
- RsvpModalComponent
- PageViewService
- EventsComponent
- GuestbookComponent
- AudioService
- QuickMenuComponent
- wedding-invitation
- tsconfig.app.json
- guestbook.service.ts
- preview-public.sh
- environment.example.ts
- CoverComponent
- gen-decor.mjs
- BankGiftComponent

## God Nodes (most connected - your core abstractions)
1. `AlbumComponent` - 50 edges
2. `CoverComponent` - 31 edges
3. `@angular/core` - 27 edges
4. `AppComponent` - 21 edges
5. `PageViewService` - 20 edges
6. `@angular/common` - 18 edges
7. `RsvpModalComponent` - 15 edges
8. `ImgFadeDirective` - 15 edges
9. `compilerOptions` - 15 edges
10. `AudioService` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Architecture` --references--> `CoverComponent`  [INFERRED]
  CLAUDE.md → src/app/components/cover/cover.component.ts
- `Rules that are easy to break` --references--> `AppComponent`  [INFERRED]
  CLAUDE.md → src/app/app.component.ts
- `Rules that are easy to break` --references--> `ImgFadeDirective`  [INFERRED]
  CLAUDE.md → src/app/shared/img-fade.directive.ts
- `Rules that are easy to break` --references--> `PersonalizePipe`  [INFERRED]
  CLAUDE.md → src/app/shared/personalize.pipe.ts
- `Architecture` --references--> `AppComponent`  [INFERRED]
  CLAUDE.md → src/app/app.component.ts

## Import Cycles
- None detected.

## Communities (31 total, 18 thin omitted)

### Community 0 - "app.component.ts"
Cohesion: 0.06
Nodes (33): @angular/common, @angular/core, canvas-confetti, PageInfo, BannerComponent, IntroductionComponent, TimeLeft, MusicPlayerComponent (+25 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (52): dependencies, @angular/animations@^19.1.0, @angular/common@^19.1.0, @angular/compiler@^19.1.0, @angular/core@^19.1.0, @angular/forms@^19.1.0, @angular/platform-browser-dynamic@^19.1.0, @angular/router@^19.1.0 (+44 more)

### Community 2 - "options"
Cohesion: 0.08
Nodes (28): build, serve, builder, configurations, defaultConfiguration, options, development, production (+20 more)

### Community 4 - "compilerOptions"
Cohesion: 0.09
Nodes (21): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, compileOnSave, compilerOptions, esModuleInterop (+13 more)

### Community 5 - "AppComponent"
Cohesion: 0.11
Nodes (4): @angular/platform-browser@^19.1.0, @angular/platform-browser, AppComponent, appConfig

### Community 7 - "guestbook.component.ts"
Cohesion: 0.15
Nodes (16): Rules that are easy to break, cap(), cleanCompanion(), cleanName(), cleanWord(), CUSTOM_CODE, DEFAULT_GUEST, ELDER (+8 more)

### Community 8 - "Link cá nhân hoá cho khách mời"
Cohesion: 0.17
Nodes (11): Công thức Google Sheet, Ghi chú, Ký tự 1: nhóm xưng hô, Ký tự 2: gia đình, Ký tự 3: đổi cách tự xưng, Link cá nhân hoá cho khách mời, Link ngắn `?g=`, Mã gộp `x` (+3 more)

### Community 13 - "AudioService"
Cohesion: 0.10
Nodes (7): Architecture, Commands, graphify, Project, Setup requirement, AudioService, GuestbookService

### Community 15 - "wedding-invitation"
Cohesion: 0.12
Nodes (16): cli, analytics, newProjectRoot, projects, wedding-invitation, $schema, skipTests, standalone (+8 more)

### Community 16 - "tsconfig.app.json"
Cohesion: 0.25
Nodes (7): ./tsconfig.json, compilerOptions, outDir, types, extends, files, include

### Community 17 - "guestbook.service.ts"
Cohesion: 0.15
Nodes (9): firebase, app, db, RSVPFormData, MAX_LOADED_WISHES, MAX_WISHES_PER_DEVICE, PhoneValidationResult, RsvpService (+1 more)

### Community 18 - "preview-public.sh"
Cohesion: 0.40
Nodes (4): APP_PORT, print_qr(), PROJECT_DIR, preview-public.sh script

### Community 24 - "gen-decor.mjs"
Cohesion: 0.18
Nodes (20): bloom(), blossom(), bouquet(), compose(), cubic(), cubicD(), f(), grass() (+12 more)

## Knowledge Gaps
- **3 isolated node(s):** `./tsconfig.json`, `APP_PORT`, `PROJECT_DIR`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 216 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AlbumComponent` connect `AlbumComponent` to `app.component.ts`, `guestbook.component.ts`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppComponent` (e.g. with `Architecture` and `Rules that are easy to break`) actually correct?**
  _`AppComponent` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `APP_PORT`, `PROJECT_DIR` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.component.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05880665519219736 - nodes in this community are weakly interconnected._
- **Why does `CoverComponent` connect `CoverComponent` to `app.component.ts`, `AudioService`, `guestbook.component.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05079825834542816 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `app.component.ts` to `package.json`, `AppComponent`, `guestbook.service.ts`, `guestbook.component.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._