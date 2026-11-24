import { about, education, experience, profile, projects, skills } from "../content";

/**
 * Renders the CV as JSON for AI agents and other tools, served at `/cv.json`.
 *
 * Fifth renderer of `content.ts`, alongside `sections.ts` (TUI), `plainText.ts`,
 * `html.ts` and `pdf.ts`. It passes the content objects through as they are,
 * rather than picking fields, so a new field or section in `content.ts` appears
 * here without a change to this file.
 *
 * Read-only, like every HTTP route (ADR 0004): an agent fetches it with a plain
 * GET, with no parameters, body or credentials.
 */
export function renderJson(): string {
  const site = profile.links.website;

  const cv = {
    description:
      "Mike Beach's CV as structured data. The same content is served over SSH, as HTML, as plain text and as a PDF.",
    formats: {
      ssh: "ssh mikebeach.co.uk",
      html: `${site}/`,
      text: `${site}/cv.txt`,
      pdf: `${site}/cv.pdf`,
      json: `${site}/cv.json`,
    },
    profile,
    about,
    experience,
    projects,
    skills,
    education,
  };

  return `${JSON.stringify(cv, null, 2)}\n`;
}
