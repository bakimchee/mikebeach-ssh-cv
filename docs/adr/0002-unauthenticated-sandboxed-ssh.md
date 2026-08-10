# Public SSH access with no auth, sandboxed to a single custom session handler

Anyone can connect with `ssh mikebeach.co.uk` — no key or password check. The `ssh2` server only implements a custom TUI "session" request; shell, exec, SFTP, and TCP/X11 forwarding are all explicitly rejected.

This is a deliberate deviation from normal SSH semantics (open access, no shell) because the goal is a public "website equivalent" reachable over SSH, not real remote access. Since the port is open to the internet with no auth gate, per-IP rate limiting, a concurrent-session cap, and an idle timeout are applied at the application layer.
