# Subnet Trainer Constitution

## Core Principles

### I. Accurate Subnetting

Calculations, accepted answers, and explanations MUST agree with IPv4 addressing rules.
Expected results MUST be checked against independently derived examples and boundary cases.
Special address or prefix behavior MUST be explained wherever it affects an answer.
Incorrect calculations, grading, or teaching material MUST be corrected before the affected
content is declared ready for learners. A learning tool must not teach a confidently wrong answer.

### II. Teach Beginners Clearly

Lessons MUST introduce concepts gradually and explain unfamiliar terms before relying on them.
Each lesson MUST provide a clear learning objective and a worked example. Questions MUST use
knowledge already introduced or provide the context needed to answer them. Wording MUST be
understandable without prior subnetting expertise.

### III. Explain Feedback

Every graded answer MUST state whether it is correct and explain the solution. Incorrect-answer
feedback MUST include the correct answer and the reasoning needed to reach it. Feedback MUST be
respectful and distinguish an invalid input format from an incorrect result. The purpose is to
help the learner understand, not merely to record a score.

### IV. Keep the Project Understandable

The browser application MUST use vanilla HTML, CSS, and JavaScript. Code MUST use descriptive
names and separate calculations, grading, progression, and presentation into clear
responsibilities. Dependencies and abstractions MUST provide a concrete benefit that outweighs
the additional setup and concepts they introduce. Development explanations MUST help the project
owner understand what changed, why, and how to inspect or run the result in VS Code.

### V. Verify Learning-Critical Behavior

Calculations, answer grading, and progression rules MUST have automated tests covering ordinary
behavior and meaningful boundary cases. Expected answers MUST be derived independently of the
implementation under test. Changes MUST pass relevant tests before being declared complete.
The learning flow MUST also be checked in a browser, including keyboard interaction, input
handling, and feedback visibility. Test volume or coverage alone MUST NOT be treated as proof
of educational correctness.

## Project Boundaries

The project teaches beginner IPv4 subnetting and supernetting. The recommended lesson order
starts with foundations, but all lessons are available immediately as requested by the owner.
Learning MUST support practice at the learner's own pace without a hard time limit. Detailed
lessons, question formats, and progression thresholds belong in the feature specification.
Architecture details beyond the agreed vanilla browser stack belong in the implementation plan.

## Development and Learning Workflow

Work MUST proceed through reviewed stages: constitution, specification, clarification where
needed, plan, tasks, implementation, and verification. Each stage MUST explain its purpose and
produce an artifact the project owner can inspect before proceeding. Completing a stage MUST NOT
be treated as authorization to execute later stages automatically. Specifications MUST describe
learner needs and observable behavior; plans MUST explain the technical approach; tasks MUST
connect implementation work to those requirements.

## Governance

This constitution governs specifications, plans, implementation, and review. Each stage MUST be
checked against these principles. Conflicts MUST be resolved or raised as proposed amendments
before conflicting work proceeds.

Amendments MUST record the reason, affected principles, and impact on existing artifacts. The
project owner MUST approve changes to agreed principles before adoption. Relevant specifications
and plans MUST then be reviewed for consistency.

Versions follow semantic versioning: major for incompatible principle changes or removals,
minor for added principles or materially expanded obligations, and patch for clarifications
that do not change obligations. Retain the original ratification date and update the last amended
date when adopting a change.

**Version**: 1.0.1 | **Ratified**: 2026-10-13 | **Last Amended**: 2026-10-13


