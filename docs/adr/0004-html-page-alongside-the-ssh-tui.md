# A plain HTML page alongside the SSH TUI

The project premise was "no website" — `ssh mikebeach.co.uk` or nothing. That cost us every Visitor who can't open a terminal, won't paste an unfamiliar `ssh` command, or is reading on a phone: recruiters, in practice. The same Fly machine now also serves the CV as one plain HTML page on :80/:443, next to the SSH server on :22.

The TUI stays the point and the HTML page is deliberately the lesser experience: no scripts, no web fonts and only a minimal stylesheet, GET and HEAD only, nothing Visitor-supplied read or reflected. It's a third renderer of `content.ts` (`ui/html.ts`), not a second copy of the CV, so the two surfaces can't drift.

The page started with no CSS at all. Unstyled, its lines ran the full width of a desktop browser, which made it hard to read, so it now links one small stylesheet, `/styles.css`: a reset, a 65ch reading column and a system font stack. Styling stays minimal and optional: no scripts, no web fonts, no frameworks, and the page must still read fine if the stylesheet never loads.

The page has also gained static siblings on the same port: `/cv.txt` (the no-pty text, unchanged), `/cv.pdf` (a fourth renderer, `ui/pdf.ts`, for Visitors who need a file to attach or print), `/styles.css` and `/robots.txt`. Each is built once at boot from `content.ts`. The constraint that matters is unchanged: a fixed set of read-only routes, none of which accepts Visitor input.

This supersedes the "instead of a website" framing in `CONTEXT.md`, and narrows ADR 0002 to what it was really about: no auth and no real shell. Neither is weakened — the new port serves static bytes and reaches none of the SSH session machinery.
