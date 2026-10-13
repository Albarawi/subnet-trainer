# Feature Specification: Beginner IPv4 Subnet Trainer

**Feature Branch**: None; this project has not been initialized as a Git repository.

**Created**: 2026-10-13

**Status**: Draft for project-owner review

**Input**: User description: Build a beginner IPv4 subnetting trainer with brief lessons,
multiple choice progressing to typed answers, explained feedback, correct-answer streak
progression, no hard time limit, and supernetting after the foundations.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Learn and Practice a Foundation (Priority: P1)

A beginner reads a brief lesson with a worked example, answers a multiple-choice question,
and receives an explanation before choosing to continue.

**Why this priority**: A single understandable lesson and accurately graded practice question
provide the smallest useful learning experience.

**Independent Test**: Open the binary-and-decimal lesson, answer one question correctly and
another incorrectly, and confirm both explanations teach the solution.

**Acceptance Scenarios**:

1. **Given** a new learner, **When** they open the first lesson, **Then** they see its objective,
   explained terms, a worked example, and an action to start practice without creating an account.
2. **Given** a multiple-choice question, **When** the learner submits the correct option,
   **Then** the trainer identifies it as correct and explains the reasoning.
3. **Given** an incorrect submission, **When** feedback appears, **Then** the correct answer and
   solution steps are visible, and the learner chooses when to continue.
4. **Given** an unanswered question, **When** the learner waits for ten minutes, **Then** the
   question remains answerable with no timeout, score penalty, or forced advancement.

### User Story 2 - Progress to Typed Answers (Priority: P2)

A learner builds a streak of correct answers, moves from recognition to recall by typing
answers, and unlocks typed practice independently for each lesson. All topics are available immediately.

**Why this priority**: Progression encourages understanding while preserving a beginner's pace.

**Independent Test**: Start a fresh topic, submit five consecutive correct multiple-choice
answers, then three consecutive correct typed answers; verify typed access and topic completion.

**Acceptance Scenarios**:

1. **Given** a topic in multiple-choice mode, **When** its fifth consecutive correct answer is
   graded, **Then** feedback announces that typed practice is available for the next question.
2. **Given** typed practice, **When** the learner submits three consecutive correct answers,
   **Then** the topic is marked complete; all other topics remain available.
3. **Given** a nonzero streak, **When** a valid but incorrect answer is graded, **Then** the
   current streak resets to zero, the current mode remains, and completed topics stay complete.
4. **Given** an empty or malformed typed answer, **When** it is submitted, **Then** a format
   hint appears without revealing the solution or changing the streak.
5. **Given** an already graded question, **When** submission is repeated, **Then** the streak
   changes at most once for that question.

### User Story 3 - Revisit Topics and Learn Supernetting (Priority: P3)

A learner selects a completed topic for more practice or opens supernetting at any time to
learn when adjacent networks can be summarized into a supernet.

**Why this priority**: Review reinforces learning; supernetting extends the foundations.

**Independent Test**: From a fresh session, open supernetting,
read its example, solve a valid summary, and identify a set that cannot be summarized exactly.

**Acceptance Scenarios**:

1. **Given** a completed topic, **When** the learner selects it, **Then** they can reread the
   lesson and practice without losing existing topic completion.
2. **Given** incomplete core topics, **When** the topic list is displayed, **Then** supernetting
   and every other lesson are available; only typed practice is locked per lesson.
3. **Given** a fresh session, **When** the learner opens supernetting, **Then** its lesson
   explains adjacency, alignment, and avoiding unintended extra addresses before practice.
4. **Given** the networks 192.168.0.0/24 and 192.168.1.0/24, **When** the learner submits
   192.168.0.0/23 as their exact summary, **Then** the answer is accepted and explained.
5. **Given** 192.168.1.0/24 and 192.168.2.0/24, **When** the question asks whether one prefix
   represents exactly those networks, **Then** the correct answer is no, with alignment explained.

### Edge Cases

- Empty input, invalid octets, missing octets, unsupported prefixes, and extra characters receive
  format guidance rather than being counted as knowledge errors.
- Leading and trailing whitespace is ignored; leading zeros within typed numbers are rejected
  with a formatting hint to keep the accepted notation explicit.
- A question spanning an octet boundary must use the same correct result in grading and feedback.
- Ordinary usable-host questions use prefixes /8 through /30 and exclude network and broadcast
  addresses. The /31 and /32 exceptions are explained but are not graded host-count exercises.
- Exact-supernet exercises distinguish adjacent aligned sets from nonadjacent or misaligned sets;
  accepting a summary that silently includes additional addresses is prohibited.
- Repeated submission cannot count the same answer twice; continuing cannot skip unanswered work.
- Reviewing completed material does not revoke completion or alter per-topic typed unlocks.
- Refreshing or closing the session starts a new learning session in this first version; this
  limitation is stated before practice begins.
- After the final topic is completed, a completion message offers review rather than a nonexistent
  next topic. Incorrect answers never cause a game-over state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Learners MUST start learning in a browser without registration or sign-in.
- **FR-002**: The trainer MUST present these topics in order: binary and decimal octets; IPv4
  address structure; prefix lengths and subnet masks; network and broadcast addresses; usable
  host ranges and counts; dividing a network into equal subnets; exact supernetting.
- **FR-003**: Each topic MUST provide a lesson with an objective, explained terms, a worked
  example, and access to practice. Lessons MUST remain available during practice.
- **FR-004**: Practice MUST show one question at a time with an explicit submission action.
  Multiple-choice questions MUST have four distinct options and exactly one correct answer.
