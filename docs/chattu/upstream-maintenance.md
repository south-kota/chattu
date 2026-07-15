# Upstream Maintenance

Chattu keeps T3 Code as a read-only `upstream` remote. GitHub publication is deferred until after Chattu `v0.1.0`, so the local repository has no `origin` remote and the upstream push URL is deliberately disabled.

## Check for upstream changes

```bash
git fetch upstream main
git rev-list --left-right --count HEAD...upstream/main
git log --oneline HEAD..upstream/main
```

The two revision counts are Chattu-only commits followed by upstream-only commits.

## Merge upstream

1. Finish or stash current Chattu work and verify the worktree is understood.
2. Create a dedicated branch from the current Chattu `main` branch.
3. Fetch and merge upstream with an explicit merge commit.
4. Resolve conflicts without discarding Chattu behavior or unrelated local work.
5. Run `vp check`, `vp run typecheck`, `vp test`, `vp run build`, and `vp run test:desktop-smoke`.
6. Launch the desktop app and verify agent chat, file navigation, browser preview, and persisted settings.
7. Merge the verified update branch into Chattu `main` separately from feature work.

```bash
git switch main
git switch -c maintenance/upstream-YYYY-MM-DD
git fetch upstream main
git merge --no-ff upstream/main
```

Never combine an upstream merge with a Chattu feature implementation. The separate merge commit preserves provenance and makes regressions easier to isolate.

## Remote policy

The expected pre-`v0.1.0` configuration is:

```text
upstream  https://github.com/pingdotgg/t3code.git (fetch)
upstream  DISABLED (push)
```

After `v0.1.0`, Kota can create the public GitHub fork. That fork becomes `origin`; `upstream` remains the T3 Code repository.
