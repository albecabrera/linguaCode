# Mission 07 — Regeln an Testbeispielen prüfen

- Source hour: Module 3, Stunde 3; original activity remains at `pages/ki8/modul-3.html#stunde-3`.
- Public route: `pages/ki8/stunde-7/` (`/ki8/stunde-7/`).
- Duration: 45 minutes.
- Learning focus: apply `Temperatur ≥ 18 °C → Fenster offen`, otherwise `Fenster zu`; compare predictions with the known test label and recognize a misclassification.
- Data and privacy: fictional temperature examples only; no learner information is collected or transmitted. Progress uses the isolated local `ki-07` key.
- Sources: inf-schule's supervised decision-tree learning page and Experience AI Lesson 4 remain linked. Experience AI targets ages 11–14; inf-schule does not state a target grade. Their licenses are not stated.
- [Studyflix: Überwachtes Lernen](https://studyflix.de/informatik/ueberwachtes-lernen-8445) is a German video, 5:21 long. Its test-phase segment starts at 1:34 and compares a prediction for new fruit examples with the actual label. The page does not state a target grade or license. Its text says accuracy is measured and optimized but does not clarify whether the same test examples are used for optimization. Use the clip only to illustrate prediction-vs-label comparison; do not treat it as guidance to tune on test data.
- Teacher resource: [ProDaBi: Künstliche Intelligenz und Maschinelles Lernen mit Entscheidungsbäumen](https://www.prodabi.de/materialien/kuenstliche-intelligenz-und-maschinelles-lernen-mit-entscheidungsbaeumen/) covers labeled test examples, prediction comparisons, and misclassification; the package is CC BY-SA 4.0. Its embedded video players appear as Vimeo/YouTube placeholders and their language, duration, and specific content could not be verified, so they are not recommended as the mission video.
- Test labels remain unchanged so the comparison remains meaningful; possible rule changes must rely on training examples, never the held-out test labels.
