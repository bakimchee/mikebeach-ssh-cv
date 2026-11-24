import { about, education, experience, profile, projects, skills } from "../content";

/**
 * Renders the CV as a single plain HTML document for Visitors arriving over HTTP
 * instead of SSH. No scripts, and only the minimal stylesheet in `styles.css`
 * (a reset, one readable column and a system font stack), so it stays readable
 * in any browser, and still reads fine if the stylesheet never loads.
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
 * A link that opens in a new tab, so the CV stays open behind it. The hidden
 * text tells screen reader users about the new tab, which sighted users can
 * see happen (SC 3.2.5).
 */
function newTabLink(url: string, text: string): string {
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}<span class="visually-hidden"> (opens in a new tab)</span></a>`;
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
  return ['  <nav aria-label="Sections">', '    <ul class="inline-list" role="list">', ...items, "    </ul>", "  </nav>"].join("\n");
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
    lines.push(`      <p class="meta">${escapeHtml(job.company)}<br>${escapeHtml(job.period)}</p>`);
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
      lines.push(`      <p class="meta">${escapeHtml(project.tech.join(", "))}</p>`);
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
    '    <ul class="inline-list tags" role="list">',
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
    lines.push(`      <p class="meta">${escapeHtml(detail)}</p>`);
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
    "    <p>The terminal version also has a contact form.</p>",
    "  </section>",
  ].join("\n");
}

/**
 * "Summarise this CV with AI": one prompt a Visitor can paste into an AI
 * assistant, which sends it to `/llms.txt` for instructions. A <details> element gives a
 * button that opens and closes with no script, in keeping with ADR 0004.
 *
 * Below the prompt, plain links open Claude or ChatGPT with the prompt already
 * typed in, via their `?q=` parameter. Neither service documents that
 * parameter as a supported feature, so if a link stops prefilling, the prompt
 * above it still works by copy and paste.
 */
function summariseWithAi(): string {
  const prompt = `Summarise ${profile.name}'s CV. Fetch ${profile.links.website}/llms.txt and follow it.`;
  return [
    '  <details class="ai-summary">',
    "    <summary>Summarise this CV with AI</summary>",
    "    <p>Paste this into ChatGPT, Claude or another AI assistant:</p>",
    `    <pre><code>${escapeHtml(prompt)}</code></pre>`,
    `    <p>Or open it in ${newTabLink(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, "Claude")} or ${newTabLink(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, "ChatGPT")}.</p>`,
    "  </details>",
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
    '  <link rel="stylesheet" href="/styles.css">',
    // Point AI agents and other tools at the machine-readable versions.
    '  <link rel="alternate" type="application/json" href="/cv.json" title="CV as JSON">',
    '  <link rel="alternate" type="text/plain" href="/cv.txt" title="CV as plain text">',
    structuredData(),
    "</head>",
    "<body>",
    '<div class="container">',
    `  <h1>${escapeHtml(profile.name)}</h1>`,
    `  <p class="meta">${escapeHtml(profile.tagline)}<br>${escapeHtml(profile.location)}</p>`,
    "  <p>The interactive version of this CV runs over SSH: <code>ssh mikebeach.co.uk</code>. There's also a plain-text copy at <a href=\"/cv.txt\">/cv.txt</a> and a printable PDF at <a href=\"/cv.pdf\">/cv.pdf</a>.</p>",
    summariseWithAi(),
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
    "</div>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
}
