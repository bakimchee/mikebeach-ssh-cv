import { about, education, experience, profile, projects, skills } from "../content";

/**
 * Renders the CV as a single plain HTML document for Visitors arriving over HTTP
 * instead of SSH. Deliberately styleless — no CSS, no scripts — so it stays
 * readable in any browser and needs no build step beyond `tsc`.
 *
 * Third renderer of `content.ts`, alongside `sections.ts` (TUI) and
 * `plainText.ts` (no-pty); a content or shape change belongs in all three.
 */

/** Content is owner-supplied, not Visitor input, but escaping keeps stray `&`/`<` from breaking the markup. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function link(url: string, text = url): string {
  return `<a href="${escapeHtml(url)}">${escapeHtml(text)}</a>`;
}

/** Menu order matches MENU_ITEMS in `app.ts`, so the page reads like the TUI. */
const SECTIONS = ["About", "Experience", "Projects", "Skills", "Education", "Contact"] as const;

function navigation(): string {
  const items = SECTIONS.map(
    (name) => `      <li><a href="#${name.toLowerCase()}">${name}</a></li>`,
  );
  return ["  <nav>", "    <ul>", ...items, "    </ul>", "  </nav>"].join("\n");
}

function aboutSection(): string {
  const paragraphs = about.map((paragraph) => `    <p>${escapeHtml(paragraph)}</p>`);
  return ["  <section id=\"about\">", "    <h2>About</h2>", ...paragraphs, "  </section>"].join("\n");
}

function experienceSection(): string {
  const lines = ["  <section id=\"experience\">", "    <h2>Experience</h2>"];
  for (const job of experience) {
    lines.push("    <article>");
    lines.push(`      <h3>${escapeHtml(job.role)}</h3>`);
    lines.push(`      <p>${escapeHtml(job.company)}<br>${escapeHtml(job.period)}</p>`);
    if (job.summary) lines.push(`      <p>${escapeHtml(job.summary)}</p>`);
    lines.push("      <ul>");
    for (const highlight of job.highlights) {
      lines.push(`        <li>${escapeHtml(highlight)}</li>`);
    }
    lines.push("      </ul>", "    </article>");
  }
  lines.push("  </section>");
  return lines.join("\n");
}

function projectsSection(): string {
  const lines = ["  <section id=\"projects\">", "    <h2>Projects</h2>"];
  for (const project of projects) {
    lines.push("    <article>");
    lines.push(`      <h3>${escapeHtml(project.name)}</h3>`);
    lines.push(`      <p>${escapeHtml(project.description)}</p>`);
    if (project.url) lines.push(`      <p>${link(project.url)}</p>`);
    if (project.tech?.length) {
      lines.push(`      <p>${escapeHtml(project.tech.join(", "))}</p>`);
    }
    lines.push("    </article>");
  }
  lines.push("  </section>");
  return lines.join("\n");
}

function skillsSection(): string {
  const items = skills.map((skill) => `      <li>${escapeHtml(skill)}</li>`);
  return [
    "  <section id=\"skills\">",
    "    <h2>Skills</h2>",
    "    <ul>",
    ...items,
    "    </ul>",
    "  </section>",
  ].join("\n");
}

function educationSection(): string {
  const lines = ["  <section id=\"education\">", "    <h2>Education</h2>"];
  for (const item of education) {
    lines.push("    <article>");
    lines.push(`      <h3>${escapeHtml(item.title)}</h3>`);
    const detail = `${item.institution}, ${item.period}${item.grade ? `, ${item.grade}` : ""}`;
    lines.push(`      <p>${escapeHtml(detail)}</p>`);
    lines.push("    </article>");
  }
  lines.push("  </section>");
  return lines.join("\n");
}

function contactSection(): string {
  return [
    "  <section id=\"contact\">",
    "    <h2>Contact</h2>",
    "    <ul>",
    `      <li>Email: ${link(`mailto:${profile.email}`, profile.email)}</li>`,
    `      <li>GitHub: ${link(profile.links.github)}</li>`,
    `      <li>LinkedIn: ${link(profile.links.linkedin)}</li>`,
    "    </ul>",
    "    <p>There's a contact form in the terminal version, if you'd rather use that.</p>",
    "  </section>",
  ].join("\n");
}

export function renderHtml(): string {
  return [
    "<!doctype html>",
    '<html lang="en-GB">',
    "<head>",
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    `  <title>${escapeHtml(`${profile.name} — ${profile.tagline}`)}</title>`,
    `  <meta name="description" content="${escapeHtml(`${profile.tagline} in ${profile.location}.`)}">`,
    "</head>",
    "<body>",
    `  <h1>${escapeHtml(profile.name)}</h1>`,
    `  <p>${escapeHtml(profile.tagline)}<br>${escapeHtml(profile.location)}</p>`,
    "  <p>This CV is meant to be read over SSH — run <code>ssh mikebeach.co.uk</code> for the interactive version.</p>",
    navigation(),
    "  <hr>",
    aboutSection(),
    "  <hr>",
    experienceSection(),
    "  <hr>",
    projectsSection(),
    "  <hr>",
    skillsSection(),
    "  <hr>",
    educationSection(),
    "  <hr>",
    contactSection(),
    "</body>",
    "</html>",
    "",
  ].join("\n");
}
