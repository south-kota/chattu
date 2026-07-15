# Chattu Session Handoff

Last updated: 2026-07-15

Current milestone: `v0.0.1` complete

Next milestone: `v0.0.2` - Chattu workspace shell

## Start Here

Open `/Users/kota/Documents/Life/chattu` as the workspace for the next session. The filesystem and this repository are the durable source of truth; do not rely on a previous agent's hidden context.

Read these files before changing code:

1. `AGENTS.md`
2. `PLAN.md`
3. `docs/chattu/session-handoff.md`
4. `docs/chattu/upstream-maintenance.md`
5. `docs/chattu/v0.0.1-baseline.md`

Then confirm the repository state:

```bash
git status --short
git fetch origin
git fetch upstream
git rev-list --left-right --count main...origin/main
git rev-list --left-right --count main...upstream/main
```

Do not merge upstream changes automatically. Review the comparison first and follow the upstream maintenance guide.

## Repository

- Local path: `/Users/kota/Documents/Life/chattu`
- Public repository: `https://github.com/south-kota/chattu`
- `origin`: `https://github.com/south-kota/chattu.git`
- `upstream` fetch: `https://github.com/pingdotgg/t3code.git`
- `upstream` push: disabled
- Primary branch: `main`
- Chattu milestone tag: `chattu-v0.0.1`
- Release: `https://github.com/south-kota/chattu/releases/tag/chattu-v0.0.1`
- Git author: `South Kota <11852410+south-kota@users.noreply.github.com>`
- GitHub CLI: authenticated as `south-kota` with repository and workflow access

The fork previously used the name `apna-chat`; GitHub now redirects that old path to `south-kota/chattu`. Existing remote branches were preserved.

## Product Decisions

- Product name: Chattu.
- Local Markdown files are the durable source of truth for user content.
- Desktop and web foundations come first; dedicated phone and watch apps follow after the core system stabilizes.
- Notion is the first external integration, followed by Apple Reminders.
- Code workspaces synchronize through Git; Chattu Markdown records will use the separate real-time sync protocol defined in later milestones.
- The repository is public and retains the upstream MIT license and history.
- Railway resources are not created until the local sync protocol is ready and Kota approves the recurring infrastructure cost.
- Chattu-specific code should remain bounded so updates from T3 Code can be reviewed and merged regularly.
- The inherited `t3code` and `t3code-dev` protocol schemes remain in place for compatibility until a deliberate migration is implemented.

## Current State

`v0.0.1` delivered:

- Chattu desktop, web, bundle, artifact, data-directory, and development-home identity.
- A native Apple-silicon desktop artifact named `Chattu-0.0.1-arm64.dmg`.
- A macOS development launcher whose Dock and menu-bar identity comes from `Chattu (Dev).app`, not the stock Electron bundle.
- Isolated development data at `~/.chattu` and application data at `~/Library/Application Support/chattu-dev`.
- A fetch-only upstream remote, weekly upstream comparison workflow, and manual maintenance guide.
- GitHub-hosted CI for the Chattu fork.
- A guard that prevents Chattu from invoking T3 Code's production relay deployment.

The previous T3 Code application bundle was moved to Trash. Its application-support data at `~/Library/Application Support/t3code` was intentionally preserved.

The development service is intentionally stopped at the end of the `v0.0.1` session. Generated dependencies remain installed locally, while `release/` artifacts are ignored by Git and the verified DMG is attached to the GitHub release.

## Development Setup

This Mac is an M1 MacBook Air with 8 GB memory. Chattu uses Node.js 24.18.0 from Homebrew without replacing the system Node.js installation.

For commands in a non-interactive shell, expose the pinned Node.js version:

```bash
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
```

The installed toolchain includes Bun, pnpm, Vite+, GitHub CLI, and the repository dependencies. If dependencies need to be restored, run:

```bash
vp install
```

Start the desktop development app with stable Chattu ports and data paths:

```bash
T3CODE_DEV_INSTANCE=chattu bun run dev:desktop
```

Expected development endpoints:

- Web: `http://127.0.0.1:7192/`
- Backend: `http://127.0.0.1:15232/`
- Home: `~/.chattu`

## Validation Baseline

The local and GitHub release gates passed at the end of `v0.0.1`:

- `vp check`: zero errors and nine inherited React warnings.
- `vp run typecheck`: all 15 targets passed with three inherited Effect suggestions.
- `vp test`: 4,603 tests passed and 7 skipped across 583 passing and 2 skipped files.
- `vp run build`: passed.
- `vp run test:desktop-smoke`: passed.
- GitHub CI: Check, Test, Mobile Native Static Analysis, and Release Smoke passed.
- Chattu Upstream Check: passed when manually dispatched.

The release DMG SHA-256 is `03f939f06be4a30b34ae3850ffd837dba9efff0da6b5d2dd0b8bb468ec50248d`.

Known non-blocking observations:

- The development build can report Chromium cache warnings after interrupted Electron sessions.
- Production web builds report inherited large-chunk and source-map warnings.
- The DMG has an ad-hoc signature and is not notarized because no Apple Developer signing identity is configured.
- The Codex in-app browser cannot access the Mac's loopback development port, and Codex does not have macOS screen-capture permission.

## Next Milestone

Begin `v0.0.2` by auditing the inherited route, state, desktop IPC, file-tree, and panel ownership before changing the layout. The milestone should introduce the Chattu workspace concepts and navigation for Chat, Files, Tasks, Plans, Collections, and Browser while keeping inherited chat and code flows usable.

The complete `v0.0.2` task list and acceptance criteria are in `PLAN.md`. Finish the milestone with focused interaction tests, desktop and responsive screenshots, full required validation, release notes, a Chattu-specific tag, and a GitHub release.
