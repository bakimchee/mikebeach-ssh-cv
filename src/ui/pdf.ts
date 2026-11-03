import PDFDocument from "pdfkit";
import { about, education, experience, profile, projects, skills } from "../content";

/**
 * Renders the CV as an A4 PDF for Visitors who need a file to attach or print.
 *
 * Fourth renderer of `content.ts`, alongside `sections.ts` (TUI),
 * `plainText.ts` (no-pty) and `html.ts` (browser); a content or shape change
 * belongs in all four.
 *
 * Uses pdfkit's built-in Helvetica, so there are no font files to ship. Those
 * fonts are WinAnsi-encoded: dashes and curly quotes are fine, but anything
 * outside Windows-1252 won't render.
 */

const MUTED = "#555555";
const RULE = "#bbbbbb";

type Doc = InstanceType<typeof PDFDocument>;

function heading(doc: Doc, title: string): void {
  doc.moveDown(0.8);
  doc.font("Helvetica-Bold").fontSize(13).fillColor("black").text(title);
  const y = doc.y + 2;
  doc
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .lineWidth(0.5)
    .strokeColor(RULE)
    .stroke();
  doc.moveDown(0.5);
}

function body(doc: Doc, text: string, options: PDFKit.Mixins.TextOptions = {}): void {
  doc.font("Helvetica").fontSize(10).fillColor("black").text(text, { lineGap: 1.5, ...options });
}

function bullets(doc: Doc, items: string[]): void {
  doc.font("Helvetica").fontSize(10).fillColor("black");
  doc.list(items, { bulletRadius: 1.5, textIndent: 10, bulletIndent: 4, lineGap: 1.5 });
}

function header(doc: Doc): void {
  doc.font("Helvetica-Bold").fontSize(22).fillColor("black").text(profile.name);
  doc.font("Helvetica").fontSize(12).fillColor(MUTED).text(profile.tagline);
  doc.moveDown(0.3);

  // One line of contact details, each a live link.
  const contacts: [string, string][] = [
    [profile.email, `mailto:${profile.email}`],
    [profile.links.website.replace(/^https:\/\//, ""), profile.links.website],
    [profile.links.github.replace(/^https:\/\//, ""), profile.links.github],
    [profile.links.linkedin.replace(/^https:\/\/www\./, ""), profile.links.linkedin],
  ];
  doc.fontSize(9).text(profile.location);
  contacts.forEach(([text, url], i) => {
    const last = i === contacts.length - 1;
    doc.text(text, { link: url, underline: false, continued: true });
    doc.text(last ? "" : "  ·  ", { link: null, continued: !last });
  });
}

function aboutSection(doc: Doc): void {
  heading(doc, "About");
  about.forEach((paragraph, i) => {
    if (i > 0) doc.moveDown(0.5);
    body(doc, paragraph);
  });
}

function experienceSection(doc: Doc): void {
  heading(doc, "Experience");
  experience.forEach((job, i) => {
    if (i > 0) doc.moveDown(0.7);
    doc.font("Helvetica-Bold").fontSize(11).fillColor("black").text(job.role);
    doc.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(`${job.company}  ·  ${job.period}`);
    doc.moveDown(0.3);
    if (job.summary) {
      body(doc, job.summary);
      doc.moveDown(0.3);
    }
    bullets(doc, job.highlights);
  });
}

function projectsSection(doc: Doc): void {
  heading(doc, "Projects");
  projects.forEach((project, i) => {
    if (i > 0) doc.moveDown(0.7);
    doc.font("Helvetica-Bold").fontSize(11).fillColor("black").text(project.name);
    if (project.url) {
      doc.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(project.url, { link: project.url });
    }
    doc.moveDown(0.3);
    body(doc, project.description);
    if (project.tech?.length) {
      doc.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(project.tech.join(", "));
    }
  });
}

function skillsSection(doc: Doc): void {
  heading(doc, "Skills");
  body(doc, skills.join("  ·  "));
}

function educationSection(doc: Doc): void {
  heading(doc, "Education");
  for (const item of education) {
    doc.font("Helvetica-Bold").fontSize(11).fillColor("black").text(item.title);
    const detail = `${item.institution}  ·  ${item.period}${item.grade ? `  ·  ${item.grade}` : ""}`;
    doc.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(detail);
  }
}

/** Resolves once pdfkit has finished streaming the document into memory. */
export function renderPdf(): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 56, right: 56 },
    info: {
      Title: `${profile.name} — CV`,
      Author: profile.name,
      Subject: profile.tagline,
      Keywords: skills.join(", "),
    },
  });

  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  // Same section order as MENU_ITEMS in `app.ts`; contact details live in the header.
  header(doc);
  aboutSection(doc);
  experienceSection(doc);
  projectsSection(doc);
  skillsSection(doc);
  educationSection(doc);

  doc.end();
  return done;
}
