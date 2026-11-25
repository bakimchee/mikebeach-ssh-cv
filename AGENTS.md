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
- `src/ui/sections.ts` (blessed-tagged, for the TUI), `src/ui/plainText.ts` (for non-pty clients and `/cv.txt`), `src/ui/html.ts` (for browsers) and `src/ui/pdf.ts` (`/cv.pdf`, via pdfkit) all render `content.ts`. **Any content or shape change must be reflected in all four.** Two more renderers serve AI agents and tools: `src/ui/json.ts` (`/cv.json`) passes the content objects through as they are, so it follows shape changes on its own, and `src/ui/llmsTxt.ts` (`/llms.txt`) is a short guide that links to the other versions. A new menu section also needs `MENU_ITEMS` and `showSection` in `src/ui/app.ts`, and a nav entry in `SECTIONS` in `html.ts`. Wording in `content.ts` is read on every surface, so it has to stay true whichever one a Visitor is on.
- `src/http-server.ts` — serves `ui/html.ts` on `HTTP_PORT` (ADR 0004), plus `/cv.txt`, `/cv.pdf`, `/cv.json`, `/llms.txt`, `/styles.css` and `/robots.txt`, all built or read once at boot. Read-only: GET/HEAD only. The SSH hard rules below apply here too — don't add routes that accept Visitor input.
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

## Copy style guide

How the CV reads, on every surface. `content.ts` is the source, so these rules apply there; the renderers only lay the words out. This sits on top of the British English rule above and the facts-only rule under _CV content_.

**Tone**
- Plain and direct. Short factual sentences that read like a professional talking, not a sales pitch and not a chat.
- No asides, jokes or chatty phrasing ("You're looking at it", "if you'd rather", "it'll land straight in my inbox"), and no filler words ("actually", "practically", "a lot of", "really").
- This applies to every Visitor-facing string, not just `content.ts`: the intro and contact lines in `html.ts`, the TUI's `sections.ts` and the plain-text footer included.

**Voice**
- `about` is first person ("I build…"). Highlights drop the "I" and start with a verb ("Built…", "Lead…"). "We" and "our" are fine where the work was a team's.
- Plain, specific and factual. Prefer a number, a tool or an outcome to an adjective. No buzzwords or self-praise ("passionate", "world-class", "rockstar", "results-driven").

**Tense**
- The current role uses the present tense for ongoing work ("Lead", "Manage", "Create") and the past tense for things finished ("Set up", "Built", "Coordinated"). Never the "-ing" form as a highlight ("Creating…").
- Past roles use the past tense throughout.

**Highlights and summaries**
- One idea per highlight. One sentence where possible; two only when the second adds a number or the reason ("…JavaScript only").
- Highlights take no full stop at the end, even with two sentences. Summaries and `about` paragraphs are full sentences with full stops.
- Lead with the strongest highlight for the role, usually the one with a number in it.

**Names and titles**
- Job titles exactly as the owner gives them, in Title Case ("Front End Developer"). Company and team names exactly as the owner gives them.
- Name the employer and the company differently. As the employer, in a role's `company` field, it's "Sainsbury's Digital, Tech and Data". In prose about the business, its products or its people, it's "Sainsbury's" ("built the Sainsbury's careers website", "adoption across Sainsbury's and Argos").
- Products and tools in their own spelling and capitalisation: Next.js, TypeScript, Storybook, Chromatic, Style Dictionary, Figma API, axe-core, Jest, Lighthouse, Evinced, GitHub Actions, Vercel's v0, Umbraco.
- Named things in their own form: certification levels in Title Case ("Umbraco Level 1 and Level 2"), a named session or programme in straight double quotes ("AI Assisted Engineering").

**Terminology**
- "front end" as a noun, "front-end" as an adjective ("front-end platforms"); "Front End" only inside a job title. Never "frontend".
- "design system" is never hyphenated, including as an adjective ("design system adoption").
- Internal names (Fable, Luna) mean nothing to a hiring manager on their own, so explain each one the first time it appears in a section: "Fable, the multi-brand design system behind sainsburys.co.uk and argos.co.uk", "Luna, the previous design system". After that, the name alone is fine.
- Websites are written as they appear in a browser's address bar, in lower case ("sainsburys.co.uk").
- "AI-assisted" is hyphenated as an adjective.
- Spell out an abbreviation the first time if a non-specialist wouldn't know it ("business-facing (B2B)"). Well-known ones stand alone: UI, UX, CI/CD, WCAG AA, CSS, HTML.

**Punctuation, numbers and dates**
- No Oxford comma ("React, TypeScript, JavaScript, CSS and Node.js").
- Numerals for all counts and percentages ("77 releases", "42%").
- Date ranges use full month names and a spaced en dash ("March 2019 – July 2021"); the current role ends "Present".
- Straight quotes and apostrophes in `content.ts`; the HTML renderer escapes them.

**Skills**
- Title Case, the area first and the tools in brackets ("Testing (Jest, axe-core, Lighthouse)"). A slash pairs closely related tools ("React / Next.js").

## Styles

`src/ui/styles.css` is the only stylesheet, served at `/styles.css` for the HTML page (ADR 0004). Potential employers read it, so treat it as part of the CV:

- Comment every rule or group of rules with what it does and why, not just what it is. The comments are there for someone inspecting the code.
- Colours and other shared values are design tokens (CSS custom properties) in `:root` at the top of the file. Don't hard-code a colour in a rule.
- Every colour token states its measured WCAG contrast ratio, and the criterion it meets, in the comment beside it. Re-measure and update the comment when a value changes, in both the light and the `prefers-color-scheme: dark` sets.
- Keep it minimal: no scripts, no web fonts, no frameworks, and the page must still read fine if the stylesheet never loads.

## CV content

Only edit `src/content.ts` with facts the owner supplies. Never invent or embellish roles, dates, highlights, projects or skills, and keep the first-person voice in `about`.

## Job applications stay private

This repo is public, so it never shows which jobs Mike is applying for.

- Never name a prospective employer, a job title being applied for, or an application in commits, branch names, PR titles or descriptions, code comments, docs or `content.ts`. Describe CV changes generically ("adds design token experience"), not by the role that prompted them ("for the Acme application").
- Tailored copies of the CV for a specific application (`content.<employer>.ts`) and cover letters never go in this repo. `.gitignore` blocks `content.*.ts` as a safety net. Keep them somewhere private.
- Facts from an application conversation can go into the general CV, under the facts-only rule above, as long as nothing in the change points back to the application.

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
