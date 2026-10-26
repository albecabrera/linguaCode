# KI WP8: inventory and safe implementation path

**Status:** phase 1 inventory and an isolated, non-published course prototype. Neither student accounts nor a teacher cockpit nor protected assessments exist yet. Do not hand this prototype to students as a persistent course.

## Existing infrastructure

| Capability | Evidence | Reuse / limit |
| --- | --- | --- |
| Runtime | `public/index.php:11-22`, `public/router.php:1-8` | PHP with SQLite and standalone static modules; no new framework required. |
| Student hosting | `.github/workflows/deploy-automaten.yml:4-8,31-37` | Only `pages/` is uploaded to GitHub Pages on a push to `main`; this branch is not deployed. Pages cannot authenticate or store progress securely. |
| Teacher access | `public/index.php:99-102,288-299` | Existing password-hash session and CSRF protection for teacher editing. Local `php -S` bypasses teacher login; never treat local preview as a security test. No per-student roles. |
| Storage | `database/schema.sql:3-56` | SQLite for exercises and QR links; `exercise_sessions` is only a placeholder. No verified student identity, authorization, feedback, retention or cross-device persistence. Do not migrate the existing database without consent. |
| Cards and links | `public/index.php:143-207`, `pages/index.html:11-15` | Reuse course UI conventions, quiz/matching engines and public-only QR generator. Existing exercise URLs and `/s/` links address public exercises, not private accounts. |
| Local progress | `pages/java/script.js:3-8`, `README.md` | Browser-local only; does not survive device changes. Existing Java teacher-mode toggle is not access control. |
| Checks | `scripts/verify-schema.php`, `scripts/verify-java-interaktiv.mjs`, `scripts/verify-java-interaktiv-ui.mjs` | Focused PHP and Node checks exist; no central test/build system. Do not build per project instruction. |

Existing unrelated uncommitted edits (Tastatur and Java work) predate this feature branch; keep them out of KI commits. `pages/ki8/` is a standalone draft and is **not linked** from the public catalog.

## Materials and rights

`/Users/acabrera/Desktop/KI_WP8` was already extracted; no ZIP was present there. Its README describes 13 PDFs (12 classroom PDFs plus one teacher solution). They were copied to the local ignored `teaching-materials/ki-wp8/source/`; the solution is additionally separated under `source/teacher-only/`. Git ignore excludes the entire source directory, including solutions. The filename `AB1_NÃ¤hrwerte_als_Daten.pdf` contains unusual Unicode/encoding and must not be silently renamed without checking references.

| Supplied group | Present | Teaching use after rights review |
| --- | --- | --- |
| Nutrition data, labels and decision rules | `AB1_NÃ¤hrwerte_als_Daten.pdf`, `AB2_Lebensmittel_Label.pdf`, `Druckvorlage.pdf`, `AB3`–`AB7` PDFs | Concepts for modules 2–3: feature, label, threshold, training vs test and misclassification. Labels are simplified exercise labels, not health judgments. |
| Decision tree / classification | `01_Klassifikation_Anwendung_ver1.pdf`, `02_TrainingEinesEBaumsZurKlassifikation_ver4.pdf` | Monkey example, classification and accuracy. The separate `Lösung_02_TrainingEinesEBaumsZurKlassifikation_ver4.pdf` is **teacher-only**. |
| Chatbot | `AB1 Chatbot AppCamps.pdf`, `Anleitung- ChatBot mit Scratch.pdf` | Concepts for module 5 only; verify external tool terms before student use. |
| Absent from this package | `Präsentation KI Tag 2_3.pdf`, `AB1 Ziffererkennung mit NN.pdf`, `AB2 Ziffererkennung mit NN.pdf`, `anleitung_neuronales-netz-als-enaktives-modell.pdf`, `Stilwell_Brain_small.ods`, `200714-DGE-Arbeitsblaetter-03-formular.pdf` | Optional/reference or background material; copy into the ignored `teaching-materials/ki-wp8/source/` only if available and needed. No ODS was supplied. |

PDF metadata identifies third-party authors; no reuse or redistribution rights have been established. The prototype must use newly written exercises, not copied cards, images, PDFs or solution text. Source files and answers for a graded exam must **never** be placed under `pages/`.

## Sequence and gates

1. Inventory (this file), quarantine sources and document open questions. **Done locally.**
2. Check each original source's licence and map verified NRW WP Informatik 7/8 curriculum competencies against lesson content. Independently author six modules over 18 × 45 minutes: 2 + 2 + 4 + 2 + 3 + 5; distinguish training and test data. External URLs, minors' terms and privacy remain unverified; use no embedded external trackers.
3. Build a small standalone, touch/keyboard-usable **public-safe** card prototype on the feature branch. Its session-local answers are not student accounts or permanent progress. Extend module by module with checked, original tasks and device/accessibility checks. Never expose a graded assessment, student identifiers or confidential solutions in Pages.
4. **Architecture approval gate:** decide whether an independently hosted and security-reviewed PHP/SQLite service is suitable, or whether a school-approved EU-hosted service is necessary. Supabase is a candidate, not selected or configured. Verify host, TLS, backups, access control, AV agreement, threat model and school approval first.
5. Only after approval: separate student/teacher authorization server-side, random code issuance and hashing, login throttling, secure sessions, own-record-only reads/writes, reset/retention policy, feedback, server-protected exams and course-release controls. Test horizontal and vertical privilege boundaries against isolated test data.
6. Verify end-to-end, obtain school/licence/privacy and examination-date approvals, then request explicit permission before any merge, production database change or deployment. GitHub Pages is public hosting, never the protected store.

**Open decision:** Who will operate and approve the protected service (and its EU data location, legal basis, processor agreement, retention period, code reset and backup process)? Without that answer, the persistent course, teacher cockpit and graded exam cannot be safely delivered. The proposed dates 22.12.2026 and 12.01.2027 are unconfirmed, not scheduled.

**Verification path:** check `git check-ignore -v teaching-materials/ki-wp8/source/...`, inspect the branch diff for PDFs/solutions and secrets, run focused prototype checks, then existing regression checks. No build or deploy here.
