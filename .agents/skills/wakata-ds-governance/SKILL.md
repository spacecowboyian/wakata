---
name: wakata-ds-governance
description: Review Wakata design system contributions, project-local forks, extensions, and shared production promotion against Wakata's governance policy and the vendored Design System Ops methods.
---

# Wakata design system governance review

1. Read `docs/ds/governance.md` and the actual component contract, tests, and usage evidence. Read the relevant upstream method under `.claude/skills/design-system-ops/skills/`, especially `contribution-workflow` or `governance-encoder`, and its `references:` files when needed. Do not edit the vendored package.
2. State whether the request is for a provisional project-local fork, an extension, or shared production promotion. Identify the owner and decision status from evidence; do not infer approval from generated code.
3. For shared promotion, identify two distinct features in production at minimum (three preferred), with concrete evidence for each. Exclude prototypes and planned uses. Confirm approval under the governance model established at initialization. A solo owner may self-approve; never invent a hierarchical role or authenticated sign-off.
4. Report missing evidence and open decisions. Keep migration automation versus notification unresolved until the owner decides it. Distinguish manual review from executable repository enforcement.

Output a short decision record with scope, evidence, criteria met or missing, approver basis, and next step. Do not run a chained autonomous workflow or write to external services merely to perform a review.
