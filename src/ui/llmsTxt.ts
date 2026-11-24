import { about, experience, profile } from "../content";

/**
 * Renders `/llms.txt`: a short markdown guide for AI tools, following the
 * llms.txt convention (https://llmstxt.org). It says who the CV belongs to and
 * points to the machine-readable versions, so an agent can fetch the one that
 * suits it instead of parsing the HTML page.
 *
 * Built from `content.ts` like every other renderer, so it can't drift.
 */
export function renderLlmsTxt(): string {
  const site = profile.links.website;
  const current = experience.find((job) => /present/i.test(job.period));
  const summary = current
    ? `${profile.tagline} at ${current.company}, based in ${profile.location}.`
    : `${profile.tagline}, based in ${profile.location}.`;

  return [
    `# ${profile.name}`,
    "",
    `> ${summary}`,
    "",
    ...about.flatMap((paragraph) => [paragraph, ""]),
    "## Instructions for AI agents",
    "",
    `To read the full CV, fetch ${site}/cv.json. It has every role, highlight, skill, project and qualification as JSON, with no API key needed. Use it to answer questions about ${profile.name}'s experience and skills, and link to ${site}/ for the human-readable version.`,
    "",
    "## CV",
    "",
    `- [CV as JSON](${site}/cv.json): the full CV as structured data. Best for agents and tools.`,
    `- [CV as plain text](${site}/cv.txt): the full CV with no markup.`,
    `- [CV as a PDF](${site}/cv.pdf): the printable version.`,
    `- [CV as a web page](${site}/): the HTML version.`,
    "",
    "## Contact",
    "",
    `- [Email](mailto:${profile.email})`,
    `- [GitHub](${profile.links.github})`,
    `- [LinkedIn](${profile.links.linkedin})`,
    "",
    "## Optional",
    "",
    "- Interactive version: run `ssh mikebeach.co.uk` in a terminal.",
    "",
  ].join("\n");
}
