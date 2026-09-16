# Mike Beach

An SSH-accessible engineering portfolio/CV, reachable by running `ssh mikebeach.co.uk` — no auth, no real shell, a TUI menu rather than a website. The same CV is also served as a plain HTML page over HTTP, for Visitors who'd rather stay in a browser (ADR 0004).

## Language

**Visitor**:
Anyone who connects to view the portfolio, whether over SSH or in a browser. No authentication is required or performed.
_Avoid_: user, client, guest

**Session**:
The lifetime of one Visitor's connection, from connect to disconnect. Bounded by an idle timeout and counted against a per-IP concurrency cap.
_Avoid_: connection, request

**Message**:
Text a Visitor submits through the in-TUI contact form, delivered to the owner by email via Resend.
_Avoid_: contact request, submission
