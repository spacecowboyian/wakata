# Wakata design system governance

This is Wakata's project policy for design system contributions. [Design System Ops](../../.claude/skills/design-system-ops/README.md) v2.0.0 supplies reusable review methods; its upstream files remain unmodified. The project policy here takes precedence when the examples in that package differ.

## Scope and state

- A **provisional fork** is a component or variant used in a prototype or a specific product project. It may ship within that project under its applicable review process. It is not yet a shared production component.
- A **shared production component** is promoted into the reusable Wakata design system for general consumption. Promotion is a separate decision from allowing a project-local fork.
- Proposed, approved, and promoted states must be recorded with the relevant decision and evidence. A prototype or planned use is not counted as production adoption.

## Contribution path

1. Record the problem, candidate component or extension, owner, target project, and available usage evidence. Check whether an existing shared component already serves the need.
2. For a provisional fork, record the local scope and applicable project approval. Keep its differences and any later promotion proposal visible to reviewers.
3. For shared production promotion, collect evidence that **at least two distinct features already use it in production**; three are preferred. Identify the features and their production evidence. Planned usage, prototypes, and duplicate instances of one feature do not meet the minimum.
4. Obtain approval through the governance model selected at design system initialization, then record the decision, reviewers, evidence, and scope. A solo owner may self-approve. A hierarchical team uses its configured roles and approval path; this document does not invent those roles or grant permissions.
5. Promote the shared component only after the usage and approval gates are satisfied. Document its public contract, accessibility behavior, theming, tests, and migration impact as applicable.

Extensions to existing components also follow a proposal, review, approval, and promotion path appropriate to their scope. They are not silently promoted by being implemented. The current Button and themes are a provisional implementation baseline, not final visual or manual accessibility certification.

## Open decision

After promotion, whether consumers receive automated migrations or only a notification is undecided. Record this as an open decision on each promotion that affects existing consumers; do not promise either behavior until decided.

## Enforcement today

This policy is a review procedure. The files do not authenticate a reviewer, verify production deployments, enforce role permissions, or block a merge. An owner must check the evidence and approval record at the promotion gate. Future CI or repository rules can automate narrow checks after their design is approved and tested; a checkbox or agent response is not enforcement.

Source: Ian's Wakata governance decisions supplied with the October 24, 2026 Design System Ops installation request.
