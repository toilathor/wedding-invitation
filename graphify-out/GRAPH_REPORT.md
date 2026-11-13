# Graph Report - wedding-invitation  (2026-11-12)

## Corpus Check
- 40 files · ~25,661 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .css 2, .rules 1)

## Summary
- 474 nodes · 821 edges · 34 communities (14 shown, 20 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c221762`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app.component.ts
- package.json
- options
- AlbumComponent
- compilerOptions
- AppComponent
- guestbook.component.ts
- Link cá nhân hoá cho khách mời
- RsvpModalComponent
- PageViewService
- EventsComponent
- GuestbookComponent
- AudioService
- QuickMenuComponent
- dependencies
- tsconfig.app.json
- guestbook.service.ts
- preview-public.sh
- environment.example.ts
- CoverComponent
- wedding-invitation
- scripts
- main.ts
- @angular/compiler@^19.1.0
- typescript@~5.7.2

## God Nodes (most connected - your core abstractions)
1. `AlbumComponent` - 43 edges
2. `CoverComponent` - 31 edges
3. `@angular/core` - 26 edges
4. `AppComponent` - 21 edges
5. `PageViewService` - 20 edges
6. `@angular/common` - 17 edges
7. `ImgFadeDirective` - 15 edges
8. `RsvpModalComponent` - 15 edges
9. `compilerOptions` - 15 edges
10. `AudioService` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Architecture` --references--> `PageViewService`  [INFERRED]
  CLAUDE.md → src/app/services/pageview.service.ts
- `Architecture` --references--> `CoverComponent`  [INFERRED]
  CLAUDE.md → src/app/components/cover/cover.component.ts
- `Rules that are easy to break` --references--> `ImgFadeDirective`  [INFERRED]
  CLAUDE.md → src/app/shared/img-fade.directive.ts
- `Architecture` --references--> `AppComponent`  [INFERRED]
  CLAUDE.md → src/app/app.component.ts
- `Rules that are easy to break` --references--> `AppComponent`  [INFERRED]
  CLAUDE.md → src/app/app.component.ts

## Import Cycles
- None detected.

## Communities (34 total, 20 thin omitted)

### Community 0 - "app.component.ts"
Cohesion: 0.08
Nodes (22): @angular/common, @angular/core, PageInfo, BankGiftComponent, BannerComponent, IntroductionComponent, TimeLeft, MusicPlayerComponent (+14 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (22): devDependencies, @angular/cli@^19.1.0, @angular/compiler-cli@^19.1.0, @angular-devkit/build-angular@^19.1.0, autoprefixer@^10.4.20, postcss@^8.4.49, qrcode-terminal@^0.12.0, tailwindcss@^3.4.17 (+14 more)

### Community 2 - "options"
Cohesion: 0.08
Nodes (28): build, serve, builder, configurations, defaultConfiguration, options, development, production (+20 more)

### Community 4 - "compilerOptions"
Cohesion: 0.09
Nodes (21): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, compileOnSave, compilerOptions, esModuleInterop (+13 more)

### Community 7 - "guestbook.component.ts"
Cohesion: 0.08
Nodes (27): Rules that are easy to break, @angular/forms@^19.1.0, canvas-confetti@^1.9.4, @angular/forms, canvas-confetti, ATTEND_KEY_BY_TITLE, AttendKey, GuestOption (+19 more)

### Community 8 - "Link cá nhân hoá cho khách mời"
Cohesion: 0.17
Nodes (11): Công thức Google Sheet, Ghi chú, Ký tự 1: nhóm xưng hô, Ký tự 2: gia đình, Ký tự 3: đổi cách tự xưng, Link cá nhân hoá cho khách mời, Link ngắn `?g=`, Mã gộp `x` (+3 more)

### Community 13 - "AudioService"
Cohesion: 0.10
Nodes (7): Architecture, Commands, graphify, Project, Setup requirement, AudioService, GuestbookService

### Community 15 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @angular/animations@^19.1.0, @angular/common@^19.1.0, @angular/core@^19.1.0, @angular/platform-browser-dynamic@^19.1.0, @angular/router@^19.1.0, firebase@^12.18.0, rxjs@~7.8.0 (+8 more)

### Community 16 - "tsconfig.app.json"
Cohesion: 0.25
Nodes (7): ./tsconfig.json, compilerOptions, outDir, types, extends, files, include

### Community 17 - "guestbook.service.ts"
Cohesion: 0.15
Nodes (9): firebase, app, db, RSVPFormData, MAX_LOADED_WISHES, MAX_WISHES_PER_DEVICE, PhoneValidationResult, RsvpService (+1 more)

### Community 18 - "preview-public.sh"
Cohesion: 0.40
Nodes (4): APP_PORT, print_qr(), PROJECT_DIR, preview-public.sh script

### Community 25 - "wedding-invitation"
Cohesion: 0.12
Nodes (16): cli, analytics, newProjectRoot, projects, wedding-invitation, $schema, skipTests, standalone (+8 more)

### Community 27 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, build:pages, ng, preview:public, start, watch

### Community 29 - "main.ts"
Cohesion: 0.60
Nodes (3): @angular/platform-browser@^19.1.0, @angular/platform-browser, appConfig

## Knowledge Gaps
- **3 isolated node(s):** `./tsconfig.json`, `APP_PORT`, `PROJECT_DIR`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 200 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AlbumComponent` connect `AlbumComponent` to `app.component.ts`, `guestbook.component.ts`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppComponent` (e.g. with `Architecture` and `Rules that are easy to break`) actually correct?**
  _`AppComponent` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `APP_PORT`, `PROJECT_DIR` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.component.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07868852459016394 - nodes in this community are weakly interconnected._
- **Why does `CoverComponent` connect `CoverComponent` to `app.component.ts`, `AudioService`, `guestbook.component.ts`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `app.component.ts` to `package.json`, `guestbook.component.ts`, `EventsComponent`, `dependencies`, `guestbook.service.ts`, `main.ts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._