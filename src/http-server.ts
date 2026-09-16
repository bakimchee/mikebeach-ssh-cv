import http from "node:http";
import { renderHtml } from "./ui/html";

/**
 * Serves the CV as one HTML page for Visitors who arrive in a browser rather
 * than over SSH. Read-only by design: no routes beyond the page itself, no
 * request body is ever read, nothing Visitor-supplied reaches the response.
 *
 * The SSH server (see ADR 0002) remains the real entry point; this is a
 * fallback for anyone who can't or won't open a terminal.
 */

// Content is static, so the page is built once at boot rather than per request.
const page = renderHtml();

export function createHttpServer(): http.Server {
  return http.createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { "content-type": "text/plain; charset=utf-8", allow: "GET, HEAD" });
      res.end("Method not allowed\n");
      return;
    }

    // Everything lives on one page behind anchor links, so there's nothing else to route to.
    const path = (req.url ?? "/").split("?")[0];
    if (path !== "/") {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found — the CV is at /, or run `ssh mikebeach.co.uk`\n");
      return;
    }

    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "content-length": Buffer.byteLength(page),
    });
    res.end(req.method === "HEAD" ? undefined : page);
  });
}
