import { generateKeyPairSync } from "crypto";
import { Server } from "ssh2";
import { admitConnection, createIdleTimer, releaseConnection } from "./security/rateLimiter";
import { renderPlainText } from "./ui/plainText";
import { startTuiApp } from "./ui/app";

function resolveHostKey(): string {
  const configured = process.env.SSH_HOST_KEY;
  if (configured && configured.trim()) return configured;

  console.warn(
    "SSH_HOST_KEY not set — generating an ephemeral host key. " +
      "Fine for local dev; set a persisted key in production so the fingerprint doesn't change on every deploy."
  );
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
  });
  return privateKey;
}

export function createSshServer(): Server {
  const server = new Server({ hostKeys: [resolveHostKey()] }, (client, info) => {
    const ip = info.ip;

    if (!admitConnection(ip)) {
      client.end();
      return;
    }
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      releaseConnection(ip);
    };

    // Anyone gets in — this server exposes no real system access, see ADR 0002.
    client.on("authentication", (ctx) => ctx.accept());

    client.on("ready", () => {
      client.on("session", (accept, reject) => {
        const session = accept();
        let pty: { term: string; rows: number; cols: number } | null = null;

        session.on("pty", (accept, _reject, info) => {
          // @types/ssh2's PseudoTtyInfo omits `term`, but ssh2 always sets it at runtime.
          const { term } = info as unknown as { term: string };
          // A client can report a 0x0 winsize (e.g. no controlling terminal) — fall back
          // to a sane default rather than asking blessed to render into nothing.
          pty = { term, rows: info.rows || 24, cols: info.cols || 80 };
          accept?.();
        });

        session.on("window-change", (accept, _reject, info) => {
          pty = pty ? { ...pty, rows: info.rows || pty.rows, cols: info.cols || pty.cols } : pty;
          accept?.();
        });

        // No exec, no SFTP, no forwarding — only an interactive/plain-text session.
        // ssh2 auto-rejects any request type without a listener, but these are
        // explicit for auditability (see ADR 0002).
        session.on("exec", (_accept, reject) => reject?.());
        session.on("sftp", (_accept, reject) => reject?.());

        session.on("shell", (accept) => {
          const stream = accept();

          const idle = createIdleTimer(() => stream.end());
          stream.on("data", () => idle.touch());
          stream.on("close", () => {
            idle.clear();
            release();
          });

          if (pty) {
            startTuiApp(stream, pty, ip);
          } else {
            stream.write(renderPlainText() + "\n");
            stream.exit(0);
            stream.end();
          }
        });
      });
    });

    // Blocks port-forward requests explicitly (ssh2 already auto-rejects any
    // global request type with no listener, but this is explicit for
    // auditability — see ADR 0002).
    client.on("request", (_accept, reject) => reject?.());
    client.on("close", release);
    client.on("error", release);
  });

  return server;
}
