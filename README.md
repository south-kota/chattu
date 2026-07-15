# Chattu

Chattu is a local-first, Markdown-native productivity and agentic workspace. It is being built as a cohesive place for agent conversations, writing, structured tasks and plans, code projects, browser automation, and synchronization with services such as Notion and Apple Reminders.

Chattu is in early personal-alpha development. The current `v0.0.1` release establishes the reproducible desktop foundation; the product roadmap lives in [PLAN.md](./PLAN.md).

## Upstream foundation

Chattu is a public fork of [pingdotgg/t3code](https://github.com/pingdotgg/t3code), which provides the existing Electron agent-chat and coding foundation. Chattu keeps that upstream history and documents its update process in [docs/chattu/upstream-maintenance.md](./docs/chattu/upstream-maintenance.md).

The original T3 Code license and notices remain in this repository.

## Development

> [!WARNING]
> The inherited agent runtime currently supports Codex, Claude, Cursor, and OpenCode.
> Install and authenticate at least one provider before use:
>
> - Codex: install [Codex CLI](https://developers.openai.com/codex/cli) and run `codex login`
> - Claude: install [Claude Code](https://claude.com/product/claude-code) and run `claude auth login`
> - Cursor: install [Cursor CLI](https://cursor.com/cli) and run `cursor-agent login`
> - OpenCode: install [OpenCode](https://opencode.ai) and run `opencode auth login`

Install dependencies and start the desktop development app:

```bash
vp install
bun run dev:desktop
```

The Chattu development home defaults to `~/.chattu`, separate from existing T3 Code data.

## Project notes

This project is early and will change quickly. Issues and pull requests are not yet part of the supported workflow.

There is no public documentation site yet; the repository documentation lives in [docs](./docs).

## Documentation

- [Getting started](./docs/getting-started/quick-start.md)
- [Architecture overview](./docs/architecture/overview.md)
- [Chattu v0.0.1 baseline](./docs/chattu/v0.0.1-baseline.md)
- [Provider guides](./docs/providers/codex.md)
- [Operations](./docs/operations/ci.md)
- [Reference](./docs/reference/encyclopedia.md)

## Toolchain

### Install `vp`

Chattu inherits the Vite+ toolchain, so install the global `vp` command-line tool.

#### macOS / Linux

```bash
curl -fsSL https://vite.plus | bash
```

#### Windows

```bash
irm https://vite.plus/ps1 | iex
```

See the [Vite+ guide](https://viteplus.dev/guide/) for toolchain documentation.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or PR.

For upstream T3 Code support, visit the [T3 Code repository](https://github.com/pingdotgg/t3code).
