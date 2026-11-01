# Minecraft premium redesign
Objective: Redesign the existing Minecraft adventures interface and publish the verified result.
Branch: `feature/minecraft-adventures`

## Specs
1. **S1:** “haz un rediseño de la interfaz para que se vea mas premium, estilo MineCraft”
2. **S2:** “cuando termines haz un commit + push + veröffentlichung”

## Tasks
- T1 (S1): Prepare and select a visual direction; route: parent; status: done; commit: pending.
- T2 (S1): Implement and verify the redesign without breaking existing adventures; route: parent; status: done; commit: pending.
- T3 (S2): Push and publish the verified public slice, then verify live; route: parent; status: in_progress; commit: pending.

## Log
- L1: haz un rediseño de la interfaz para que se vea mas premium, estilo MineCraft
- L2: cuando termines haz un commit + push + veröffentlichung
- L3: Created `design/minecraft-premium-redesign/` with three self-contained directions: `01-expedition.html`, `02-worlds.html`, and `03-trail.html`. Selected `01-expedition.html` for implementation; others remain alternatives. Opened the design canvas and checked colors against `design/system.md`.
- L4: Implemented the expedition direction in the hub stylesheet. The four existing Minecraft and adjacent catalog Node verifiers and `git diff --check` passed. Independent verifier `mvyfkedb-5-u4t1` confirmed S1, shared tokens, responsive and accessibility hooks, and all four checks. S2 publication remains pending.
