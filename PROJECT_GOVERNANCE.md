# PROJECT_GOVERNANCE.md

# Shared Project Governance
## Codex + Google Antigravity

**Status:** MANDATORY  
**Authority:** Project-wide source of truth  
**Applies to:** Every AI coding agent, human-assisted agent, IDE agent, CLI agent, sub-agent, reviewer, refactor agent, and automated code-editing tool working in this repository.

---

# 1. PURPOSE

This repository may be edited by more than one AI coding system, primarily:

- OpenAI Codex
- Google Antigravity

Different models may reason differently, prefer different architectures, or attempt different implementation styles.

That must NEVER cause the project to split into competing visions.

The goal of this file is to force every agent to work as part of ONE engineering system.

No agent owns the project.

No model may redesign the project according to its own preferences.

No model may treat code written by another model as disposable.

The project must evolve from the existing approved codebase, not from the personality or habits of whichever model is currently active.

---

# 2. ABSOLUTE SOURCE OF TRUTH

The authority order is:

1. The user's latest explicit instruction.
2. This `PROJECT_GOVERNANCE.md`.
3. Approved project specifications, architecture documents, design references, schemas, and product requirements.
4. The current working repository and its established patterns.
5. Existing tests and verified behavior.
6. Explicit documented decisions in `AGENT_HANDOFF.md`.
7. Agent-specific instructions such as `AGENTS.md` or `.agents/AGENTS.md`.
8. Model preference.

**Model preference is always last.**

If an agent personally prefers another framework, folder structure, state library, API pattern, database structure, naming convention, UI architecture, or coding style, that preference is irrelevant unless the user explicitly requests the change.

---

# 3. CODEX BASELINE RULE

Codex is the primary baseline coding environment for this workflow.

This DOES NOT mean Codex is automatically correct.

It means:

- Antigravity must treat the established Codex project structure as the default baseline.
- Antigravity must not replace Codex-established architecture simply because Gemini would have implemented it differently.
- Antigravity should improve the existing implementation in-place.
- If Antigravity detects a genuine architectural problem, it must document the issue before making a large architectural replacement.
- Large architecture changes require an explicit user request or strong technical necessity.

When Codex returns after Antigravity has worked:

- Codex must inspect Antigravity's actual changes.
- Codex must not blindly revert Antigravity changes because they were written by another model.
- Codex should preserve valid improvements.
- Codex should repair only what is demonstrably incorrect, inconsistent, unsafe, broken, or contrary to project requirements.
- Codex must continue from the newest approved repository state.

The result should feel like one engineering team worked on the application.

---

# 4. MANDATORY START-OF-TASK PROCEDURE

Before changing code, EVERY agent must:

1. Read this file completely.
2. Read its agent-specific instruction file.
3. Read `AGENT_HANDOFF.md` if it exists.
4. Inspect the repository structure.
5. Inspect `git status`.
6. Identify existing uncommitted changes.
7. Inspect the relevant existing implementation before proposing replacements.
8. Identify the smallest set of files necessary for the requested task.
9. Determine how the requested change fits the existing architecture.
10. Preserve working behavior outside the requested scope.

Do NOT begin by generating replacement code from assumptions.

Do NOT assume the repository is a blank project.

Do NOT reconstruct components that already exist without first reading them.

---

# 5. EXISTING CODE FIRST

Before creating a new component, hook, service, utility, store, API client, schema, helper, page, route, style system, or abstraction:

SEARCH FIRST.

The agent must determine whether equivalent functionality already exists.

Prefer:

- extending an existing component
- extending an existing service
- using the existing design system
- using existing helpers
- using existing types
- using existing database abstractions
- using existing state management
- using existing API patterns

Avoid unnecessary duplication.

A second implementation of the same concept is considered a defect unless the duplication is intentional and documented.

---

# 6. NO UNSOLICITED REWRITES

The following are prohibited unless explicitly required:

- rewriting entire pages to fix a small bug
- replacing an existing architecture because another approach is "cleaner"
- replacing working libraries with preferred alternatives
- moving large directory trees for aesthetic reasons
- renaming large numbers of files unnecessarily
- converting patterns across the entire repository without instruction
- rebuilding working components from scratch
- replacing a working backend strategy
- changing database providers
- changing authentication systems
- changing routing systems
- changing state-management libraries
- changing UI frameworks
- replacing established styling systems
- changing deployment platforms

For normal feature work, favor SMALL, LOCAL, REVERSIBLE changes.

---

# 7. MINIMAL-DIFF PRINCIPLE

