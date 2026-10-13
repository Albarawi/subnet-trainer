# Subnet Trainer

A beginner-friendly IPv4 practice app built with vanilla HTML, CSS, and JavaScript.
All seven lessons are available immediately, including supernetting. There are no accounts,
runtime packages, or time limits.

## How practice works

- Each lesson has 40 distinct question examples in each answer mode. The two modes share
  underlying examples; this is not a bank of 80 unrelated exercises per lesson.
- Five consecutive correct multiple-choice answers unlock typing for that lesson.
- Three consecutive correct typed answers mark the lesson complete.
- A wrong answer resets only the current streak. Malformed input gives a hint without changing it.
- After typing unlocks, either answer mode is available. Completed lessons offer review.
- Switching lessons preserves their individual progress during the open page session.
- Refreshing or closing the page clears progress and typed unlocks. There is no saved account.
- Questions are selected randomly, excluding the immediately previous variant. Failed questions
  are not prioritized, and a question can repeat later.

The lessons cover binary/decimal octets, IPv4 address structure, prefix lengths and masks,
network/broadcast addresses, usable hosts, equal subnet division, and exact supernetting.
Ordinary subnet exercises use /8–/30. Lessons explain the /31 and /32 exceptions, but those
special cases are outside graded host-count practice.

## Run locally

Open this project folder in VS Code, then choose **Terminal → New Terminal**.
Serve it over HTTP rather than double-clicking `index.html`, because the app uses JavaScript modules.

If a working Python installation is on your PATH:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

On the computer used for this project, Python is bundled with Codex. Use this verified path
if the regular `python` command opens the Windows Store or fails:

```powershell
& "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m http.server 8000 --bind 127.0.0.1
```

Open [http://localhost:8000](http://localhost:8000) in your browser. In VS Code, press
**Ctrl+Shift+P**, choose **Browser: Open Integrated Browser**, and enter the same address.
Keep the server terminal running; stop it with **Ctrl+C**.

If port 8000 is already in use, the existing preview may still be running. Use that preview,
or choose port 8001 in the command and open `http://localhost:8001` instead.
The server binds only to your own computer. No deployment or publication is required.

## Run automated tests

Node.js 24 or newer is required. From the project folder:

```powershell
npm test
```

No `npm install` is needed: the project has no package dependencies. The test command runs
Node's built-in test runner. You can also run only the subnet math tests:

```powershell
node --test tests/ipv4.test.js
```

Tests check independent subnet reference answers, question pools, answer formats, grading,
streaks, lesson switching, typed unlocks, and review-state restoration. Passing them does not
prove that every browser interaction or lesson is educationally effective.
See [the review report](specs/001-subnet-trainer/review.md) for verified outcomes and remaining checks.

## Understand the files

| File or folder | Responsibility |
| --- | --- |
| `index.html` | Page shell and entry-module loading |
| `styles.css` | Layout, colors, controls, and visible keyboard focus |
| `src/app.js` | Connects user actions to state changes and rendering |
| `src/ipv4.js` | Pure IPv4 arithmetic, equal splits, and exact summaries |
| `src/lessons.js` | Lesson text and the forty-example pools |
| `src/questions.js` | Builds prompts, choices, canonical solutions, and explanations |
| `src/grading.js` | Separates malformed input from correct or incorrect answers |
| `src/session.js` | Tracks per-lesson state, streaks, typed unlocks, completion, and review |
| `src/ui.js` | Renders lesson, practice, feedback, and review screens |
| `tests/` | Automated tests; `fixtures/ipv4-reference.json` contains hand-derived answers |
| `package.json` | Declares module mode and the test command; no dependencies |
| `.specify/memory/constitution.md` | Project principles |
| `specs/001-subnet-trainer/spec.md` | What the learner experience must do |
| `specs/001-subnet-trainer/plan.md` | Technical approach |
| `specs/001-subnet-trainer/tasks.md` | Work checklist and milestone history |
| `.agents/skills/` | Spec Kit workflows for Codex; not application code |

For learning the code, follow one action: `app.js` receives **Check answer**, `session.js`
calls `grading.js` and updates the streak, then `ui.js` redraws the feedback. The question's
solution comes from `questions.js`, backed by arithmetic in `ipv4.js`.

## Scope and project status

The feature flows are implemented and the owner has tried the app. Progress is session-only.
Git history is initialized locally. Uploading source to GitHub is separate from deploying a public website. Broader human learning
validation still requires participants; no claim of measured learning improvement is made.

