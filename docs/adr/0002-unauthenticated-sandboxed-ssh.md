# Public SSH access with no auth, sandboxed to a single custom session handler

Anyone can connect with `ssh mikebeach.co.uk` — no key or password check. The `ssh2` server only implements a custom TUI "session" request; SFTP and TCP/X11 forwarding are explicitly rejected.

This is a deliberate deviation from normal SSH semantics (open access, no shell) because the goal is a public "website equivalent" reachable over SSH, not real remote access. Since the port is open to the internet with no auth gate, per-IP rate limiting, a concurrent-session cap, and an idle timeout are applied at the application layer.

Both `shell` and `exec` channel requests are accepted and routed to the same handler — some clients send `exec` for a plain `ssh host` invocation (no explicit command) instead of `shell`, and rejecting it broke real users. Whatever command an `exec` request names is ignored entirely; the server always serves the CV regardless, so accepting `exec` grants no actual remote execution.
