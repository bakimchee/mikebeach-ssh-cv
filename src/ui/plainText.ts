import { about, experience, profile, projects, skills } from "../content";

/** Rendered for clients that didn't request a pty (scripts, pipes, `ssh host < /dev/null`). */
export function renderPlainText(): string {
  const lines: string[] = [];

  lines.push(`${profile.name} — ${profile.tagline}`, profile.location, "");
  lines.push(...about, "");

  lines.push("Experience", "----------");
  for (const job of experience) {
    lines.push(`${job.role}, ${job.company} (${job.period})`);
    if (job.summary) lines.push(job.summary, "");
    for (const highlight of job.highlights) lines.push(`  - ${highlight}`);
    lines.push("");
  }

  lines.push("Projects", "--------");
  for (const project of projects) {
    lines.push(`${project.name}${project.url ? ` — ${project.url}` : ""}`);
    lines.push(`  ${project.description}`);
    if (project.tech?.length) lines.push(`  tech: ${project.tech.join(", ")}`);
    lines.push("");
  }

  lines.push("Skills", "------");
  lines.push(skills.join(", "), "");

  lines.push("Contact", "-------");
  lines.push(`Email:    ${profile.email}`);
  lines.push(`GitHub:   ${profile.links.github}`);
  lines.push(`LinkedIn: ${profile.links.linkedin}`);
  lines.push("");
  lines.push("(connect with a real terminal for the interactive version)");

  return lines.join("\n");
}