Every implementation should make the smallest correct change that fully solves the task.

Before editing a file, ask:

- Does this file actually need to change?
- Can the task be completed without touching unrelated code?
- Am I modifying formatting that has nothing to do with the task?
- Am I introducing architecture that the task does not need?
- Am I changing behavior outside the user's request?

Avoid drive-by refactors.

Avoid changing unrelated formatting.

Avoid changing unrelated naming.

Avoid "cleaning up" unrelated files during feature work.

---

# 8. NEVER BREAK WORKING FEATURES TO ADD A NEW FEATURE

New functionality must be additive wherever possible.

Before declaring a task complete, verify that existing relevant behavior still works.

This includes:

- navigation
- authentication
- forms
- buttons
- links
- modals
- API calls
- database reads/writes
- state updates
- responsive behavior
- loading states
- error states
- permissions
- build process
- deployment configuration

A new feature is NOT complete if an old feature stopped working.

---

# 9. NO SILENT FEATURE REMOVAL

An agent may not remove or disable existing functionality merely because:

- it appears unused
- it looks redundant
- it complicates implementation
- the agent cannot immediately understand it
- another pattern seems cleaner

Before removing functionality, confirm that removal is part of the task.

If uncertain, preserve it.

---

# 10. ARCHITECTURE STABILITY

The established project architecture must remain coherent.

Before introducing a new architectural pattern, inspect how equivalent problems are already solved in the repository.

Match established patterns unless those patterns are clearly broken.

Examples:

If the project uses:

- Supabase, continue using the existing Supabase architecture.
- React Query, do not create a separate fetch-state system without cause.
- a service layer, use the service layer.
- server actions, follow the current server-action pattern.
- a design-token system, use those tokens.
- centralized route definitions, extend them.
- typed API responses, maintain typing.

Do not create competing subsystems.

---

# 11. DEPENDENCY CONTROL

Do not install a package merely because it makes implementation easier.

Before adding any dependency:

1. Check whether the project already has a suitable dependency.
2. Check whether the functionality can be implemented safely with existing code.
3. Confirm the package is actually necessary.
4. Prefer mature and maintained dependencies.
5. Avoid overlapping libraries that perform the same role.
6. Do not upgrade unrelated packages during feature work.
7. Do not modify lockfiles unless dependency changes require it.

Never replace a core dependency without explicit justification.

---

# 12. DATABASE SAFETY

Database changes require extra caution.

Never:

- drop tables casually
- delete columns casually
- rename columns without checking references
- truncate data
- reset production data
- weaken row-level security
- expose privileged keys
- move secrets into client code
- modify production migrations retroactively when a forward migration is appropriate
- invent schema fields without checking the existing schema

For schema changes:

1. Inspect the current schema.
2. Inspect migrations.
3. Search all references to affected tables and columns.
4. Make backward-compatible changes when practical.
5. Add a forward migration.
6. Update generated types when applicable.
7. Validate affected queries.
8. Document migration impact.

Data preservation is more important than convenience.

---

# 13. AUTHENTICATION AND SECURITY

Never weaken security to make a feature work.

Never:

- expose service-role keys
- hardcode private secrets
- disable authentication globally
- bypass authorization permanently
- disable RLS as a shortcut
- trust client-side role checks as the only authorization layer
- log sensitive user information unnecessarily
- commit `.env` secrets

If a security restriction blocks implementation, solve the underlying permission problem correctly.

---

# 14. UI AND UX PRESERVATION

Do not redesign the interface unless redesign is explicitly part of the task.

When editing UI:

- study the current visual system first
- preserve established typography
- preserve spacing logic
- preserve color logic
- preserve interaction patterns
- preserve component language
- preserve responsive behavior
- reuse existing components
- avoid introducing a visibly different design language

Do not make a page look like it belongs to another application.

Do not add generic AI-generated visual patterns, unnecessary cards, random gradients, decorative glass effects, excessive pills, excessive rounded containers, or visual clutter unless they are already part of the approved design.

If a visual reference has been provided by the user, that reference outranks agent aesthetic preference.

---

# 15. RESPONSIVE DESIGN

Changes must not be considered complete after checking only one viewport.

For UI work, consider at minimum:

- narrow mobile
- normal mobile
- tablet or intermediate width
- desktop

Do not fix desktop by breaking mobile.

Do not fix mobile by deleting useful desktop behavior.

---

# 16. TYPE SAFETY

Do not use weak typing as a shortcut.

Avoid unnecessary:

- `any`
- unsafe type assertions
- blanket ignores
- disabled lint rules
- disabled TypeScript checks

