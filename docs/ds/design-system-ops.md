# Design System Ops in Wakata

The upstream [Design System Ops](../../.claude/skills/design-system-ops/README.md) package is vendored intact at `.claude/skills/design-system-ops/`. It is pinned to **v2.0.0**, tag commit `f1678981b69bb0a55d1003f494fff37e95ff6e74` from `murphytrueman/design-system-ops`, with its MIT license preserved. Its files are upstream-owned; place Wakata rules in `docs/ds/governance.md` and configuration in `.ds-ops-config.yml` instead of patching the vendor tree.

## Agent entry points

- Vendor-neutral policy and review criteria: `docs/ds/governance.md`.
- General project pointer: `AGENTS.md`.
- Wakata review skill: `.agents/skills/wakata-ds-governance/SKILL.md`.
- Copilot pointer: `.github/copilot-instructions.md`.
- DS Ops local configuration: `.ds-ops-config.yml`, using keys from the upstream `ds-ops-config.example.yml`. No external integrations are enabled.

The canonical policy is readable by any LLM with project-file access. Skill discovery and command execution depend on each host. This layout does not guarantee that every agent runtime will load the skills automatically.

## Verified locally

- The upstream `verify-install.sh` reports **92 references resolved** on the vendored tree.
- GitHub Copilot CLI `skill list --json` discovers **36 upstream skills** plus the Wakata companion skill from the project checkout.
- Copilot CLI `--plugin-dir .claude/skills/design-system-ops plugin list --json` recognizes the upstream plugin manifest as version **2.0.0** for that invocation. The plugin is not globally installed or enabled by default; plain `plugin list` does not list it.
- The root YAML configuration parses successfully. No DS Ops autonomous workflow was run.

## Host limits

Upstream documents installation for Claude Code and Cowork; neither host was exercised here. Its four chained commands use `${CLAUDE_PLUGIN_ROOT}` to load agents and shared notes. We verified those paths exist, but did not establish that Copilot expands that Claude-specific variable or executes the chained commands correctly. Use the directly discovered skills and Wakata policy in Copilot until command behavior is tested separately with appropriate scope. Other LLM hosts should read the vendor-neutral files explicitly unless their skill discovery is verified.

Installation and discovery do not enforce production-usage evidence, reviewer identity, role checks, or merge protection. Those remain the manual governance checkpoint described in `governance.md`.
