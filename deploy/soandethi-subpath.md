# Hosting the clone under https://dsh.vnotemate.com/soandethi/

**Historical baseline:** proxy route verified2026-10-30; this does not certify the current question-bank release. Anonymous public401 is only the Basic-auth gate, not application health. Current release checks are recorded in [verification](../specs/002-topic-question-bank/verification.md).

The app supports a subpath via `NEXT_BASE_PATH`. Everything below is what was
verified locally; the Caddy change must be applied **on the host**, because the
live `/etc/caddy/Caddyfile` is not writable from this container.

## 1. Build and run

```bash
cd /home/dsh/trangchugiaovien
NEXT_BASE_PATH=/soandethi pnpm exec next build
NEXT_BASE_PATH=/soandethi pnpm exec next start -p 3210    # serves /soandethi/*
```

`NEXT_BASE_PATH` must be set for **both** the build and the start, otherwise the
route manifest and the runtime disagree and every route 404s.

## 2. Caddy (on the host, inside the `dsh.vnotemate.com` site block)

Add this **before** the existing `handle { ... }` catch-all, so `/soandethi*`
wins over the harness SPA:

```caddy
	# Clone của soandethi.com, chạy trong container prod-apps (10.10.10.94).
	# Đặt TRƯỚC `handle` mặc định để không bị harness nuốt request.
	handle /soandethi* {
		reverse_proxy 10.10.10.94:3210
	}
```

Then:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo systemctl reload caddy
```

Do **not** overwrite `/etc/caddy/Caddyfile` with the stale copy inside the
container (`/proc/<caddy-pid>/root/etc/caddy/Caddyfile`) — that file points at
`127.0.0.1` and would take the whole site down.

## 3. What was fixed to make a subpath work

| Problem | Fix |
| --- | --- |
| `/api/*` fetches hit the domain root | `lib/api-url.ts` + `basePath()` in every client call |
| MathLive fonts at `/mathlive-fonts` | resolved from `NEXT_PUBLIC_BASE_PATH` |
| Next does not rewrite CSS `url()` | webfonts moved to `public/fonts.css` with **relative** urls, loaded via `<link>` |

Note: `styles/fonts.css` also carried 9 `@font-face` rules whose files were never
in `public/fonts` (Cyrillic/Greek/emoji subsets). Those were dropped, so the
generated `public/fonts.css` references only files that exist.

## 4. Question-bank release and supervision

The bank adds migration0012; back up PostgreSQL before `pnpm db:migrate` and never reset a populated database. Private backups must mode0600 and remain outside public. Build root for test first, then rebuild with `NEXT_BASE_PATH=/soandethi` after test server stops. Never reuse a root build for production subpath.

`deploy/soandethi.service` is the reproducible systemd unit for the existing port3210. Install only after inspecting any existing unit/process; do not create competing servers. Unit currently uses root to match existing root-owned private environment/data files; it does not expose their contents. Moving to a dedicated user requires deliberate ownership/secret/storage migration, not broad permission loosening. `NoNewPrivileges` and private umask are enabled.

```bash
NEXT_BASE_PATH=/soandethi pnpm build
sudo install -m 644 deploy/soandethi.service /etc/systemd/system/soandethi.service
sudo systemctl daemon-reload
sudo systemctl enable --now soandethi.service
```

Check local `/soandethi/question-bank`, assets, guest401 and authenticated owner tests; public Basic-auth401 is only proxy-gate evidence, not application verification. The bank's processing is request-driven and resumable, not a separate worker daemon. See [limits and recovery](../docs/question-bank.md) and [release evidence](../specs/002-topic-question-bank/verification.md).

Rollback: stop only `soandethi.service`, restore previous app artifact/config and start with matching base path. Migration0012 is additive and can stay unused by old app; do not drop bank data. Restore backup only in an isolated database and validate before any intentional recovery cutover.

## 5. Structured-question release004

The native structure is optional JSON metadata on existing document/conversation/bank snapshots; no destructive schema reset is required. Release verification also found historical migration0013 drift: [additive repair0014](<../db/migrations/0014_published_omr_verification.sql>) adds the missing nullable published OMR verification timestamp with `IF NOT EXISTS`. Apply via `pnpm db:migrate` after a private backup; never backfill verification or alter previously applied migration0013. Fresh databases already have the column and safely no-op. Preserve it with the matching HTML when exporting/restoring account data. Legacy HTML still uses extraction; native snapshots enter review immediately with extraction attempts0. Unknown/malformed structure is rejected server-side at bank ingestion; the editor falls back explicitly when its current DOM no longer matches its metadata. Never restore only metadata over newer HTML.

The unit now uses `Restart=always`: an unexpected clean process exit is restarted too. An intentional `systemctl stop soandethi.service` is still respected. This is a preventive supervision change, not a diagnosis of the previously observed clean exit. Reinstall the inspected unit and `daemon-reload` before restarting the existing service. Verify `systemctl is-active`, loopback authenticated smoke, exact subpath assets and source persistence through restart; do not infer public gateway success from401.

For rollback, bank native snapshots already contain concrete candidates and immutable source HTML, so the old UI can still review them. Older document writers may discard optional structure on subsequent edits; HTML must remain intact and can use legacy extraction after upgrading again. Do not use an old release to overwrite the full account library without a backup. Current feature validation: [release004 verification](../specs/004-structured-question-flow/verification.md). Real-exam evidence and PDF fidelity limits: [evaluation collection](../docs/evaluations/math9-topic-tree/README.md).

