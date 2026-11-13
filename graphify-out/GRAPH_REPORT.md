# Graph Report - wedding-invitation  (2026-11-13)

## Corpus Check
- 46 files · ~33,016 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .css 2, .rules 1)

## Summary
- 556 nodes · 1007 edges · 37 communities (14 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ed55af2d`
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
- rsvp-modal.component.ts
- Link cá nhân hoá cho khách mời
- RsvpModalComponent
- PageViewService
- EventsComponent
- GuestbookComponent
- AudioService
- QuickMenuComponent
- ReplyCardComponent
- tsconfig.app.json
- guestbook.service.ts
- preview-public.sh
- environment.example.ts
- CoverComponent
- gen-decor.mjs
- dependencies
- scripts
- main.ts
- zone.js@~0.15.0

## God Nodes (most connected - your core abstractions)
1. `AlbumComponent` - 50 edges
2. `CoverComponent` - 31 edges
3. `@angular/core` - 29 edges
4. `AppComponent` - 22 edges
5. `PageViewService` - 21 edges
6. `@angular/common` - 19 edges
7. `RsvpModalComponent` - 18 edges
8. `ImgFadeDirective` - 15 edges
9. `IconComponent` - 15 edges
10. `compilerOptions` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Rules that are easy to break` --references--> `AppComponent`  [INFERRED]
  CLAUDE.md → src/app/app.component.ts
- `Rules that are easy to break` --references--> `ImgFadeDirective`  [INFERRED]
  CLAUDE.md → src/app/shared/img-fade.directive.ts
- `Architecture` --references--> `AppComponent`  [INFERRED]
  CLAUDE.md → src/app/app.component.ts
- `Architecture` --references--> `CoverComponent`  [INFERRED]
  CLAUDE.md → src/app/components/cover/cover.component.ts
- `Architecture` --references--> `AudioService`  [INFERRED]
  CLAUDE.md → src/app/services/audio.service.ts

## Import Cycles
- None detected.

## Communities (37 total, 23 thin omitted)

### Community 0 - "app.component.ts"
Cohesion: 0.06
Nodes (28): @angular/common, @angular/core, PageInfo, BankGiftComponent, BannerComponent, IntroductionComponent, MusicPlayerComponent, StoryComponent (+20 more)

### Community 1 - "package.json"
Cohesion: 0.11
Nodes (24): devDependencies, @angular/cli@^19.1.0, @angular/compiler-cli@^19.1.0, @angular-devkit/build-angular@^19.1.0, autoprefixer@^10.4.20, postcss@^8.4.49, qrcode-terminal@^0.12.0, tailwindcss@^3.4.17 (+16 more)

### Community 2 - "options"
Cohesion: 0.05
Nodes (44): build, serve, builder, configurations, defaultConfiguration, options, cli, analytics (+36 more)

### Community 4 - "compilerOptions"
Cohesion: 0.09
Nodes (21): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, compileOnSave, compilerOptions, esModuleInterop (+13 more)

### Community 6 - "InvitationComponent"
Cohesion: 0.21
Nodes (3): InvitationComponent, TimeLeft, InvitationData

### Community 7 - "rsvp-modal.component.ts"
Cohesion: 0.06
Nodes (31): Architecture, Commands, graphify, Project, Rules that are easy to break, Setup requirement, canvas-confetti@^1.9.4, canvas-confetti (+23 more)

### Community 8 - "Link cá nhân hoá cho khách mời"
Cohesion: 0.17
Nodes (11): Công thức Google Sheet, Ghi chú, Ký tự 1: nhóm xưng hô, Ký tự 2: gia đình, Ký tự 3: đổi cách tự xưng, Link cá nhân hoá cho khách mời, Link ngắn `?g=`, Mã gộp `x` (+3 more)

### Community 16 - "tsconfig.app.json"
Cohesion: 0.25
Nodes (7): ./tsconfig.json, compilerOptions, outDir, types, extends, files, include

### Community 17 - "guestbook.service.ts"
Cohesion: 0.10
Nodes (10): firebase, app, db, RSVPFormData, GuestbookService, MAX_LOADED_WISHES, MAX_WISHES_PER_DEVICE, PhoneValidationResult (+2 more)

### Community 18 - "preview-public.sh"
Cohesion: 0.40
Nodes (4): APP_PORT, print_qr(), PROJECT_DIR, preview-public.sh script

### Community 24 - "gen-decor.mjs"
Cohesion: 0.18
Nodes (20): bloom(), blossom(), bouquet(), compose(), cubic(), cubicD(), f(), grass() (+12 more)

### Community 26 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, @angular/animations@^19.1.0, @angular/common@^19.1.0, @angular/compiler@^19.1.0, @angular/core@^19.1.0, @angular/forms@^19.1.0, @angular/platform-browser-dynamic@^19.1.0, @angular/router@^19.1.0 (+10 more)

### Community 29 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, build:pages, ng, preview:public, start, watch

### Community 30 - "main.ts"
Cohesion: 0.60
Nodes (3): @angular/platform-browser@^19.1.0, @angular/platform-browser, appConfig

## Knowledge Gaps
- **3 isolated node(s):** `./tsconfig.json`, `APP_PORT`, `PROJECT_DIR`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 238 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AlbumComponent` connect `AlbumComponent` to `app.component.ts`, `rsvp-modal.component.ts`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppComponent` (e.g. with `Architecture` and `Rules that are easy to break`) actually correct?**
  _`AppComponent` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `APP_PORT`, `PROJECT_DIR` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.component.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05981981981981982 - nodes in this community are weakly interconnected._
- **Why does `CoverComponent` connect `CoverComponent` to `app.component.ts`, `rsvp-modal.component.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11333333333333333 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `app.component.ts` to `package.json`, `InvitationComponent`, `rsvp-modal.component.ts`, `guestbook.service.ts`, `dependencies`, `main.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._