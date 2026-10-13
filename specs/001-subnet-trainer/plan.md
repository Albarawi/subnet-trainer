# Implementation Plan: Beginner IPv4 Subnet Trainer

**Branch**: No Git branch exists; the setup script reports the feature identifier
`001-subnet-trainer`. | **Date**: 2026-10-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification in `specs/001-subnet-trainer/spec.md`.

## Summary

Build a small browser application with seven lessons and accurately graded practice.
Use vanilla HTML, CSS, and JavaScript modules, with no runtime packages or backend.
Keep arithmetic, question generation, grading, session progression, and page rendering
separate so the owner can inspect and understand each responsibility in VS Code.
Five correct multiple-choice answers lead to typed practice; three correct typed
answers complete the topic. Progress exists only in the open page session.

## Technical Context

**Language/Version**: HTML5, CSS, modern JavaScript ES modules; Node.js 24 for tests.
**Primary Dependencies**: None at runtime; Node built-in test and assertion modules for tests.
**Storage**: In-memory session state; no persistent browser storage or database.
**Testing**: Node built-in test runner for pure logic and content checks; manual browser
acceptance checks for UI, keyboard behavior, responsiveness, and inactivity.
**Target Platform**: Current desktop Chrome and Edge; responsive browser layout at 360–1440px.
**Project Type**: Static browser application, locally served over HTTP.
**Performance Goals**: Feedback visible within 200ms of submission during local checks;
no external network dependency after initial assets load. This is a design target to verify.
**Constraints**: No framework, account, countdown, cloud service, or runtime package.
Question scope and special-prefix handling follow FR-017; typed answers use explicit formats.
**Scale/Scope**: Seven topics, two practice modes, 40 variants per topic and mode,
one learner per page session.

## Constitution Check

Pre-research and post-design review: all five gates pass as design commitments.
Implementation verification remains outstanding; passing this review is not a test result.

| Principle | Planned evidence |
| --- | --- |
| Accurate subnetting | Independent reference fixtures, prefix boundary tests, agreement between grading and explanations |
| Teach beginners clearly | Ordered lesson content with objective, definitions, and worked example |
| Explain feedback | Explicit expected answer and reasoning; format errors handled separately |
| Keep project understandable | Vanilla modules, descriptive names, no runtime dependencies; documented run guide |
| Verify learning-critical behavior | Arithmetic, grading, session, content tests plus browser validation |

No constitution exceptions are required. No unresolved technical decisions remain.

## Project Structure

### Documentation (this feature)

```text
specs/001-subnet-trainer/
  spec.md
  plan.md
  research.md
  data-model.md
  quickstart.md
  contracts/ui-contract.md
  checklists/requirements.md
```

The next stage creates `tasks.md`; it is not created during planning.

### Source Code (repository root)

Planned files below do not exist yet:

```text
index.html
styles.css
package.json
src/
  app.js
  ipv4.js
  lessons.js
  questions.js
  grading.js
  session.js
  ui.js
tests/
  fixtures/ipv4-reference.json
  ipv4.test.js
  questions.test.js
  grading.test.js
  session.test.js
  content.test.js
```

**Structure Decision**: One static application. The arithmetic and session modules have no
DOM dependency and are tested directly. The UI reads session state and renders semantic HTML.
A small package manifest selects ES modules and exposes a test command; no package install
is needed. Python's existing standard-library HTTP server serves the project for development.

## Complexity Tracking

No violations or added complexity requiring an exception.

## Design and Validation Approach

- Represent addresses as safe nonnegative numbers from 0 through 4294967295. Prefer arithmetic
  division and multiplication for masks and block boundaries to avoid signed bitwise surprises.
- Share one computed solution object between grading and explanation generation. Tests use
  manually derived expected results rather than the same calculation as their oracle.
- Question generation accepts an injected random source for reproducible tests. Each topic and
  mode has a bounded pool with 40 distinct variants; exclude the previous question.
- Keep invalid input separate from wrong knowledge. Format validation returns a hint without
  exposing a solution or consuming an attempt. Accept surrounding whitespace, reject leading
  zeros, and require canonical network alignment for network/prefix answers.
- State transitions enforce one graded attempt per question. Next is enabled only after grading.
  Topic completion persists within the session; review uses separate practice state and cannot
  change unlocks. An explicit return action leaves review and resumes the current learning topic.
- Use native form controls, associated labels, text status messages, visible focus, and a polite
  live region for feedback. Do not automatically advance or move focus away from feedback.
- Verify all functional requirements with logic/content checks or the manual scenarios in
  quickstart.md. The three-beginner review is a later human validation activity, not automated proof.
- No Git setup, publication, task generation, or implementation is performed in this stage.

