# User Interface Contract

This application exposes a browser learning interface, not a public network API.

## Topic and lesson view

Show ordered topic names with available or complete status. Every topic opens immediately.
Lessons show objective, terms, a worked example, and practice controls. Typed practice is disabled
until five consecutive correct multiple-choice answers in that lesson; afterward both modes
are available. State clearly that reload clears progress, including typed unlocks.

## Practice view

Show topic, mode, current streak and target. A form presents one prompt and a format example.
Use a labeled radio group for four multiple-choice options or a labeled text field for typed
answers. Submit validates format first. Invalid input leaves the question editable and announces
a hint. Graded input locks the answer and shows correctness, expected answer, and solution steps.
Next is unavailable before grading. The learner controls continuation; no timer advances it.

At a mode threshold announce the new mode; at completion offer the next lesson. After the final
topic offer completed-topic review. Review offers mode selection and a Return to Learning action.
Lessons remain accessible without erasing practice state.

## Accessibility and responsive behavior

Use semantic headings, associated labels, native buttons, visible focus, and keyboard-operable
controls. Feedback has a polite live announcement and visible text. Color supplements text only.
Keep feedback until explicit continuation. Lesson text and controls fit 360–1440px viewports
without horizontal scrolling. Do not insert learner input as HTML.

## Reliability

Each question can affect a streak only once. Canonical answers and displayed explanations come
from the same solution object. No registration, external-service call, persistence, or sharing
is part of the learning contract.
