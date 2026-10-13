# Data Model

## Topic

- `id`: unique stable identifier; `order`: position from 1 to 7.
- `title`, `objective`, `terms`, `lesson`, `workedExample`: reviewed English teaching content.
- `questionPools`: multiple-choice and typed pools, each with 40 distinct variants.
- All topics, including supernetting, are available immediately. Only typed practice is gated by five consecutive correct multiple-choice answers in that topic.

## Question

- `id`, `variantId`, `topicId`, `mode`, `prompt`, `answerFormat`.
- `solution`: canonical answer, intermediate values, and ordered explanation steps.
- `options`: four unique options for multiple choice, absent for typed practice.
- Exactly one option equals the canonical answer. Exclude the previous variant when selecting.
- Numeric scope and exact-summary constraints follow FR-017.

## Attempt Result

- `questionId`, normalized answer, outcome (`invalid`, `correct`, or `incorrect`).
- Invalid results contain only a format hint; graded results contain answer and explanation.
- Supported formats: unsigned decimal integer without leading zeros; exactly eight binary
  digits; four dotted decimal octets from 0–255; canonical aligned network/prefix notation.
- Strip surrounding whitespace. Prefixes outside the declared question scope are invalid.
- Well-formed incorrect values are graded as incorrect, not treated as formatting errors.

## Learning Session

- `completedTopicIds`, `learningTopicId`, `learningMode`, `learningStreak`.
- `activeQuestion`, `gradedResult`, `previousVariantId`.
- Optional `reviewState`: reviewed completed topic, selected mode, fresh streak, and question.
- Initial state: first topic, multiple choice, streak zero, no completed topics, all topics available.
- No state survives page reload. Opening a lesson does not reset an ongoing practice state.

## Transitions

| Event | Effect |
| --- | --- |
| Invalid submission | Show hint; keep question and streak; do not mark graded |
| First correct submission | Mark graded; increment current streak |
| First incorrect submission | Mark graded; reset current streak only |
| Repeated graded submission | No state change |
| Fifth correct multiple choice | Reset streak; set typed mode for next question |
| Third correct typed answer | Complete learning topic; await learner navigation; all topics already available |
| Next after ordinary grading | Select different variant and clear feedback |
| Next before grading | No state change |
| Enter completed-topic review | Save learning practice state; create independent review state |
| Review grading | Update review streak only; preserve completion and learning progress |
| Leave review | Restore learning practice state |
| Final topic completion | Offer review; no next-topic lookup |

The topic-completing feedback remains attached to the question until the learner chooses
navigation. Review does not mark a topic incomplete or unlock another topic.

