# Quickstart and Validation Guide

## Final documentation and specification review — 2026-10-13

See [README](../../README.md) for run/test instructions and file explanations, and
[review.md](review.md) for requirement-by-requirement evidence and residual validation limits.
The latest suite has 46 passing tests. Targeted keyboard review and 360/768/1440px overflow
checks passed. Supernetting-first completion now reports that lesson rather than incorrectly
claiming all lessons are complete. The owner reported the app looked good. The three-beginner
learning review remains pending; it has not been replaced by the owner's feedback.

## Current revision — 2026-10-13

All seven lessons are now available immediately. Each lesson has 40 distinct question variants
per mode. Five consecutive correct multiple-choice answers unlock that lesson's typed practice;
three correct typed answers still mark it complete. Switching lessons preserves individual
practice state and typed unlocks during the current session; refreshing clears them.

Validation: 46 automated tests passed, including all 560 mode-specific question prompts and
answers, availability of every lesson, per-lesson typed gating, and progress restoration.
Browser verification confirmed immediate supernetting access and typing unlocking on exactly
the fifth answer. Earlier milestone notes below describe the prior rules and historical checks.

All seven lessons, IPv4 calculations, typed grading, streak progression, and completed-topic
review are implemented. Final accessibility/performance review and documentation remain pending.

## Review and supernetting verification — 2026-10-13

- All 44 automated tests passed. New review and supernetting tests first failed before their
  implementation. Review tests verify restoration of the question and streak and unchanged unlocks.
- Browser completed all seven lessons through ordinary answer submission and unlocks, without
  seeded state or a learner-accessible shortcut.
- Typed review during lesson 2 restored the original learning question. Multiple-choice review
  after final completion returned to the completion screen. Both mode-choice controls worked.
- Exact summary and no-exact-summary questions were graded correctly in the full walkthrough.
- Final completion offered review and did not look up a nonexistent next lesson.
- No console errors or warnings were recorded in the checked browser flow.
- Final cross-cutting checks, full evidence mapping, README, and human learning review are still
  pending; this milestone does not claim they were performed.

## Core-lesson verification — 2026-10-13

- The new tests first failed for missing core content, typed grading, and progression exports.
- Automated checks cover all core question variants, format validation, hand-derived examples,
  six-topic unlock ordering, duplicate submissions, and streak transition/reset rules.
- Browser checks passed: locked-topic guidance; third-correct mode change; malformed typed input
  keeping the question editable; valid wrong typed feedback; third-correct typed completion;
  explicit navigation to lesson 2; and refresh clearing completed topics.
- The browser console reported no errors or warnings during the checked flow.
- Full seven-topic walkthrough, completed-topic review, broad final accessibility checks, and
  the three-beginner learning review remain pending. Earlier ten-minute inactivity proof applies
  to the first-lesson milestone; no new timer behavior was introduced.

## First-lesson verification — 2026-10-13

- `npm test`: 32 tests passed; zero failed. The new tests first failed with missing modules.
- Browser: empty selection shows a hint without revealing an answer; incorrect selection shows
  the expected answer and solution steps; correct selection shows matching reasoning.
- Graded answer controls lock, and Next presents a different question only after grading.
- Reading the lesson and returning preserves the current question and selected option.
- Focus lands on feedback after grading; keyboard continuation reaches the next question.
- The first practice view has no horizontal overflow at the checked 360px viewport.
- The same unanswered question remained available after ten minutes and accepted the correct answer. The owner also tried the first lesson and reported that it looked good. Broader checks for future stories
  and the three-person learning review remain pending.

## Foundation verification — 2026-10-13

- `npm test`: 24 arithmetic tests passed; zero failed.
- Before implementation, the same test suite failed because `src/ipv4.js` did not exist.
- Hand-derived reference constants cover octets, masks, subnet endpoints/counts, equal splits,
  exact summaries, /8 and /30 boundaries, and an octet-crossing example.
- A temporary localhost HTTP server returned 200 for HTML, CSS, and the entry module, then stopped.
- Browser interaction, lesson content, grading, progression, and learner review remain pending.

## Prerequisites

VS Code, Node 24, the existing bundled Python 3.12, and a current Chrome or Edge browser.
No npm package installation is planned. Open the project folder in VS Code.

## Run commands

From a PowerShell terminal at the project root:

```powershell
node --test
& 'C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000` while the server runs. Stop it with Ctrl+C.
Use HTTP rather than double-clicking the HTML file because browser modules need server loading.

## Acceptance walkthrough

1. Confirm the opening screen states the progress limitation and first practice is reachable in
   at most three actions without an account. Check all seven lesson objectives and examples.
2. Submit correct and incorrect multiple-choice answers. Confirm expected answer and reasoning
   remain until Next. Duplicate submission must not double-count the streak.
3. Obtain three consecutive correct answers: next practice becomes typed with a zero streak.
   Obtain three correct typed answers: topic completes and next lesson unlocks by learner choice.
4. Submit empty input, leading-zero values, invalid octets, and missing prefixes. Each must show
   format guidance without changing the streak. Submit a valid wrong value: only streak resets.
5. Reopen a lesson during practice and return. Review a completed topic in either mode, then
   return to learning. Completion and ongoing learning progress must remain intact.
6. After the foundations, test valid aligned aggregation and invalid exact-summary sets using
   the independent examples in spec.md. Check every reference fixture and prefix boundary.
7. Finish the last topic. Confirm completion offers review and does not attempt another topic.
8. Leave a question idle for ten minutes. Confirm no expiration, penalty, or automatic navigation.
9. Run the whole flow using keyboard controls. At 360, 768, and 1440px widths verify readable
   controls, visible text feedback, and no horizontal lesson/control scrolling.
10. Reload. Confirm progress resets exactly as disclosed. Watch the browser console for errors.

## Learning validation

Ask three beginner reviewers to complete the first lesson and explain the solution using
wrong-answer feedback. Record whether at least two succeed without assistance. This requires
human participation and remains pending until it is performed.

See [UI contract](contracts/ui-contract.md) and [data model](data-model.md) for state details.


