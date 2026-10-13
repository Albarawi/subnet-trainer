# Tasks: Beginner IPv4 Subnet Trainer

**Input**: Design documents in `specs/001-subnet-trainer/`.
**Prerequisites**: Reviewed spec.md, plan.md, research.md, data-model.md,
contracts/ui-contract.md, quickstart.md, and constitution version 1.0.0.
**Tests**: Included because the constitution requires verification of calculations, grading,
and progression, and the specification defines independently verified outcomes.
**Status**: T001–T030 completed on 2026-10-13. README T035 complete. Targeted final checks and requirement review are recorded in review.md; broader checks T031–T034 are not all complete.

## Format: `[ID] [P?] [Story] Description`

Every unchecked box is planned work. `[P]` means work in different files can be done together
after its prerequisites are complete; it does not authorize parallel agents. `[US1]`, `[US2]`,
and `[US3]` connect tasks to the specification's three learner stories.

## Path Conventions

All paths below are relative to the project root. Only setup and arithmetic files exist so far.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the smallest dependency-free development setup.

- [X] T001 Create `package.json` with ES-module mode and a Node built-in test command, without runtime or development packages; create the planned `src/` and `tests/` directories.
- [X] T002 Create `index.html` with language, viewport, title, semantic main region, and references to `styles.css` and `src/app.js`; verify the local HTTP server can serve this shell.

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish independently verified arithmetic used by every learning story.

- [X] T003 Write manually derived reference answers in `tests/fixtures/ipv4-reference.json` for octet conversions, masks, network/broadcast, usable range/count, equal subnet splits, and exact aligned two/four-network summaries; include /8 and /30 and an octet-crossing example.
- [X] T004 Write failing tests in `tests/ipv4.test.js` using those reference answers, malformed addresses, prefix boundaries, misalignment, nonadjacent summaries, and recognition that ordinary host rules must not be applied to /31 or /32.
- [X] T005 Implement tested arithmetic in `src/ipv4.js` using nonnegative address values from 0 through 4294967295; enforce /8–/30 exercise scope, equal source sizes, power-of-two summary counts, adjacency, and exact output alignment.
- [X] T006 Run `tests/ipv4.test.js` and inspect its independently expected values; record the observed pass/fail result beside this phase checkpoint in `specs/001-subnet-trainer/tasks.md` without claiming broader browser validation.

**Checkpoint**: Verified on 2026-10-13: 24 arithmetic tests passed, zero failed. The initial pre-implementation run failed due to the missing module. Reference constants were reviewed against binary weights and block sizes. Starter HTML, CSS, and module returned HTTP 200 on a temporary localhost server. No learner-facing browser walkthrough has been performed.

## Phase 3: User Story 1 - Learn and Practice a Foundation (Priority: P1)

**Goal**: Deliver a useful first lesson, multiple-choice practice, and explained feedback.
**Independent Test**: Read the binary/decimal lesson; grade one correct and one incorrect answer;
confirm the explanations and learner-controlled continuation work without progression features.

### Tests for User Story 1

Write tests first and observe the relevant failure before implementing that behavior.

- [X] T007 [P] [US1] Write first-topic content tests in `tests/content.test.js` for an objective, defined terms, worked example, and the rule "each with at least six distinct variants" for both practice pools.
- [X] T008 [P] [US1] Write generation tests in `tests/questions.test.js` for reproducible injected randomness, four distinct options, exactly one correct answer, exclusion of the previous variant, and agreement between the canonical solution and explanation values.
- [X] T009 [P] [US1] Write multiple-choice grading tests in `tests/grading.test.js` for correct and incorrect selection, missing/unknown selection guidance, and expected-answer explanations based on independent examples.

### Implementation for User Story 1

- [X] T010 [P] [US1] Create the first topic in `src/lessons.js` with a unique stable id, sequence order 1, plain-English objective and terminology, a worked example, and at least six distinct variants per mode; use `data-model.md` for its fields.
- [X] T011 [US1] Implement first-topic question creation in `src/questions.js` with injected randomness and a shared solution object; enforce "Exactly one option equals the canonical answer. Exclude the previous variant when selecting."
- [X] T012 [US1] Implement multiple-choice grading in `src/grading.js`, returning invalid-format guidance or a graded answer with the canonical solution steps; reject missing selections without revealing solutions.
- [X] T013 [US1] Implement basic one-question practice state in `src/session.js`: invalid attempts do not consume a question, graded submissions lock it, repeated submissions have no effect, and Next is unavailable before grading.
- [X] T014 [US1] Connect first-lesson and multiple-choice screens in `src/ui.js` and `src/app.js`; add labeled native controls and focus styles in `styles.css`, lesson access during practice, feedback text, and explicit Next; disclose session-only progress and omit timers.
- [X] T015 [US1] Run the first-topic tests and browser walkthrough for correct/incorrect feedback and a ten-minute idle question; record results in `specs/001-subnet-trainer/quickstart.md`, clearly separating tests passed from checks not yet performed.

