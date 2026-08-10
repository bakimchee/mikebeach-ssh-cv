# Deploy on Fly.io with dedicated IPv4/IPv6 for raw TCP :22

The portfolio must answer `ssh mikebeach.co.uk` with no `-p` flag, so it needs a public IP serving unauthenticated raw TCP on port 22 — Fly's shared IPv4 only proxies HTTP(S), not arbitrary TCP. We're deploying a containerized Node process to a fresh Fly.io app (not reusing the existing droplet at `138.68.132.190`), allocating a dedicated IPv4 (~$2/mo) and IPv6 (free), and repointing `mikebeach.co.uk`'s A/AAAA records there.

Chosen over a new or reused droplet because Fly is already part of the toolchain (used by `hr-predict`) and this avoids any risk of colliding with a real `sshd` already running on port 22 of an existing admin box.
