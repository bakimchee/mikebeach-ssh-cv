# A plain HTML page alongside the SSH TUI

The project premise was "no website" — `ssh mikebeach.co.uk` or nothing. That cost us every Visitor who can't open a terminal, won't paste an unfamiliar `ssh` command, or is reading on a phone: recruiters, in practice. The same Fly machine now also serves the CV as one styleless HTML page on :80/:443, next to the SSH server on :22.

The TUI stays the point and the HTML page is deliberately the lesser experience: no CSS, no scripts, one route, GET and HEAD only, nothing Visitor-supplied read or reflected. It's a third renderer of `content.ts` (`ui/html.ts`), not a second copy of the CV, so the two surfaces can't drift.

This supersedes the "instead of a website" framing in `CONTEXT.md`, and narrows ADR 0002 to what it was really about: no auth and no real shell. Neither is weakened — the new port serves static bytes and reaches none of the SSH session machinery.