**Checkpoint**: First lesson demonstrated and owner-tested on 2026-10-13. All 32 tests passed. Browser checks passed for empty/correct/incorrect answers, lesson return, keyboard continuation, and the same question remaining answerable after ten minutes. Typed answers and progression are not implemented.

## Phase 4: User Story 2 - Progress to Typed Answers (Priority: P2)

**Goal**: Complete the six core lessons with typed answers and streak-controlled progression.
**Independent Test**: From a fresh state, three correct selections change mode; three correct
typed answers complete a topic; wrong answers reset only streak and invalid answers do not.

### Tests for User Story 2

- [X] T016 [P] [US2] Extend `tests/grading.test.js` for decimal, eight-bit binary, dotted octet, and canonical network/prefix formats: "Strip surrounding whitespace", "reject leading zeros", valid wrong values, invalid octets, missing parts, and case-insensitive textual values if any are used.
- [X] T017 [P] [US2] Create `tests/session.test.js` for initial first-topic access; three-answer mode and completion transitions; streak reset; idempotent grading; lesson navigation preserving state; six-topic unlock ordering; final-feedback retention; and reset on a new session.
- [X] T018 [P] [US2] Extend `tests/content.test.js` for the first six ordered topics, objective/terms/example completeness, the six-variant minimum per mode, declared format examples, /31 and /32 lesson caveats, and no unsupported graded prefix questions.

### Implementation for User Story 2

- [X] T019 [US2] Add the remaining five core lessons and both-mode pools in `src/lessons.js`, in FR-002 order; explain masks, network/broadcast, usable endpoints/counts, and equal subnet division, with /31 and /32 caveats outside graded host-count practice.
- [X] T020 [US2] Extend `src/questions.js` and `src/grading.js` for all six core topics and typed formats; each question requests one value with a format example, and a malformed submission returns only a hint without changing a streak.
- [X] T021 [US2] Extend `src/session.js` with completed ids, learning topic/mode/streak, locked topics, and explicit three-answer transitions; preserve completed topics after mistakes and await navigation after topic-completing feedback.
- [X] T022 [US2] Extend `src/ui.js` and `src/app.js` with typed forms, format hints, textual topic/mode/streak status, locked-topic explanations, completion notices, and lesson switching that preserves the current question.
- [X] T023 [US2] Run grading/content/session tests and browser walkthroughs for threshold transitions, malformed input, repeated submit, and reload reset; record observations in `specs/001-subnet-trainer/quickstart.md`.

**Checkpoint**: All six foundations implemented and owner-tested on 2026-10-13. All 41 tests passed. Browser checks passed for mode change, typed feedback, lesson completion/unlocking, and refresh reset. No time limit or persistent storage.

## Phase 5: User Story 3 - Revisit Topics and Learn Supernetting (Priority: P3)

**Goal**: Add completed-topic review and the final exact-supernet lesson.
**Independent Test**: Use a seeded completed-core state to enter the final lesson and grade
aligned/unaligned examples; review a completed topic and return without losing learning state.

### Tests for User Story 3

- [X] T024 [P] [US3] Extend `tests/session.test.js` for final-topic prerequisites, independent review state, review mode selection, "Review grading ... preserve completion and learning progress", restoration on leaving review, and final completion without a next-topic lookup.
- [X] T025 [P] [US3] Extend `tests/questions.test.js` for exact two/four equal-sized network aggregation and rejection of misaligned or nonadjacent sets; verify the spec's 192.168.0.0/24 plus 192.168.1.0/24 example and the invalid 1.0/24 plus 2.0/24 example independently.

### Implementation for User Story 3

