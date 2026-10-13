# Research Decisions

## Browser modules and serving

**Decision**: Use native ES modules, served over local HTTP during development.
**Rationale**: Explicit imports keep responsibilities understandable; local file loading has
module security restrictions. The installed Python can serve static files without new packages.
**Alternatives considered**: Classic scripts and direct file opening; a bundler and framework.
The former weakens explicit boundaries, and the latter adds unnecessary setup for this scope.
**Source**: [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

## Verification

**Decision**: Use Node 24's stable built-in test runner and strict assertions for pure logic.
**Rationale**: The runtime is already installed and requires no test framework. Browser behavior
still needs separate manual checks; these tests do not simulate the browser DOM.
**Alternatives considered**: A third-party unit framework or browser automation package.
Neither is necessary for the first logic suite; automation can be reconsidered if needed later.
**Source**: [Node 24 test runner](https://nodejs.org/docs/latest-v24.x/api/test.html).

## IPv4 and exact supernets

**Decision**: Grade ordinary subnet exercises only within /8–/30. Validate exact aggregation
using adjacency, equal source sizes, power-of-two count, and alignment of the resulting block.
**Rationale**: A covering prefix that includes unintended addresses is not an exact summary.
The /31 point-to-point case is an exception to ordinary usable-host subtraction.
**Alternatives considered**: Covering-prefix questions and advanced /31 exercises; both are
outside the reviewed first-version scope.
**Sources**: [RFC 4632](https://www.rfc-editor.org/rfc/rfc4632.html),
[RFC 3021](https://www.rfc-editor.org/rfc/rfc3021.html#section-2.1).

## Progress and dependencies

**Decision**: In-memory progress with three-answer streaks; no backend or runtime dependencies.
**Rationale**: These match the reviewed scope and make the project easier to inspect.
**Alternatives considered**: Persistent browser progress, accounts, cloud synchronization.
They add behavior the owner has not requested for this version.

All planning decisions are resolved. No software was installed for this research.