When types reveal a real problem, fix the problem rather than hiding it.

Existing project conventions still take precedence where intentionally different.

---

# 17. ERROR HANDLING

New asynchronous behavior must account for:

- loading
- success
- empty state
- expected error
- unexpected error
- timeout or unavailable service when relevant
- retry behavior when appropriate

Do not swallow errors silently.

Do not expose raw internal errors to end users.

Do not claim success before the operation has actually succeeded.

---

# 18. PERFORMANCE DISCIPLINE

Do not prematurely optimize.

However, avoid clearly wasteful patterns such as:

- repeated identical network requests
- unbounded loops
- rendering huge datasets unnecessarily
- loading large assets without need
- unnecessary re-renders
- repeated database calls that can be combined safely
- blocking UI for unrelated work

Performance changes must preserve correctness.

---

# 19. API AND BACKEND CONSISTENCY

Before creating an endpoint or server function:

- inspect existing endpoint structure
- inspect validation conventions
- inspect authorization patterns
- inspect error-response format
- inspect logging conventions
- inspect naming conventions

New backend code must look like it belongs to the existing backend.

Do not create a parallel API architecture unless explicitly required.

---

# 20. TESTING IS REQUIRED

After code changes, run the most relevant available checks.

Depending on the repository, this may include:

- type checking
- linting
- unit tests
- integration tests
- build
- targeted test files
- browser verification
- API verification
- database validation

Do not say "fixed" solely because the code looks correct.

If a test cannot be run, state that clearly in the handoff.

Do not delete or weaken a failing test simply to make the suite green unless the test itself is demonstrably invalid.

---

# 21. BUILD VALIDATION

If the project has a build command and the change could affect compilation, routing, bundling, types, or runtime imports, run the build before completion whenever practical.

A change that does not compile is not complete.

---

# 22. BUG-FIX PROCEDURE

For a bug:

1. Understand the actual failure.
2. Find the root cause.
3. Check whether the issue exists elsewhere.
4. Make the smallest reliable fix.
5. Test the affected behavior.
6. Check for regression.
7. Avoid unrelated refactors.

Do not treat symptoms if the root cause can be identified safely.

---

# 23. LARGE CHANGE PROCEDURE

A "large change" includes:

- architecture replacement
- database redesign
- auth redesign
- state-management replacement
- routing replacement
- major dependency migration
- broad UI redesign
- large folder restructuring
- deletion of major functionality

Before performing a large change, the agent must:

1. Explain why the existing system cannot reasonably support the requested result.
2. Identify risks.
3. Identify migration impact.
4. Identify affected areas.
5. Prefer staged migration over destructive replacement.
6. Obtain user approval when the task did not already explicitly authorize the change.

---

# 24. GIT IS THE SHARED MEMORY

Git is not optional bookkeeping in a multi-agent workflow.

Before working:

```bash
git status
git log --oneline -n 10
```

When relevant, inspect:

```bash
git diff
git diff --staged
```

Never overwrite unknown uncommitted work.

Never assume uncommitted changes were created by the current agent.

Treat existing uncommitted changes as potentially valuable user or other-agent work.

Do not use destructive commands such as:

```bash
git reset --hard
git clean -fd
git checkout -- .
```

unless the user explicitly requests the destructive operation and understands the effect.

---

# 25. HANDOFF PROTOCOL

This project should maintain:

`AGENT_HANDOFF.md`

When an agent completes meaningful work, it should update the handoff with a concise entry containing:

- Date/time if available
- Agent used
- Task
- Files changed
- Key implementation decisions
- Tests/checks run
- Known issues
- Follow-up work
- Anything the next agent must NOT accidentally undo

Do not turn the handoff into a long diary.

Keep it useful.

---

# 26. CROSS-AGENT RESPECT

When encountering code written by another agent:

DO NOT ask:

> "Would I have written it this way?"

Ask:

> "Does this code work, match the project's requirements, fit the architecture, and remain maintainable?"

Different implementation style alone is not sufficient reason to rewrite working code.

---

# 27. WHEN CODEX AND ANTIGRAVITY DISAGREE

If one agent believes another agent's implementation should be changed, evaluate it against:

1. User requirement
2. Governance rules
3. Product specification
4. Existing architecture
5. Correctness
6. Security
7. Tests
8. Maintainability
9. Performance where relevant

The agent must be able to identify a concrete reason.

Valid reasons include:

- broken behavior
- violated requirement
- security vulnerability
- type/build failure
- failing test
- duplicated system
- architectural conflict
- data-loss risk
- clear maintainability problem

