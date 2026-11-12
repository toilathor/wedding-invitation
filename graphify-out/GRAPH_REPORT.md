# Graph Report - wedding-invitation  (2026-11-12)

## Corpus Check
- 40 files · ~24,224 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .css 2, .rules 1)

## Summary
- 468 nodes · 809 edges · 29 communities (12 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `41d9748d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app.component.ts
- package.json
- options
- AlbumComponent
- compilerOptions
- AppComponent
- guestbook.service.ts
- guestbook.component.ts
- Link cá nhân hoá cho khách mời
- RsvpModalComponent
- PageViewService
- EventsComponent
- GuestbookComponent
- AudioService
- QuickMenuComponent
- InvitationComponent
- tsconfig.app.json
- preview-public.sh
- environment.example.ts
- CoverComponent
- wedding-invitation

## God Nodes (most connected - your core abstractions)
1. `AlbumComponent` - 43 edges
2. `CoverComponent` - 31 edges
3. `@angular/core` - 26 edges
4. `AppComponent` - 21 edges
5. `PageViewService` - 20 edges
6. `@angular/common` - 17 edges
7. `ImgFadeDirective` - 15 edges
8. `compilerOptions` - 15 edges
9. `RsvpModalComponent` - 14 edges
10. `AudioService` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Architecture` --references--> `AppComponent`  [INFERRED]
  CLAUDE.md → src/app/app.component.ts
- `Rules that are easy to break` --references--> `AppComponent`  [INFERRED]
  CLAUDE.md → src/app/app.component.ts
- `Architecture` --references--> `CoverComponent`  [INFERRED]
  CLAUDE.md → src/app/components/cover/cover.component.ts
- `Architecture` --references--> `PageViewService`  [INFERRED]
  CLAUDE.md → src/app/services/pageview.service.ts
- `Rules that are easy to break` --references--> `ImgFadeDirective`  [INFERRED]
  CLAUDE.md → src/app/shared/img-fade.directive.ts

## Import Cycles
- None detected.

## Communities (29 total, 17 thin omitted)

### Community 0 - "app.component.ts"
Cohesion: 0.08
Nodes (22): @angular/common, @angular/core, PageInfo, BankGiftComponent, BannerComponent, IntroductionComponent, TimeLeft, MusicPlayerComponent (+14 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (51): dependencies, @angular/animations@^19.1.0, @angular/common@^19.1.0, @angular/compiler@^19.1.0, @angular/core@^19.1.0, @angular/forms@^19.1.0, @angular/platform-browser-dynamic@^19.1.0, @angular/router@^19.1.0 (+43 more)

### Community 2 - "options"
Cohesion: 0.08
Nodes (28): build, serve, builder, configurations, defaultConfiguration, options, development, production (+20 more)

### Community 4 - "compilerOptions"
Cohesion: 0.09
Nodes (21): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, compileOnSave, compilerOptions, esModuleInterop (+13 more)

### Community 5 - "AppComponent"
Cohesion: 0.11
Nodes (4): @angular/platform-browser@^19.1.0, @angular/platform-browser, AppComponent, appConfig

### Community 6 - "guestbook.service.ts"
Cohesion: 0.15
Nodes (9): firebase, app, db, RSVPFormData, MAX_LOADED_WISHES, MAX_WISHES_PER_DEVICE, PhoneValidationResult, RsvpService (+1 more)

### Community 7 - "guestbook.component.ts"
Cohesion: 0.10
Nodes (22): Rules that are easy to break, @angular/forms, canvas-confetti, GuestOption, cap(), cleanCompanion(), cleanName(), cleanWord() (+14 more)

### Community 8 - "Link cá nhân hoá cho khách mời"
Cohesion: 0.17
Nodes (11): Công thức Google Sheet, Ghi chú, Ký tự 1: nhóm xưng hô, Ký tự 2: gia đình, Ký tự 3: đổi cách tự xưng, Link cá nhân hoá cho khách mời, Link ngắn `?g=`, Mã gộp `x` (+3 more)

### Community 13 - "AudioService"
Cohesion: 0.10
Nodes (7): Architecture, Commands, graphify, Project, Setup requirement, AudioService, GuestbookService

### Community 16 - "tsconfig.app.json"
Cohesion: 0.25
Nodes (7): ./tsconfig.json, compilerOptions, outDir, types, extends, files, include

### Community 18 - "preview-public.sh"
Cohesion: 0.40
Nodes (4): APP_PORT, print_qr(), PROJECT_DIR, preview-public.sh script

### Community 28 - "wedding-invitation"
Cohesion: 0.12
Nodes (16): cli, analytics, newProjectRoot, projects, wedding-invitation, $schema, skipTests, standalone (+8 more)

## Knowledge Gaps
- **3 isolated node(s):** `./tsconfig.json`, `APP_PORT`, `PROJECT_DIR`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 197 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AlbumComponent` connect `AlbumComponent` to `app.component.ts`, `guestbook.component.ts`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppComponent` (e.g. with `Architecture` and `Rules that are easy to break`) actually correct?**
  _`AppComponent` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `./tsconfig.json`, `APP_PORT`, `PROJECT_DIR` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.component.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07704918032786885 - nodes in this community are weakly interconnected._
- **Why does `CoverComponent` connect `CoverComponent` to `app.component.ts`, `AudioService`, `guestbook.component.ts`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `app.component.ts` to `package.json`, `AppComponent`, `guestbook.service.ts`, `guestbook.component.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._