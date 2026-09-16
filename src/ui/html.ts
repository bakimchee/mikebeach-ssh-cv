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

/**
 * schema.org Person, so tools reading this page get typed facts instead of
 * having to infer them from the prose — in particular who I currently work for
 * and which "Mike Beach" this is (that's what sameAs is for).
 *
 * Inert data, never executed. Built from `content.ts` like every other
 * renderer here, so it can't drift from the visible page.
 *
 * Employment history deliberately isn't modelled: schema.org has no clean
 * employer-plus-dates shape for a Person, and a bad approximation would be
 * worse than the prose below, which reads perfectly well.
 */
function structuredData(): string {
  const current = experience.find((job) => /present/i.test(job.period));

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.tagline,
    description: about.join(" "),
    email: `mailto:${profile.email}`,
    url: profile.links.website,
    address: profile.location,
    sameAs: [profile.links.github, profile.links.linkedin],
    ...(current ? { worksFor: { "@type": "Organization", name: current.company } } : {}),
    alumniOf: education.map((item) => ({
      "@type": "CollegeOrUniversity",
      name: item.institution,
    })),
    knowsAbout: skills,
  };

  // Escaping `<` keeps a stray "</script>" in the content from closing the tag early.
  // Note this is JSON, not markup — escapeHtml would corrupt it.
  const json = JSON.stringify(person, null, 2).replace(/</g, "\\u003c");
  return `  <script type="application/ld+json">\n${json}\n  </script>`;
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
    structuredData(),
    "</head>",
    "<body>",
    `  <h1>${escapeHtml(profile.name)}</h1>`,
    `  <p>${escapeHtml(profile.tagline)}<br>${escapeHtml(profile.location)}</p>`,
    "  <p>This CV is meant to be read over SSH — run <code>ssh mikebeach.co.uk</code> for the interactive version. There's a markup-free copy at <a href=\"/cv.txt\">/cv.txt</a>.</p>",
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