- [X] T026 [US3] Add the supernetting lesson and six variants per mode in `src/lessons.js`; explain adjacency, alignment, exact address coverage, and why a covering prefix is a different question.
- [X] T027 [US3] Extend `src/questions.js` and `src/grading.js` for supernet answers and yes/no exact-summary recognition, using tested arithmetic and scope rules; provide explicit formats and solution explanations.
- [X] T028 [US3] Add review enter/leave, separate review streak, final-topic unlock, and all-topics-complete transitions in `src/session.js`; keep reviewed-topic completion and saved learning question intact.
- [X] T029 [US3] Add review mode choice, Return to Learning, supernet lesson/practice, and final completion views in `src/ui.js` and `src/app.js`; preserve learner-controlled feedback navigation.
- [X] T030 [US3] Run supernet/review tests and browser walkthroughs, using seeded state only for verification; confirm normal learners cannot skip locks and record outcomes in `specs/001-subnet-trainer/quickstart.md`.

**Checkpoint**: All 44 automated tests passed on 2026-10-13. Browser completed all seven lessons through normal unlocks. Typed and multiple-choice review worked; returning restored the exact learning question. Final completion offered review without a missing-topic lookup. No browser errors or warnings.

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T031 Check all learning flows using only keyboard controls and at 360, 768, and 1440px widths; fix issues in `index.html`, `styles.css`, and `src/ui.js`, including labels, visible focus, textual color alternatives, and polite feedback announcements.
- [ ] T032 Check safe rendering, browser-console errors, no external requests after loading, lesson preservation, and the plan's local feedback target; fix issues in `src/ui.js` and `src/app.js` and record measured results in `specs/001-subnet-trainer/quickstart.md`.
- [ ] T033 Run the full `tests/` suite and complete the quickstart acceptance walkthrough; map FR-001–FR-021 and SC-001–SC-007 to actual evidence in `specs/001-subnet-trainer/quickstart.md`, leaving any unperformed checks explicitly pending.
- [ ] T034 With the owner's help, perform the three-beginner learning review for SC-008 and record deidentified counts and findings in `specs/001-subnet-trainer/quickstart.md`; if participants are unavailable, retain an explicit pending result rather than claiming completion.
- [X] T035 Write `README.md` with project purpose, file responsibilities, actual run/test instructions, session-only progress and scope limits; reconcile the future-tense instructions in `specs/001-subnet-trainer/quickstart.md` with the implemented commands.

## Dependencies & Execution Order

```text
Setup T001–T002
  -> Foundation T003–T006
  -> US1 T007–T015 (first usable lesson)
  -> US2 T016–T023 (core progression)
  -> US3 T024–T030 (review and supernetting)
  -> Cross-cutting T031–T035
```

Stories are separate verification increments, but US2 integrates with US1 and US3 integrates
with both. Use the sequential story order; do not claim full implementation independence.
Within a story, test definitions precede the corresponding behavior; shared-file edits are
sequential. T034 requires human participants and must not block reporting completed technical
checks with that learning criterion still pending. No push, publication, or Git setup is included.

## Parallel Opportunities and Examples

- US1: T007, T008, and T009 can be written in separate test files after foundation; T010 content
  can be prepared separately from question/grading modules after the content constraints are set.
- US2: T016, T017, and T018 target different test files after the US1 checkpoint.
- US3: T024 and T025 target different test files after the US2 checkpoint.

These are scheduling options only. For guided learning, execute small sequential groups and
explain each group before moving on. Do not edit the same module concurrently.

## Implementation Strategy

### MVP First

Complete setup, foundation, and US1, then demonstrate one lesson with accurate multiple-choice
grading and explained feedback. This first useful slice is not the complete seven-topic game.

### Incremental Delivery

Add core topics and typed progression, verify them, then add review and supernetting. Each
checkpoint must preserve the earlier working flows. Explain the files changed, their purpose,
and verification results to the owner at each teaching milestone.

## Notes

Only mark a task complete after its work and required checks are actually performed. This task
list is not application code and generating it does not authorize execution. A learning review
requires human evidence; passing automated tests alone does not establish learner understanding.






## Owner-requested practice revision — completed 2026-10-13

- Expanded all seven pools to forty distinct prompts per mode.
- Removed lesson prerequisites, including supernetting.
- Added per-topic typed unlocking after five consecutive correct multiple-choice answers.
- Preserved per-topic state while switching lessons and allowed mode selection after unlock.
- Updated the specification and design documents; prior checkpoint results are historical.

