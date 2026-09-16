# mikebeach-ssh-cv

A public, unauthenticated SSH server that serves Mike Beach's CV as a TUI: `ssh mikebeach.co.uk`. Node.js + TypeScript, `ssh2` for the server, `blessed` for the UI, deployed on Fly.io.

Domain vocabulary (**Visitor**, **Session**, **Message**) is defined in `CONTEXT.md` — use those terms, not the synonyms it lists under _Avoid_.

## Commands

- `npm run dev` — run with `tsx watch` on `:2222`. With no `SSH_HOST_KEY` it generates an ephemeral host key on every (re)start, so the fingerprint changes constantly.
- `npm run typecheck` — the only automated check; there are no tests or linter.
- `npm run build` / `npm start` — compile to `dist/` and run it.

Connect locally (skip host-key checks because of the ephemeral key):

```sh
# TUI (pty allocated)
ssh -p 2222 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null localhost
# Plain-text fallback (no pty)
ssh -T -p 2222 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null localhost
```

The contact form needs `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` (see `.env.example`); without them it reports "Failed to send", which is expected locally.

## Definition of done

1. `npm run typecheck` passes.
2. Smoke-test over SSH with `npm run dev`: the TUI connection for anything touching `src/ui/app.ts` or `src/ui/sections.ts`, the `-T` connection for anything touching `src/ui/plainText.ts`, and both for `src/content.ts` or `src/ssh-server.ts`.

If you couldn't actually drive the TUI interactively, say so rather than reporting it as verified.

## Architecture

- `src/index.ts` — entry point; installs process-level error handlers so one bad Session can't crash the server.
- `src/ssh-server.ts` — accepts every auth attempt, admits/rejects by IP, then routes `shell` and `exec` to one handler: pty → TUI, no pty → plain text.
- `src/security/rateLimiter.ts` — in-memory per-IP limits (concurrent Sessions, connections per minute, idle timeout). State is per process.
- `src/content.ts` — the single source of CV data.
- `src/ui/sections.ts` (blessed-tagged, for the TUI), `src/ui/plainText.ts` (for non-pty clients) and `src/ui/html.ts` (for browsers) all render `content.ts`. **Any content or shape change must be reflected in all three.** A new menu section also needs `MENU_ITEMS` and `showSection` in `src/ui/app.ts`, and a nav entry in `SECTIONS` in `html.ts`. Wording in `content.ts` is read on all three surfaces, so it has to stay true whichever one a Visitor is on.
- `src/http-server.ts` — serves `ui/html.ts` on `HTTP_PORT` (ADR 0004). Read-only: one route, GET/HEAD only. The SSH hard rules below apply here too — don't add routes that accept Visitor input.
- `src/contact/sendMessage.ts` — delivers a Message by email via Resend.

## Hard rules

- **No real access, ever** (ADR 0002). Never add shell or command execution, SFTP, or TCP/X11 forwarding. `exec` is accepted only so clients that send it still get the CV; its command must stay ignored. Don't weaken the rate limits or idle timeout — the port is open to the internet.
- Don't "simplify" away client quirk handling in `ssh-server.ts`/`ui/app.ts`: the 0x0 winsize fallback, `exec` routing, and `forceUnicode`/`fullUnicode` each fixed real Visitors' clients.
- TUI boxes use `tags: true`, so `{`/`}` in rendered strings are parsed as markup — escape any string that isn't a literal you control (Visitor input, error messages).
- Never commit `.env`, `host_key`, or real API keys. Production uses a persisted `SSH_HOST_KEY` so the fingerprint stays stable.
- Surface conflicts with an ADR in `docs/adr/` explicitly instead of silently overriding it:
  - 0001 — Fly.io with a dedicated IPv4/IPv6 so raw TCP :22 works.
  - 0002 — unauthenticated, sandboxed SSH; app-layer rate limiting.
  - 0003 — Node + ssh2 + blessed chosen deliberately over Go + wish.

## Writing

Use British English spelling in everything you write: site copy, docs, ADRs, code comments, commit messages and anything you say back to the owner. So behaviour, colour, organise, licence, apologise.

Code is the exception, where an API's own spelling wins: `color`, `xterm-256color`, `{grey-fg}` and the like stay exactly as the library spells them.

## CV content

Only edit `src/content.ts` with facts the owner supplies. Never invent or embellish roles, dates, highlights, projects or skills, and keep the first-person voice in `about`.

## Git and deploys

- Commit only when asked, directly to `main`. Messages: an imperative summary line, then a body explaining why (see `git log`).
- **A push to `main` is a deploy.** Fly redeploys the live site on every push, so `git push` publishes to `ssh mikebeach.co.uk` and to the public GitHub repo at once. Push only when the owner asks for that push, never to tidy up at the end of some other task, and say what is about to go live before you do it.
- Never run `fly deploy`, `fly secrets`, `fly ips`, or change DNS. Deploys ride on the push above; everything else about the infrastructure is the owner's.

## Agent skills

The skills referenced below (`/domain-modeling`, `/grill-with-docs`, `/wayfinder`, `/improve-codebase-architecture`) come from the `mattpocock-skills` plugin.

### Issue tracker

Issues are tracked as local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout (`CONTEXT.md` + `docs/adr/` at the repo root). See `docs/agents/domain.md`.