- **FR-005**: Each lesson MUST begin with typed practice locked. Five consecutive correct multiple-choice answers MUST unlock typed practice for that lesson for the current session. Learners MAY choose either mode afterward.
- **FR-006**: Three consecutive correct typed answers MUST mark that lesson complete. All lessons are available independently of completion.
- **FR-007**: A valid incorrect answer MUST reset only the current streak. It MUST NOT revoke
  completed topics, force a return to multiple choice, or end the session.
- **FR-008**: The trainer MUST display the topic, mode, streak target (five for multiple choice, three for typing), completion, and per-lesson typed unlock. Every lesson MUST be available from the start. Switching lessons MUST preserve their individual practice state within the session.
- **FR-009**: Every graded answer MUST show correctness, the expected answer, and solution steps.
  Feedback MUST stay visible until the learner explicitly requests the next question.
- **FR-010**: Typed questions MUST state the required answer format with an example: decimal
  integer, eight-bit binary octet, dotted-decimal address or mask, or network/prefix notation.
  Each question MUST request a single answer value; ranges are tested using endpoint questions.
- **FR-011**: Empty or malformed submissions MUST show a specific format hint without affecting
  the streak. Surrounding whitespace MUST be ignored; case MUST be ignored for any textual answer.
- **FR-012**: Submission MUST grade each question at most once. Multiple-choice options MUST NOT
  change after the learner has selected an option on the current question.
- **FR-013**: Questions MUST use concepts introduced in the current or earlier lessons. Each
  topic and answer mode MUST offer 40 distinct question examples or variants, and
  consecutive questions MUST NOT be identical.
- **FR-014**: No lesson or question MUST impose a hard time limit, countdown, or inactivity penalty.
- **FR-015**: Learners MUST be able to revisit completed topics. Review begins with a choice of
  multiple-choice or typed practice, uses a fresh streak, and preserves all prior completion.
- **FR-016**: Supernetting MUST be available immediately, like every other lesson. Its exercises MUST cover exact valid summaries and recognition of sets with no exact single-prefix summary.
- **FR-017**: The graded subnetting scope MUST use IPv4 prefixes /8 through /30. Supernetting
  MUST summarize two or four equal-sized networks with an exact result in the same prefix range.
  Lessons MUST explain that /31 and /32 require different host-count treatment.
- **FR-018**: The first version MUST retain progress while switching lessons during an open
  session and clearly state that progress is not retained after refreshing or closing it.
- **FR-019**: Lessons, answer controls, submission, feedback, and navigation MUST be usable with
  a keyboard. Correctness and completion MUST be communicated in text as well as any color.
- **FR-020**: The primary learning flow MUST remain readable and operable at viewport widths
  from 360 to 1440 pixels without horizontal scrolling of lesson text or answer controls.
- **FR-021**: Completing the final topic MUST show completion and offer practice on completed
  topics without requiring an account, sharing results, or starting a new session.

### Key Entities *(include if feature involves data)*

- **Topic**: A learning objective, sequence position, lesson, and practice material.
- **Question**: A topic, answer mode, prompt, required format, expected answer, explanation,
  and optional multiple-choice options.
- **Attempt**: One submitted answer and its outcome: invalid format, correct, or incorrect.
- **Learning Session**: Available and completed topics, active topic, active mode, current
  streak, current question, and whether that question has already been graded.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new learner can reach the first practice question from the opening screen in
  no more than three actions, without registration or outside instructions.
- **SC-002**: All seven topics have an objective, explained terminology, a worked example,
  and 40 distinct practice examples or variants for each answer mode.
- **SC-003**: Every answer in an independently verified reference set covering all seven topics,
  both answer modes, and stated prefix boundaries receives the correct result and explanation.
- **SC-004**: In scripted learner walkthroughs, the fifth consecutive correct multiple-choice
  answer unlocks typing and the third consecutive correct typed answer completes the topic,
  each exactly once; invalid input never changes streaks.
- **SC-005**: Every graded question displays solution reasoning; every incorrect answer displays
  the expected answer; all feedback remains until explicit learner continuation.
- **SC-006**: A question remains usable after ten minutes of inactivity with no penalty.
- **SC-007**: A learner can complete lesson, answer, feedback, and review flows using only a
  keyboard, with textual status indications, at the specified viewport widths.
- **SC-008**: In an initial review with three beginner learners, at least two can finish the
  first lesson and identify from wrong-answer feedback how the expected answer was obtained,
  without assistance. This is a validation target, not a claim of achieved learning effectiveness.

## Assumptions

- The project owner requested forty-question pools, immediate access to every lesson, and a
  five-answer multiple-choice streak to unlock typing on 2026-10-13. Typed completion remains
  three consecutive correct answers. Progress remains session-only.
- English is the first-version lesson language. The intended audience knows basic arithmetic
  but does not require prior subnetting knowledge.
- The seven-topic order, exercise prefix limits, and session-only progress are proposed scope
  defaults. Persistent progress can be considered separately if requested.
- A first version serves a single learner at a time, without accounts, leaderboards, multiplayer,
  instructor dashboards, paid features, or cloud synchronization.
- IPv6, variable-length subnet allocation, routing configuration, and special /31 or /32 graded
  exercises are outside this first version.
- Learners provide a browser and keyboard or touch input; no external learning service or
  existing authentication system is required.
- The project constitution supplies development principles. Technical implementation choices
  will be documented in the later plan rather than specified here.

