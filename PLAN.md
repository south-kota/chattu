# Chattu Plan of Action

Status: Approved by Kota; implementation in progress (`v0.0.1` published)  
Plan version: 0.1  
Last updated: 2026-07-15  
Starting point: [pingdotgg/t3code](https://github.com/pingdotgg/t3code)

## 1. Executive summary

Chattu will be a local-first, Markdown-native personal productivity and agentic work environment. It will combine agent conversations, a high-performance Markdown editor, structured tasks and plans, Notion-style databases, code workspaces, a Playwright-controllable browser, and near-real-time synchronization.

Markdown files and ordinary attachments will be the durable user-owned data. SQLite, PostgreSQL, search indexes, caches, queues, and sync logs may exist for speed and coordination, but they must be rebuildable or replaceable and must not become the only copy of user content.

The first public-quality personal alpha is `v0.1.0`. Work before that version is divided into small, testable releases. Every release must run on Kota's M1 MacBook Air and leave the application in a demonstrable state.

## 2. Product promise

Chattu should become the place where Kota can:

- Work with coding and general-purpose agents.
- Capture unstructured thoughts and let an agent propose useful structure.
- Read and write Markdown with native-feeling performance.
- Manage tasks, projects, plans, journals, and structured collections without maintaining several disconnected systems.
- Use Notion and Apple Reminders as synchronized interfaces over the same underlying records.
- Open and inspect locally developed web apps in a built-in browser that agents can control through Playwright.
- Keep code synchronized through Git while synchronizing Markdown records continuously.
- Recover context quickly after interruption or time away from a project.

## 3. Product principles

1. **Local files are the durable source of truth.** Chattu must remain useful when the cloud, an integration, or Chattu itself is unavailable.
2. **Markdown stays legible.** A record must make sense in a text editor, GitHub, Obsidian, or another Markdown tool.
3. **Structured without being fragile.** Stable IDs and typed frontmatter enable rich views, while unknown fields and ordinary Markdown remain intact.
4. **Agents propose; Kota remains oriented.** Agent-created and agent-modified data must show provenance and offer review for broad or destructive changes.
5. **Capture is cheaper than organizing.** Inbox capture must be nearly instantaneous; agents and views perform most organization later.
6. **Recovery is a primary workflow.** The system should explain what changed, what is next, and what was abandoned without judgment.
7. **External apps are projections.** Notion and Apple Reminders can read and change Chattu data, but they do not silently become the authority.
8. **Upstream T3 Code remains mergeable.** Chattu-specific behavior should live in new packages, services, and bounded UI areas whenever possible.
9. **Performance is a feature.** Every major editor and indexing change is measured on the M1 MacBook Air.
10. **No silent loss.** Conflicts, failed syncs, unsupported fields, and deletions must be visible and recoverable.

## 4. Scope through v0.1.0

### Included

- A maintained fork of T3 Code with documented upstream synchronization.
- A branded Chattu desktop build for Apple silicon.
- Agent chat and coding workflows inherited from T3 Code.
- A rearrangeable workspace with navigation, file tree, editor, agent, task, and browser surfaces.
- A source-faithful Markdown editor with preview and structured record affordances.
- A versioned Markdown record specification for tasks, plans, projects, journals, and collections.
- A rebuildable local SQLite index and full-workspace search.
- Task, plan, inbox, today, and collection views derived from Markdown.
- Agent-assisted capture and daily planning with explicit change review.
- A built-in development browser and scoped Playwright controls.
- Separation between real-time Markdown sync and Git-based code workflows.
- A Railway-hosted sync/API service and authenticated web access.
- Bidirectional Notion synchronization.
- Bidirectional Apple Reminders synchronization through a native macOS bridge.
- Backup, migration, diagnostics, and recovery paths.

### Deferred until after v0.1.0

- A dedicated iPhone or Apple Watch Chattu app.
- Notion Calendar or general calendar synchronization.
- Todoist, Obsidian, and NotePlan adapters.
- Collaborative multi-user workspaces.
- A plugin marketplace.
- Fully visual Notion-compatible rich-text editing for every Markdown construct.
- End-to-end encrypted cloud sync.
- Autonomous agents making broad or irreversible changes without review.

T3 Code currently contains an Expo mobile app. Chattu may reuse that work later, but the mobile client will not determine the architecture before the desktop, data model, and sync protocol stabilize.

## 5. Definition of v0.1.0

`v0.1.0` is complete when Kota can perform this end-to-end workflow:

1. Launch Chattu on the M1 MacBook Air and open a local Chattu vault.
2. Capture a thought in chat or the inbox.
3. Ask an agent to turn it into a proposed task or plan.
4. Review and accept the resulting Markdown change.
5. Edit the record directly and see task and collection views update promptly.
6. See a configured task appear in Notion, modify it there, and receive the change back in Markdown without a loop or duplicate.
7. See a configured task appear in Apple Reminders, complete it there or through Siri, and receive the completion in Markdown.
8. Open a code project, run its development server, inspect it in Chattu's browser, and allow an agent to use an explicitly scoped Playwright session.
9. Open the authenticated Chattu web app and see synchronized Markdown-backed data.
10. Disconnect the network, continue editing locally, reconnect, and receive either a clean merge or an explicit recoverable conflict.
11. Rebuild the local database from the Markdown vault without losing user-authored information.
12. Update from a newer T3 Code upstream revision using the documented process and pass the compatibility suite.

## 6. Proposed architecture

```mermaid
flowchart TD
    Desktop["Chattu Desktop<br/>Electron + React"]
    Web["Chattu Web<br/>React"]
    Mobile["Future Mobile Client"]

    Desktop --> UI["Workspace UI<br/>Agents | Editor | Tasks | Collections | Browser"]
    Web --> UI
    UI --> Local["Local Chattu Runtime"]
    Local --> Files["Markdown Vault + Attachments"]
    Local --> Index["Rebuildable SQLite Index"]
    Local --> Agents["T3 Agent Provider Runtime"]
    Local --> Git["Git Workspaces"]
    Local --> Browser["Electron Browser + Playwright"]
    Local <--> Relay["Railway API + Sync Relay"]
    Relay --> Postgres["PostgreSQL<br/>events, revisions, jobs, mappings"]
    Relay --> Worker["Integration + Agent Workers"]
    Worker <--> Notion["Notion API + Webhooks"]
    Local <--> Reminders["macOS EventKit Bridge"]
    Mobile -. after v0.1 .-> Relay
```

### 6.1 T3 Code foundation

The inspected upstream version is `0.0.28`. Its present architecture already provides:

- A React and Vite browser application.
- An Electron desktop shell.
- A Node WebSocket server.
- Typed contracts and ordered server pushes.
- Queue-backed agent-runtime processing.
- Codex, Claude, Cursor, and OpenCode providers.
- Playwright Core in the desktop application.
- Lexical, React Markdown, a file tree, terminal support, and an existing mobile codebase.

Chattu should reuse these foundations. It should avoid replacing T3 Code's orchestration engine, provider interfaces, WebSocket transport, or desktop lifecycle unless an accepted architecture decision demonstrates that the upstream design cannot support the requirement.

### 6.2 Proposed Chattu package boundaries

Names are provisional, but ownership should be explicit:

- `packages/chattu-records`: Markdown/frontmatter schemas, parsing, validation, migrations, and serialization.
- `packages/chattu-vault`: file access, atomic writes, file watching, revisions, trash, and recovery.
- `packages/chattu-index`: SQLite projections, query API, search, backlinks, and rebuilds.
- `packages/chattu-sync`: protocol types, local outbox, conflict handling, and transport-independent sync logic.
- `packages/chattu-integrations`: adapter contract, mapping rules, idempotency, and provenance.
- `packages/chattu-editor`: editor model, commands, Markdown round-trip tests, preview, and structured widgets.
- `packages/chattu-ui`: task, plan, collection, daily, and review surfaces.
- `apps/chattu-cloud`: Railway-deployed API, WebSocket sync relay, authentication, and webhook endpoints.
- `apps/chattu-worker`: background jobs for Notion and later cloud agents.
- `apps/desktop/native`: the smallest practical Swift/EventKit bridge for Apple Reminders.

These boundaries should be adapted to upstream conventions during implementation rather than forced mechanically.

### 6.3 Data layers

| Layer            | Purpose                                                                        | Authority                      |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------------ |
| Markdown records | Tasks, plans, projects, journal entries, collection schemas, and relations     | Canonical                      |
| Attachments      | Images and other user files referenced by Markdown                             | Canonical                      |
| SQLite           | Local query projection, search index, backlinks, sync outbox, and health state | Rebuildable                    |
| Keychain         | OAuth tokens and secrets                                                       | Operational, never Markdown    |
| PostgreSQL       | Device revisions, relay events, jobs, webhook receipts, and remote projections | Operational                    |
| External apps    | Notion pages and Apple reminders                                               | Synchronized projections       |
| Git              | Code history and optional vault snapshots                                      | Version history, not live sync |

The phrase "Markdown is the source of truth" applies to durable user content and relationships. It does not require credentials, locks, queues, device cursors, or search indexes to be encoded as Markdown.

## 7. Chattu Markdown Record Format

The exact format will be approved in `v0.0.5`, but the recommended direction is one Markdown file per durable record. A task should not depend on a checkbox embedded in prose.

```markdown
---
chattu: 1
id: 01JZEXAMPLE7M4V9A2D8Q6K3T1
kind: task
title: Prepare Chattu architecture review
status: next
created: 2026-07-14T10:30:00+05:30
updated: 2026-07-14T10:30:00+05:30
due: 2026-07-16
priority: high
project: 01JZPROJECTEXAMPLE
tags: [chattu, planning]
depends_on: []
recurrence: null
integrations:
  notion:
    page_id: null
  apple_reminders:
    calendar_id: null
    reminder_id: null
---

## Notes

Review the architecture and milestone gates before implementation begins.

## Activity

- 2026-07-14: Captured from agent chat.
```

### Format requirements

- Stable opaque IDs survive file and folder renames.
- `chattu` is a schema version, not an application version.
- Unknown frontmatter fields and unsupported Markdown nodes survive round trips.
- Dates use ISO 8601; date-times include an offset and retain the originating time zone when needed.
- Statuses are configurable but map through a small normalized lifecycle for integrations.
- Recurrence uses a documented portable rule rather than provider-specific prose.
- Relations use stable IDs, with readable links generated by views.
- Integration identifiers are metadata, never credentials.
- Deletion is initially soft deletion to a recoverable trash/tombstone path.
- Activity history is append-only where practical and may be compacted through an explicit command.

### Collections

A Notion-style database will be a folder containing a Markdown collection definition and record files. The definition specifies fields, validation, templates, sorting, filters, and saved views. Table, board, list, and calendar-like views are projections; editing a cell updates the corresponding record through the same validated write path as the editor.

## 8. Editing strategy

The editor must preserve Markdown fidelity before it attempts complete WYSIWYG behavior.

### Initial direction

- Benchmark the existing Lexical dependency against CodeMirror 6 for Chattu's source-first workload.
- Use a text-centered document model as the canonical in-memory representation.
- Provide source editing, rendered preview, outline, backlinks, command palette actions, and structured widgets for Chattu records.
- Parse and render off the keystroke path, using workers or incremental parsing where it improves measured latency.
- Use virtualized rendering for large documents and collection views.
- Save atomically through the vault service, not directly from React components.
- Detect external changes and offer a three-way merge when a buffer is dirty.

Rich editing may use Lexical if round-trip and performance tests pass. Chattu must not silently normalize or delete valid Markdown merely to support a visual editing mode.

### M1 MacBook Air performance budgets

These are initial engineering budgets to validate and adjust with measurements:

- Visible editor after warm launch: target under 1.5 seconds.
- Cold application launch to usable workspace: target under 3 seconds.
- Typing response at the 95th percentile: target under 16 milliseconds for ordinary documents.
- Local save acknowledgement: target under 100 milliseconds for ordinary documents.
- Smooth interaction at 60 frames per second during common editing and scrolling.
- Open and edit a 1 MB Markdown file without input stalls.
- Index a 10,000-record test vault incrementally without blocking editor input.
- Idle CPU near zero when no watcher, sync, or agent work is pending.
- Memory regressions tracked per release, with an initial steady-state target below 500 MB for a normal workspace.

Budgets are gates for investigation, not permission to hide correctness failures.

## 9. Synchronization model

### 9.1 Local change path

1. The editor or structured view submits a validated record transaction.
2. The vault writes the Markdown file atomically.
3. The file watcher emits a normalized change event.
4. The SQLite projection updates.
5. The sync outbox records the revision and origin.
6. UI subscribers receive one ordered domain event.

External filesystem edits enter at step 3 and are parsed and validated before projection.

### 9.2 Device sync

- Each device has an ID and durable cursor.
- Each record revision carries a content hash, parent revision, timestamp, origin, and schema version.
- The relay is idempotent and supports replay after disconnection.
- The first implementation uses record-level optimistic concurrency and three-way Markdown merging.
- Concurrent changes that cannot be merged produce an explicit conflict record containing both versions.
- A CRDT will be considered only after measurements show simultaneous same-record editing requires it; it should not be introduced merely for architectural fashion.
- Deletions use tombstones until all known devices have observed them and the retention window expires.
- Attachments use content hashes and resumable transfer in a later sync increment if needed.

### 9.3 Git boundary

- Code repositories remain normal Git repositories and use commits, branches, worktrees, and remotes.
- Markdown records inside the Chattu vault use real-time record sync.
- Chattu must never automatically commit unrelated code changes.
- A code workspace can reference Chattu project/task records by stable ID.
- Optional scheduled Git snapshots of the Markdown vault may provide readable backup history, but snapshotting is separate from live synchronization.
- `.git`, build outputs, dependency folders, secrets, and large generated assets are excluded from record sync.

## 10. Integration model

Every adapter implements the same lifecycle: connect, initial import, map, push, pull, reconcile, report health, pause, resume, and disconnect.

Common guarantees:

- Stable Chattu-to-provider mappings.
- Idempotency keys and webhook receipt deduplication.
- Origin markers to prevent echo loops.
- Field-level capability mapping and an explicit unsupported-field report.
- Rate-limit handling with retry and backoff.
- A visible sync log and per-record last-sync state.
- Dry-run preview for initial imports and destructive reconciliation.
- No remote deletion during early releases; use archive/soft-delete until behavior is proven.

### Notion first

The first adapter uses a Notion internal connection for Kota's workspace. A public OAuth integration can come later. Notion webhooks will notify the Railway endpoint, which verifies the signature, deduplicates the event, fetches current content through the Notion API, and queues reconciliation. Webhook events are signals rather than full change payloads, so reconciliation must always retrieve the latest object.

Initial Notion scope:

- One selected Notion data source/database mapped to one Chattu collection.
- Task title, status, priority, due date, tags, project relation, notes, and archive state.
- Initial import preview with duplicate detection.
- Bidirectional create and update.
- Controlled archive mapping before permanent deletion is considered.
- Manual "reconcile now" and a detailed health view.

### Apple Reminders second

Apple Reminders integration will use EventKit through a native macOS bridge. It requires explicit full reminders permission and listens for event-store change notifications before refetching relevant reminders. Because EventKit is device-local, the desktop app performs this adapter's work; the Railway service does not impersonate the Mac.

Initial Apple Reminders scope:

- One dedicated Chattu list plus optional mappings to selected lists.
- Title, notes, due date/time, priority, completion, recurrence where compatible, and list.
- Siri-created reminders imported into a Chattu inbox or mapped collection.
- Completion synchronized in both directions.
- A clear report when an EventKit feature cannot round-trip to the Chattu schema.

## 11. Railway deployment shape

The first cloud topology should remain small:

- `chattu-cloud`: HTTP API, authentication, Notion webhook endpoint, and bidirectional WebSocket sync relay.
- `chattu-worker`: durable integration and agent jobs; it may begin in the API process and split when reliability or load requires it.
- PostgreSQL: revisions, device cursors, jobs, webhook receipts, and integration mappings.
- Optional object storage: attachment replication after the record protocol is stable.
- Staging and production environments with separate credentials and databases.

Railway supports shared JavaScript monorepos, service-specific commands and watch paths, PostgreSQL services, and WebSocket deployments. Chattu clients must still implement reconnect with exponential backoff and replay from a durable cursor.

No Railway resources will be created until the local sync protocol passes fault-injection tests and Kota approves the expected recurring cost.

## 12. Versioned implementation roadmap

Every version ends with a tagged build, release notes, automated tests, and a short acceptance checklist. A version can be split if investigation exposes more risk, but its acceptance criteria should not be weakened silently.

### v0.0.1 - Fork and reproducible baseline

**Goal:** Establish a clean, repeatable Chattu development base without changing product behavior.

Tasks:

- Initialize Chattu from `pingdotgg/t3code` and publish the public fork at `south-kota/chattu`.
- Configure `origin` for Chattu and keep `upstream` fetch-only with its push URL disabled.
- Record the upstream commit and release used for the baseline.
- Verify the MIT license and preserve required notices.
- Install the repository's pinned toolchain and dependencies.
- Run upstream type checks, tests, web build, Electron development build, and desktop smoke test.
- Create an Apple-silicon development build and record baseline launch, memory, and idle-CPU measurements on the M1 Air.
- Add Chattu naming and environment scaffolding with the smallest possible upstream diff.
- Add a scheduled upstream-check workflow and a documented manual merge procedure.
- Add a compatibility report that distinguishes upstream failures from Chattu regressions.

Acceptance:

- A branded Chattu build launches and inherited agent chat still works.
- Upstream can be fetched and merged without rewriting history.
- The baseline commands succeed from a clean checkout.

### v0.0.2 - Chattu workspace shell

**Goal:** Create the navigation and panel model for the complete product.

Tasks:

- Audit T3 Code routes, state ownership, desktop IPC, file tree, and panel components.
- Introduce Chattu workspace concepts without duplicating agent-session state.
- Implement stable navigation for Chat, Files, Tasks, Plans, Collections, and Browser.
- Make the file tree and primary panels movable/resizable with persisted layouts.
- Add keyboard-accessible focus movement, command palette entries, and native macOS menu commands.
- Add empty, loading, error, offline, and permission states.
- Preserve the dense, work-focused T3 Code interaction style.
- Add desktop and responsive web screenshot tests for layout and overflow.

Acceptance:

- Kota can rearrange panels, restart, and recover the same layout.
- Existing chat and code flows remain usable.
- No panel overlaps or loses essential controls at supported desktop sizes.

### v0.0.3 - Local Markdown vault

**Goal:** Make a local folder a dependable, observable Chattu vault.

Tasks:

- Implement vault selection, recent vaults, and safe path handling.
- Add atomic read/write/rename/delete-to-trash operations.
- Add recursive file watching with debounce, ignore rules, and rename detection.
- Parse YAML frontmatter and Markdown through structured parsers.
- Preserve unknown syntax and line endings.
- Create a rebuildable SQLite catalog for files, headings, links, tags, and parse errors.
- Add fast filename/content search and backlinks.
- Add a health screen for invalid records, missing links, ignored files, and index status.
- Test external edits from another editor while Chattu is open.

Acceptance:

- Editing a Markdown file inside or outside Chattu updates the file tree and index promptly.
- Deleting the SQLite database and rebuilding it produces the same user-visible catalog.
- No observed test case causes silent content loss.

### v0.0.4 - Markdown editor foundation

**Goal:** Deliver the first native-feeling, source-faithful Chattu editor.

Tasks:

- Benchmark Lexical and CodeMirror 6 against representative Chattu documents.
- Write an architecture decision record choosing the initial editor engine and explaining the tradeoffs.
- Implement tabs, split view, source editing, preview, outline, find/replace, undo/redo, and navigation history.
- Add Markdown syntax support, code highlighting, tables, links, task syntax, frontmatter, and attachment previews.
- Add autosave, crash recovery, dirty-state handling, and external-change merge UI.
- Use workers/incremental parsing where profiling supports it.
- Add round-trip fixtures for CommonMark, GFM, frontmatter, raw HTML, and unknown constructs.
- Add repeatable performance benchmarks for small, large, and pathological files.

Acceptance:

- Editor behavior meets the initial M1 performance budgets or documents an approved exception with profiling evidence.
- Opening and saving the fixture corpus does not alter untouched content.
- A dirty buffer and an external file change cannot overwrite each other silently.

### v0.0.5 - Chattu records, tasks, and plans

**Goal:** Ratify the Markdown record format and make structured productivity data usable.

Tasks:

- Finalize schema v1 for task, plan, project, journal, and generic note records.
- Implement runtime validation, readable diagnostics, schema migrations, and forward-compatible unknown fields.
- Implement stable IDs, status lifecycle, priorities, dates, recurrence, relations, tags, provenance, and integration metadata.
- Add record creation templates and an instant inbox capture flow.
- Build Inbox, Today, Upcoming, Tasks, Projects, and Plans views.
- Ensure edits from a structured view serialize through the same transaction path as editor changes.
- Add undo and change previews for multi-record operations.
- Import ordinary Markdown as notes without forcing conversion.
- Test DST, time zones, recurrence, renamed files, deleted relations, and invalid frontmatter.

Acceptance:

- Tasks are independent Markdown records, not application-only rows or checkbox state.
- A task edited as text and through a task view remains semantically identical.
- Schema migrations are reversible through backup and preserve unknown fields.

### v0.0.6 - Markdown-backed collections

**Goal:** Provide Notion-style databases whose data remains Markdown.

Tasks:

- Define collection schema and saved-view records.
- Implement table, board, and list views with sorting, filtering, grouping, and configurable columns.
- Add inline cell editing, bulk editing with preview, templates, and relation selectors.
- Add computed display fields while keeping derived values out of canonical records unless explicitly materialized.
- Virtualize large collections and benchmark 10,000 records.
- Add collection schema evolution and validation diagnostics.
- Add CSV/JSON export as derived output and a safe CSV import preview.

Acceptance:

- A collection can be created, edited, and queried entirely from its Markdown files.
- Removing the local index and rebuilding it restores the same collection and saved views.
- Large collection interaction remains responsive on the M1 Air.

### v0.0.7 - Agentic productivity workflows

**Goal:** Let agents organize work while keeping every material change understandable.

Tasks:

- Expose typed Chattu record tools to the existing T3 agent runtime.
- Add read/query, propose-create, propose-update, and propose-batch-plan operations.
- Show an exact Markdown and semantic diff before accepting broad agent changes.
- Record agent provider, session, timestamp, and originating prompt reference as provenance.
- Implement daily planning using tasks, due dates, estimates, energy/context fields, and calendar placeholders where present.
- Add review flows for inbox triage, stalled projects, and returning after time away.
- Add safeguards for delete, archive, recurrence changes, and large batch edits.
- Create an evaluation fixture set for ambiguous capture, duplicate tasks, unrealistic plans, and interruption recovery.

Acceptance:

- Kota can turn a messy thought into reviewed Markdown-backed tasks and a plan.
- Rejected proposals leave no partial file changes.
- Accepted batches are atomic and undoable.

### v0.0.8 - Built-in browser and Git boundary

**Goal:** Complete the local code-to-preview workflow and make Git responsibilities explicit.

Tasks:

- Add browser tabs, URL navigation, reload/stop, viewport selection, console, and open-in-system-browser commands.
- Detect or register local development servers without assuming a single framework.
- Reuse the upstream Playwright Core dependency through a scoped browser-control service.
- Require visible session boundaries and user confirmation for sensitive browser actions.
- Add screenshot, DOM inspection, console/network error capture, and responsive viewport checks.
- Add Git status, branch, remote, commit, and worktree visibility for code workspaces.
- Link Git workspaces and commits to Chattu project/task IDs without automatically committing unrelated work.
- Enforce sync exclusions for code repositories and generated paths.

Acceptance:

- An agent can inspect and test a local app in Chattu's browser within the granted scope.
- Browser automation cannot silently escape its designated profile/session.
- Markdown live sync and Git code workflows do not duplicate or overwrite each other's responsibility.

### v0.0.9 - Sync protocol and offline local client

**Goal:** Prove reliable record synchronization before introducing a hosted dependency.

Tasks:

- Specify revision, device, cursor, outbox, tombstone, and conflict contracts.
- Implement a transport-independent local sync engine and an in-process reference relay.
- Add reconnect, replay, idempotency, retry, compaction, and schema-version negotiation.
- Implement clean three-way merges and explicit conflict records for ambiguous changes.
- Simulate two devices, offline edits, clock skew, duplicate delivery, reorder, crashes, and interrupted writes.
- Add sync status, per-record history, retry controls, pause/resume, and exportable diagnostics.
- Measure sync behavior on large vaults and rapid editor saves.

Acceptance:

- A two-client automated scenario survives offline divergent edits without silent loss.
- Replaying the same operations is idempotent.
- Sync failure never prevents local editing or access to existing files.

### v0.0.10 - Railway cloud relay and web access

**Goal:** Synchronize an authenticated desktop vault with a hosted Chattu service and web client.

Tasks:

- Define staging and production Railway topology and cost expectations.
- Deploy the API/WebSocket service and PostgreSQL in staging.
- Add authentication, device registration/revocation, secure transport, rate limits, and audit events.
- Persist revisions, cursors, jobs, and replay state in PostgreSQL.
- Implement WebSocket reconnection with exponential backoff and cursor replay.
- Connect the existing React web app to synchronized Chattu record views.
- Add database migration, backup/restore, health checks, logs, and deployment verification.
- Run disconnect, restart, database-recovery, and partial-deployment tests.
- Promote to production only after staging soak tests pass.

Acceptance:

- Desktop and authenticated web clients converge after online and offline edits.
- Restarting or redeploying the relay does not lose acknowledged revisions.
- Revoking a device prevents new synchronization while preserving local files.

### v0.0.11 - Notion bidirectional sync

**Goal:** Make one Notion database a dependable projection of a Chattu task collection.

Tasks:

- Add Notion connection setup and store the token outside the vault.
- Add database selection and field-mapping UI.
- Implement dry-run import, stable mapping, duplicate detection, and checkpointed initial sync.
- Implement Chattu-to-Notion create/update/archive.
- Implement signed webhook verification, receipt deduplication, current-object fetch, and Notion-to-Chattu reconciliation.
- Add origin/version markers, retry/backoff, rate-limit handling, and loop tests.
- Preserve unsupported Notion content in a visible, non-destructive representation or report.
- Add integration health, last sync, per-record errors, pause, and full reconcile.
- Test edits made concurrently in Chattu and Notion.

Acceptance:

- The v0.1 task field set round-trips without duplicates or echo loops.
- A failed or rate-limited operation retries without blocking local work.
- Initial import and archive operations require review and remain recoverable.

### v0.0.12 - Apple Reminders and Siri capture

**Goal:** Make Apple Reminders a native capture and task-completion surface.

Tasks:

- Implement the minimal Swift/EventKit bridge and Electron IPC contract.
- Add permission request, denial, revocation, and recovery states.
- Add Chattu list selection and field-mapping controls.
- Implement initial import preview and stable reminder mappings.
- Implement bidirectional create/update/complete/archive for the supported field set.
- Listen for EventKit store-change notifications and perform idempotent refetch/reconciliation.
- Route Siri-created reminders from configured lists into the Chattu inbox.
- Test recurring reminders, due dates, priorities, completions, list moves, offline iCloud propagation, and permission changes.
- Document unsupported round trips and surface them in integration health.

Acceptance:

- A reminder created through Siri appears as a Chattu Markdown task.
- Completing the task in either application updates the other without a loop.
- Revoking reminders permission degrades cleanly and never damages the vault.

### v0.1.0 - Integrated personal alpha

**Goal:** Harden the complete workflow for Kota's daily use.

Tasks:

- Run the full definition-of-done workflow and fix cross-feature failures.
- Complete accessibility, keyboard navigation, responsive layout, and macOS interaction passes.
- Profile launch, typing, indexing, sync, memory, CPU, and battery behavior on the M1 Air.
- Complete threat modeling for browser automation, agent tools, OAuth tokens, local file access, and cloud endpoints.
- Add first-run vault setup, integration onboarding, sample records, and reversible import flows.
- Add automatic local backups, cloud backup verification, restore rehearsal, and schema rollback instructions.
- Add diagnostics bundle creation with secret redaction.
- Perform a fresh upstream merge and run the compatibility suite.
- Create a signed/notarized Apple-silicon build if developer credentials are available.
- Freeze schema v1 and sync protocol v1 for the alpha period.
- Write known limitations and post-`v0.1.0` priorities based on real usage.

Acceptance:

- Every item in the `v0.1.0` definition is demonstrated successfully.
- No open known issue can silently lose or irreversibly corrupt user content.
- Backup restoration and index rebuilding are proven, not assumed.
- Chattu is stable enough for Kota to use on real daily tasks with known limitations documented.

## 13. Quality strategy

### Automated coverage

- Unit tests for schema validation, migrations, recurrence, relations, field mappings, and merge behavior.
- Property-based tests for parse/serialize round trips and sync idempotency.
- Golden-file tests ensuring untouched Markdown remains byte-stable where expected.
- Contract tests across desktop, local runtime, cloud relay, and adapters.
- Integration tests using temporary vaults, SQLite, PostgreSQL, mocked Notion responses, and EventKit bridge boundaries.
- Electron and browser end-to-end tests for the critical user journeys.
- Fault injection for network loss, duplicate/reordered events, process crashes, database restarts, and partial writes.
- Performance benchmarks recorded per release on the M1 Air.

### Manual release checks

- Fresh install and upgrade from the previous version.
- Open an existing ordinary Markdown folder without conversion.
- Edit the same record from text and structured views.
- External edit while a Chattu buffer is dirty.
- Offline edit and reconnect.
- Integration permission denial and token expiry.
- Large vault and large file interaction.
- Restore from backup into a clean environment.
- Merge the latest upstream T3 Code revision and rerun compatibility tests.

## 14. Upstream maintenance strategy

- `origin`: Kota's Chattu fork.
- `upstream`: `pingdotgg/t3code`.
- `main`: always releasable Chattu history.
- Feature branches: short-lived Chattu work.
- Scheduled workflow: report new upstream commits/releases; never merge them blindly.
- Upstream update branch: merge `upstream/main`, resolve, run upstream tests, run Chattu compatibility tests, and review the resulting diff before merging to `main`.
- Prefer merge commits for upstream imports so provenance remains obvious.
- Keep branding, configuration, and Chattu package wiring centralized.
- Record intentional upstream modifications in a small patch ledger with owner and reason.
- Upstream useful general fixes should be isolated so they can be contributed or dropped later.
- Never mix a large upstream merge with an unrelated Chattu feature release.

## 15. Main risks and mitigations

| Risk                                         | Mitigation                                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Upstream T3 Code changes rapidly             | Additive packages, compatibility tests, frequent small upstream merges, and a patch ledger              |
| Markdown round trips lose content            | Source-faithful model, golden fixtures, unknown-field preservation, and byte-level tests                |
| Electron feels heavy on the M1 Air           | Per-release profiling, virtualization, lazy loading, workers, and strict idle behavior                  |
| File watchers and UI edits race              | One vault transaction service, atomic writes, revision hashes, and dirty-buffer merge handling          |
| Sync conflicts destroy intent                | Parent revisions, three-way merge, conflict copies, history, and no silent last-write-wins              |
| Notion creates loops or duplicates           | Stable mappings, origin/version markers, webhook dedupe, idempotent jobs, and reconciliation tests      |
| Apple Reminders has platform-specific limits | Small native bridge, explicit capability mapping, device-local adapter, and visible unsupported fields  |
| Agents reorganize too much                   | Proposal/diff workflow, atomic batches, provenance, undo, and thresholds requiring review               |
| Cloud becomes the hidden authority           | Offline-first behavior, rebuildable projections, export, local backups, and relay replay tests          |
| Scope prevents a usable release              | Each version must ship a demonstrable vertical increment; mobile and extra integrations remain deferred |

## 16. Approval gates

Kota's explicit approval is required before:

1. Forking the repository and beginning `v0.0.1` implementation.
2. Ratifying the Chattu Markdown Record Format in `v0.0.5`.
3. Creating paid or persistent Railway resources in `v0.0.10`.
4. Connecting a real Notion workspace in `v0.0.11`.
5. Requesting Apple Reminders permission and testing against real reminders in `v0.0.12`.
6. Treating Chattu as the primary daily system at `v0.1.0`.

## 17. Decisions still intentionally open

These should be answered by implementation evidence at the named version:

- Lexical, CodeMirror 6, or a bounded combination for the editor (`v0.0.4`).
- Final task statuses, recurrence representation, and activity-history policy (`v0.0.5`).
- Search engine beyond SQLite FTS if measurement justifies one (`v0.0.3` to `v0.0.6`).
- Attachment sync and object storage timing (`v0.0.9` to `v0.0.10`).
- Whether cloud workers may edit canonical files directly or only submit reviewed proposals (`v0.0.7` and later).
- Whether a separate worker service is necessary at first Railway deployment (`v0.0.10`).
- Mobile implementation approach after the desktop and protocol stabilize (after `v0.1.0`).

## 18. Sources used for this plan

- [T3 Code repository and README](https://github.com/pingdotgg/t3code)
- [T3 Code architecture overview](https://github.com/pingdotgg/t3code/blob/main/docs/architecture/overview.md)
- [Notion API overview](https://developers.notion.com/reference/intro)
- [Notion webhooks](https://developers.notion.com/reference/webhooks)
- [Apple EventKit](https://developer.apple.com/documentation/eventkit)
- [Apple EventKit store access](https://developer.apple.com/documentation/eventkit/accessing-the-event-store)
- [Railway monorepo deployments](https://docs.railway.com/deployments/monorepo)
- [Railway PostgreSQL](https://docs.railway.com/databases/postgresql)
- [Railway WebSockets guidance](https://docs.railway.com/guides/sse-vs-websockets)

## 19. Approval outcome

The plan was approved by Kota. `v0.0.1` established and published the T3 Code baseline, upstream workflow, toolchain, branded build, and compatibility record. The next milestone is `v0.0.2`: the Chattu workspace shell.