Invalid reasons include:

- "I prefer another approach."
- "This isn't how I usually do it."
- "I would use another library."
- "This could be rewritten more elegantly."
- "Gemini/Codex usually does it differently."

If both implementations are valid, KEEP the existing implementation.

---

# 28. CONFLICT RESOLUTION RULE

If instructions conflict:

- Do not guess silently.
- Follow the authority order in Section 2.
- Preserve user data.
- Preserve working behavior.
- Prefer the least destructive interpretation.
- Document unresolved ambiguity.

When a direct user instruction clearly resolves the conflict, follow the user.

---

# 29. NO FAKE COMPLETION

Never claim:

- "Everything works"
- "Fully fixed"
- "No regressions"
- "Production ready"
- "Tests pass"

unless those claims are supported by actual verification.

Report what was actually checked.

---

# 30. DO NOT HIDE DAMAGE

If a change causes a new issue:

- acknowledge it
- investigate it
- fix it if within scope
- do not conceal it with CSS, ignored errors, disabled tests, fallback hardcoding, or silent catch blocks

---

# 31. DO NOT USE PLACEHOLDERS AS FINAL IMPLEMENTATION

Unless explicitly requested for prototyping, do not leave:

- fake API responses
- fake database records
- TODO implementations
- non-working buttons
- dead links
- placeholder handlers
- hardcoded success responses
- mock authentication
- fake loading behavior

A visible UI without functioning behavior is not a completed feature.

---

# 32. DOCUMENTATION MUST FOLLOW REALITY

When implementation changes architecture, commands, environment variables, integrations, schema, or setup steps, update the relevant project documentation.

Do not document features that do not actually exist.

Do not leave instructions pointing to old architecture after changing it.

---

# 33. ENVIRONMENT VARIABLES

Before adding a new environment variable:

- check whether an equivalent already exists
- follow naming conventions
- update `.env.example` when appropriate
- never commit real secrets
- document what the variable controls

Do not rename existing environment variables casually because deployment environments may depend on them.

---

# 34. FILE CREATION RULE

Every new file must earn its existence.

Before creating a file, determine:

- why it cannot live in an existing appropriate module
- whether a similar file already exists
- whether the chosen location follows repository conventions

Avoid excessive micro-files that fragment simple logic.

Avoid giant files when the project already has a clear modular pattern.

---

# 35. COMMENTS

Do not fill code with narration.

Comments should explain:

- non-obvious intent
- constraints
- unusual business rules
- compatibility reasons
- important edge cases

Do not add comments that simply restate the code.

---

# 36. USER EXPERIENCE OVER AGENT CONVENIENCE

Never make the UX worse because a simpler implementation is easier for the agent.

Preserve:

- clear feedback
- accessibility
- expected navigation
- user data
- form state when appropriate
- consistent interactions

Implementation convenience does not outrank product quality.

---

# 37. NO MODEL-SPECIFIC SIGNATURES

Do not insert:

- "Generated by Codex"
- "Generated by Gemini"
- "Generated by Antigravity"
- AI comments
- model attribution
- unnecessary agent metadata

The application should not reveal which model edited a file.

Agent identity belongs only in `AGENT_HANDOFF.md` if useful.

---

# 38. BEFORE FINISHING ANY TASK

Every agent must perform this checklist:

- [ ] I read `PROJECT_GOVERNANCE.md`.
- [ ] I inspected the existing implementation before editing.
- [ ] I checked Git state.
- [ ] I preserved unrelated working behavior.
- [ ] I did not introduce a competing architecture.
- [ ] I reused existing systems where appropriate.
- [ ] I avoided unnecessary dependencies.
- [ ] I checked affected types.
- [ ] I checked affected error states.
- [ ] I ran relevant validation/tests where available.
- [ ] I inspected the final diff.
- [ ] I removed accidental/debug code.
- [ ] I did not expose secrets.
- [ ] I updated relevant documentation if required.
- [ ] I updated `AGENT_HANDOFF.md` for meaningful work.
- [ ] I can explain why every changed file needed to change.

If the agent cannot satisfy an item, it must state why.

---

# 39. FINAL PRINCIPLE

**Continue the project. Do not reinvent the project.**

The repository is a shared evolving system.

Codex and Antigravity are collaborators operating on the same product, not competing developers building separate versions.

Every change should make the current product more correct, more stable, or more useful while preserving the project's approved vision.

When uncertain:

**READ MORE. CHANGE LESS. VERIFY BEFORE CLAIMING SUCCESS.**
