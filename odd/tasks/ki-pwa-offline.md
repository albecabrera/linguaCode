# KI installable offline experience
Branch: `feature/ki-mission-cleanup` in `.ki-mission-01`.
Scope: Add an installable KI course shell with same-origin offline caching while preserving local-only progress and external-resource link-only behavior.

## Specs
1. **S1** — User authorization verbatim: "continua con las demas mejoras que propusistes"
2. **S2** — User authorization verbatim: "haz commit + push + deploy"

## Tasks
- T1 (S1,S2): Add KI web manifest, installable icon, and same-origin service worker with bounded cache strategy; route: `pages/ki8/manifest.webmanifest`, `pages/ki8/sw.js`, `pages/ki8/icon.svg`, public verifier; commit: `5fea449`.
- T2 (S1,S2): Register the service worker from the KI catalog and expose local offline/readiness status without transmitting progress; route: `pages/ki8/index.html`, `pages/ki8/app.mjs`, styles/verifiers; commit: `5fea449`.
- T3 (S1,S2): Run delivery/privacy/differential QA, commit, push, deploy, and verify live routes; route: verifier scripts/workflow; commit: pending.

## Log
- L1: User request verbatim: "continua con las demas mejoras que propusistes"
- L2: Assistant identified the deferred remaining improvement as PWA/offline installability.
- L3: User request verbatim: "haz un commit + push + deploy"
- L4: T1/T2 implemented: installable manifest/icon, bounded same-origin KI shell cache with safe navigation fallback and version cleanup, catalog registration, and German local readiness status; no external resources or learner data are cached or transmitted.
- L5: Focused PWA verifier added with RED observed before implementation and GREEN after implementation; public directory contract now includes the three PWA files.
- L6: Review found the initial worker did not precache mission dependencies; expanded it to all 19 mission routes, shared mission modules, and the local QR asset, with network-first navigation and cached-route fallback. Full KI/WP8/PWA/privacy/differential QA passed. Implementation committed as `5fea449`; cumulative branch exceeds the approximate 400-line review target because prior authorized slices are included, and this boundary is recorded here.
