import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { renderPlainText } from "./ui/plainText";
import { renderHtml } from "./ui/html";
import { renderPdf } from "./ui/pdf";
import { renderJson } from "./ui/json";
import { renderLlmsTxt } from "./ui/llmsTxt";

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
const PDF = "application/pdf";
const CSS = "text/css; charset=utf-8";
const JSON_TYPE = "application/json; charset=utf-8";
const MARKDOWN = "text/markdown; charset=utf-8";

// `npm run build` copies styles.css next to the compiled JS, so this path works
// from both `src/` (tsx in dev) and `dist/` (production).
const stylesCss = fs.readFileSync(path.join(__dirname, "ui", "styles.css"), "utf8");

const robotsTxt = [
  "# The CV is meant to be read. Crawl away.",
  "User-agent: *",
  "Allow: /",
  "",
  "# Markup-free version of this page: /cv.txt",
  "# Printable version: /cv.pdf",
  "# Structured data for AI agents and tools: /cv.json",
  "# Guide for AI tools: /llms.txt",
  "",
].join("\n");

// Content is static, so every response body is built once at boot.
// `/cv.txt` reuses the no-pty renderer rather than introducing another copy of
// the CV — it's the same text `ssh -T mikebeach.co.uk` returns.
// pdfkit streams its output, so the PDF is the one body that has to be awaited.
//
// `/cv.json` and `/llms.txt` are for AI agents and other tools. They allow any
// origin (CORS), so an agent running in a browser can fetch them too. That's
// safe because, like every route here, they're public, read-only and take no
// input.
interface Route {
  body: string | Buffer;
  type: string;
  headers?: Record<string, string>;
}

const ANY_ORIGIN = { "access-control-allow-origin": "*" };

async function buildRoutes(): Promise<Map<string, Route>> {
  return new Map<string, Route>([
    ["/", { body: renderHtml(), type: HTML }],
    ["/cv.txt", { body: renderPlainText(), type: TEXT }],
    ["/cv.pdf", { body: await renderPdf(), type: PDF }],
    ["/cv.json", { body: renderJson(), type: JSON_TYPE, headers: ANY_ORIGIN }],
    ["/llms.txt", { body: renderLlmsTxt(), type: MARKDOWN, headers: ANY_ORIGIN }],
    ["/styles.css", { body: stylesCss, type: CSS }],
    ["/robots.txt", { body: robotsTxt, type: TEXT }],
  ]);
}

export async function createHttpServer(): Promise<http.Server> {
  const routes = await buildRoutes();
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
      ...route.headers,
      "content-type": route.type,
      "content-length": Buffer.byteLength(route.body),
    });
    res.end(req.method === "HEAD" ? undefined : route.body);
  });
}
