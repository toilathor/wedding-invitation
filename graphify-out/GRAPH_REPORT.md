# Graph Report - wedding-invitation  (2026-11-11)

## Corpus Check
- 33 files · ~16,604 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .css 2, .rules 1)

## Summary
- 361 nodes · 573 edges · 22 communities (10 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `905219b7`
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
- BankGiftComponent
- preview-public.sh
- environment.example.ts

## God Nodes (most connected - your core abstractions)
1. `AlbumComponent` - 28 edges
2. `@angular/core` - 22 edges
3. `PageViewService` - 20 edges
4. `AppComponent` - 17 edges
5. `@angular/common` - 16 edges
6. `compilerOptions` - 15 edges
7. `RsvpModalComponent` - 14 edges
8. `AudioService` - 13 edges
9. `EventsComponent` - 12 edges
10. `InvitationComponent` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Architecture` --references--> `AppComponent`  [INFERRED]
  CLAUDE.md → src/app/app.component.ts
- `Architecture` --references--> `AudioService`  [INFERRED]
  CLAUDE.md → src/app/services/audio.service.ts
- `Architecture` --references--> `PageViewService`  [INFERRED]
  CLAUDE.md → src/app/services/pageview.service.ts
- `Architecture` --references--> `RsvpService`  [INFERRED]
  CLAUDE.md → src/app/services/rsvp.service.ts
- `Architecture` --references--> `ToastService`  [INFERRED]
  CLAUDE.md → src/app/services/toast.service.ts

## Import Cycles
- None detected.

## Communities (22 total, 12 thin omitted)

### Community 0 - "app.component.ts"
Cohesion: 0.09
Nodes (25): @angular/common, @angular/core, @angular/forms, canvas-confetti, PageInfo, BannerComponent, IntroductionComponent, TimeLeft (+17 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (48): dependencies, @angular/animations@^19.1.0, @angular/common@^19.1.0, @angular/compiler@^19.1.0, @angular/core@^19.1.0, @angular/forms@^19.1.0, @angular/platform-browser-dynamic@^19.1.0, @angular/router@^19.1.0 (+40 more)

### Community 2 - "options"
Cohesion: 0.08
Nodes (27): build, serve, builder, configurations, defaultConfiguration, options, development, production (+19 more)

### Community 4 - "compilerOptions"
Cohesion: 0.09
Nodes (21): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, compileOnSave, compilerOptions, esModuleInterop (+13 more)

### Community 5 - "AppComponent"
Cohesion: 0.13
Nodes (4): @angular/platform-browser@^19.1.0, @angular/platform-browser, AppComponent, appConfig

### Community 6 - "guestbook.service.ts"
Cohesion: 0.15
Nodes (9): firebase, app, db, RSVPFormData, MAX_LOADED_WISHES, MAX_WISHES_PER_DEVICE, PhoneValidationResult, RsvpService (+1 more)

### Community 7 - "wedding-invitation"
Cohesion: 0.12
Nodes (16): cli, analytics, newProjectRoot, projects, wedding-invitation, $schema, skipTests, standalone (+8 more)

### Community 8 - "GuestbookService"
Cohesion: 0.16
Nodes (5): Architecture, Commands, Project, Setup requirement, GuestbookService

### Community 16 - "tsconfig.app.json"
Cohesion: 0.25
Nodes (7): ./tsconfig.json, compilerOptions, outDir, types, extends, files, include

### Community 18 - "preview-public.sh"
Cohesion: 0.40
Nodes (3): APP_PORT, PROJECT_DIR, preview-public.sh script

## Knowledge Gaps
- **3 isolated node(s):** `APP_PORT`, `PROJECT_DIR`, `./tsconfig.json`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 160 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AlbumComponent` connect `AlbumComponent` to `app.component.ts`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `APP_PORT`, `PROJECT_DIR`, `./tsconfig.json` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.component.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08521303258145363 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `app.component.ts` to `package.json`, `AppComponent`, `guestbook.service.ts`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05442176870748299 - nodes in this community are weakly interconnected._
- **Why does `AppComponent` connect `AppComponent` to `GuestbookService`, `app.component.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `options` be split into smaller, more focused modules?**
  _Cohesion score 0.07977207977207977 - nodes in this community are weakly interconnected._