# Node.js + ssh2 + blessed instead of Go + charmbracelet/wish

Go with `charmbracelet/wish`/Bubbletea is the de facto toolkit for public SSH TUI servers and was the default recommendation. We're using Node.js with the `ssh2` package and `blessed` for the TUI instead, because Node is the owner's stronger language and this is a personal project maintained solely by them.

Recorded so a future reader doesn't assume this was an oversight — Go/wish was considered and explicitly not chosen.
