# Graph Report - wedding-invitation  (2026-11-12)

## Corpus Check
- 35 files · ~22,197 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .css 2, .rules 1)

## Summary
- 414 nodes · 692 edges · 28 communities (10 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dd409ab8`
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
- wedding-invitation
- GuestbookService
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

## God Nodes (most connected - your core abstractions)
1. `AlbumComponent` - 43 edges
2. `CoverComponent` - 29 edges
3. `@angular/core` - 23 edges
4. `PageViewService` - 20 edges
5. `AppComponent` - 19 edges
6. `@angular/common` - 17 edges
7. `compilerOptions` - 15 edges
8. `AudioService` - 14 edges
9. `RsvpModalComponent` - 14 edges
10. `EventsComponent` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Architecture` --references--> `AppComponent`  [INFERRED]
  CLAUDE.md → src/app/app.component.ts
- `Architecture` --references--> `CoverComponent`  [INFERRED]
  CLAUDE.md → src/app/components/cover/cover.component.ts
- `Architecture` --references--> `GuestbookService`  [INFERRED]
  CLAUDE.md → src/app/services/guestbook.service.ts
- `Architecture` --references--> `PageViewService`  [INFERRED]
  CLAUDE.md → src/app/services/pageview.service.ts
- `Architecture` --references--> `RsvpService`  [INFERRED]
  CLAUDE.md → src/app/services/rsvp.service.ts

## Import Cycles
- None detected.

## Communities (28 total, 18 thin omitted)

### Community 0 - "app.component.ts"
Cohesion: 0.08
Nodes (26): @angular/common, @angular/core, @angular/forms, canvas-confetti, PageInfo, BankGiftComponent, BannerComponent, IntroductionComponent (+18 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (49): dependencies, @angular/animations@^19.1.0, @angular/common@^19.1.0, @angular/compiler@^19.1.0, @angular/core@^19.1.0, @angular/forms@^19.1.0, @angular/platform-browser-dynamic@^19.1.0, @angular/router@^19.1.0 (+41 more)

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

### Community 7 - "wedding-invitation"
Cohesion: 0.12
Nodes (16): cli, analytics, newProjectRoot, projects, wedding-invitation, $schema, skipTests, standalone (+8 more)

### Community 13 - "AudioService"
Cohesion: 0.13
Nodes (7): Architecture, Commands, graphify, Project, Rules that are easy to break, Setup requirement, AudioService

### Community 16 - "tsconfig.app.json"
Cohesion: 0.25
Nodes (7): ./tsconfig.json, compilerOptions, outDir, types, extends, files, include

### Community 18 - "preview-public.sh"
Cohesion: 0.40
Nodes (3): APP_PORT, PROJECT_DIR, preview-public.sh script

## Knowledge Gaps
- **3 isolated node(s):** `./tsconfig.json`, `APP_PORT`, `PROJECT_DIR`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 177 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AlbumComponent` connect `AlbumComponent` to `app.component.ts`, `AudioService`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **What connects `./tsconfig.json`, `APP_PORT`, `PROJECT_DIR` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.component.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07680491551459294 - nodes in this community are weakly interconnected._
- **Why does `CoverComponent` connect `CoverComponent` to `app.component.ts`, `AudioService`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.053061224489795916 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `app.component.ts` to `package.json`, `AppComponent`, `guestbook.service.ts`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Should `options` be split into smaller, more focused modules?**
  _Cohesion score 0.07671957671957672 - nodes in this community are weakly interconnected._