import { about, experience, profile, projects, skills } from "../content";

export function aboutText(): string {
  return [`{bold}${profile.name}{/bold}`, profile.tagline, profile.location, "", ...about].join("\n");
}

export function experienceText(): string {
  const lines: string[] = [];
  for (const job of experience) {
    lines.push(`{bold}${job.role}{/bold}, ${job.company}`, `{grey-fg}${job.period}{/grey-fg}`);
    for (const highlight of job.highlights) lines.push(`  - ${highlight}`);
    lines.push("");
  }
  return lines.join("\n");
}

export function projectsText(): string {
  const lines: string[] = [];
  for (const project of projects) {
    lines.push(`{bold}${project.name}{/bold}`);
    lines.push(project.description);
    if (project.url) lines.push(`{cyan-fg}${project.url}{/cyan-fg}`);
    if (project.tech?.length) lines.push(`{grey-fg}${project.tech.join(", ")}{/grey-fg}`);
    lines.push("");
  }
  return lines.join("\n");
}

export function skillsText(): string {
  return skills.join("  ·  ");
}

export function contactInfoText(): string {
  return [
    `Email:    {cyan-fg}${profile.email}{/cyan-fg}`,
    `GitHub:   {cyan-fg}${profile.links.github}{/cyan-fg}`,
    `LinkedIn: {cyan-fg}${profile.links.linkedin}{/cyan-fg}`,
    "",
    "Or leave a message below and it'll land straight in my inbox:",
  ].join("\n");
}
