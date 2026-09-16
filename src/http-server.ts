import http from "node:http";
import { renderPlainText } from "./ui/plainText";
import { renderHtml } from "./ui/html";

/**
 * Serves the CV as one HTML page for Visitors who arrive in a browser rather
 * than over SSH. Read-only by design: no routes beyond the ones below, no
 * request body is ever read, nothing Visitor-supplied reaches the response.
 *
 * The SSH server (see ADR 0002) remains the real entry point; this is a
 * fallback for anyone who can't or won't open a terminal.
 */

const HTML = "text/html; charset=utf-8";
const TEXT = "text/plain; charset=utf-8";

const robotsTxt = [
  "# The CV is meant to be read. Crawl away.",
  "User-agent: *",
  "Allow: /",
  "",
  "# Markup-free version of this page: /cv.txt",
  "",
].join("\n");

// Content is static, so every response body is built once at boot.
// `/cv.txt` reuses the no-pty renderer rather than introducing another copy of
// the CV — it's the same text `ssh -T mikebeach.co.uk` returns.
const routes = new Map<string, { body: string; type: string }>([
  ["/", { body: renderHtml(), type: HTML }],
  ["/cv.txt", { body: renderPlainText(), type: TEXT }],
  ["/robots.txt", { body: robotsTxt, type: TEXT }],
]);

export function createHttpServer(): http.Server {
  return http.createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { "content-type": TEXT, allow: "GET, HEAD" });
      res.end("Method not allowed\n");
      return;
    }

    const path = (req.url ?? "/").split("?")[0];
    const route = routes.get(path);
    if (!route) {
      res.writeHead(404, { "content-type": TEXT });
      res.end("Not found — the CV is at /, or run `ssh mikebeach.co.uk`\n");
      return;
    }

    res.writeHead(200, {
      "content-type": route.type,
      "content-length": Buffer.byteLength(route.body),
    });
    res.end(req.method === "HEAD" ? undefined : route.body);
  });
}
