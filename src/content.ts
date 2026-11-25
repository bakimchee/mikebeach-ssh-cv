export interface Job {
  role: string;
  company: string;
  period: string;
  /** Optional paragraph shown above the highlights, for roles that need framing. */
  summary?: string;
  highlights: string[];
}

export interface Qualification {
  title: string;
  institution: string;
  period: string;
  grade?: string;
}

export interface Project {
  name: string;
  description: string;
  url?: string;
  tech?: string[];
}

export const profile = {
  name: "Mike Beach",
  tagline: "Engineering Manager, Design Systems",
  location: "Manchester, United Kingdom",
  email: "me@mikebeach.co.uk",
  links: {
    github: "https://github.com/bakimchee",
    linkedin: "https://www.linkedin.com/in/mike-beach/",
    website: "https://mikebeach.co.uk",
  },
};

export const about: string[] = [
  "I'm an engineering manager at Sainsbury's, leading Fable, the multi-brand design system behind sainsburys.co.uk and argos.co.uk, which get millions of visits a month. A design system is the shared library of components, colours and patterns that product teams build from, so every page looks and works consistently, meets accessibility standards, and teams don't rebuild the same things.",
  "I've grown the team from 2 to 8 engineers across web, iOS and Android, and I bring AI-assisted development into how we build. I moved into leadership after progressing from software engineer to senior engineer. I've worked across React, TypeScript, JavaScript, CSS and Node.js, and still build things end to end, including this CV.",
];

export const experience: Job[] = [
  {
    role: "Engineering Manager, Design Systems",
    company: "Sainsbury's Digital, Tech and Data",
    period: "March 2024 – Present",
    summary:
      "Responsible for the engineers, the technical direction and scaling Fable across web, iOS and Android.",
    highlights: [
      "Lead engineering for Fable, the multi-brand design system behind sainsburys.co.uk and argos.co.uk, sites with millions of visits a month. In 2025 the team shipped 77 releases, migrated 40 applications to Fable v5 and cut the number of design tokens by 42%",
      "Grew the team from 2 to 8 engineers across web, iOS and Android, and manage them day to day, including recruitment and development",
      "Continued building Fable's React and TypeScript components for Next.js and React applications, and took Fable to iOS and Android with shared design tokens and typography",
      "Set up Style Dictionary to turn design tokens (shared colour, spacing and type values) from the Figma API into code for multiple brands, so designers have the source of truth",
      "Built Figma plugins that measure design system adoption in a Figma file, to help the handover from design to development",
      "Made Fable usable by AI coding tools: helped introduce an MCP package in January 2026 (a connector that lets AI tools use only approved components and tokens), and wrote AI skills that guide AI agents through migrations to Fable and onboard them to it",
      "Wrote an AI skill that keeps Vercel's v0, an AI tool that generates UI, on the design system, with evals (automated checks) its output must pass. Gave detailed feedback on v0's design system integration during its beta",
      "Lead \"AI Assisted Engineering\" demos across engineering at Sainsbury's, and create AI skills in Figma",
      "Coordinated the registry migration for Luna, the previous design system, across the organisation in March and April 2026: found the affected repositories, communicated the risks and tracked it to completion",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Sainsbury's Digital, Tech and Data",
    period: "July 2021 – March 2024",
    highlights: [
      "Built Fable, Sainsbury's multi-brand design system, as React components in TypeScript, optimised for use across Next.js and React applications. TypeScript was a main driver, as Luna, the previous design system, was JavaScript only",
      "Took on technical leadership of engineering standards, shared components and design system adoption, advising engineers and delivery teams on implementation, accessibility and migration planning",
      "Set up visual regression testing (automated screenshot checks that catch unintended visual changes) with Storybook and Chromatic, and built an alternative setup using Vercel and GitHub Actions",
      "Brought sites up to WCAG AA, the recognised accessibility standard, with automated accessibility tests using Jest and axe-core, and audited performance and accessibility with Lighthouse",
      "Worked closely with Evinced to set up their accessibility unit testing tool, and gave feedback during their beta",
      "Turned design system strategy into technical plans with engineering, product and design",
      "Grew into stakeholder management, delivery coordination and mentoring alongside the engineering work",
    ],
  },
  {
    role: "Software Engineer",
    company: "Sainsbury's Digital, Tech and Data",
    period: "March 2019 – July 2021",
    highlights: [
      "Built and maintained customer-facing web experiences in React and TypeScript, on shared component libraries",
      "Contributed reusable components, design tokens, accessibility improvements and engineering documentation, working with designers and product managers to keep the UI consistent",
      "Worked with automated testing, CI/CD, Agile delivery and production support",
    ],
  },
  {
    role: "Front End Developer",
    company: "Moriyama",
    period: "March 2014 – March 2019",
    summary: "Agency work for a mix of client brands.",
    highlights: [
      "Built front ends for clients including PwC, PPG, Antiques Trade Gazette, Towergate Insurance and Sodexo",
      "Built with Angular 2 for PwC and AngularJS on other projects, in JavaScript and early TypeScript",
      "Did much of the design work in code, alongside the front-end development",
      "Designed and developed for PPG Europe, using their brand guidelines and existing designed pages to extend their external site, internal sites and business-facing (B2B) sites",
      "Shaped the CMS architecture on Umbraco, and earned official Umbraco Level 1 and Level 2 certifications",
    ],
  },
  {
    role: "Trainee Web Designer and Front End Developer",
    company: "Liverpool City Council (LDL)",
    period: "October 2011 – March 2014",
    summary: "Started in web design and moved into front-end development, building sites from my own designs.",
    highlights: [
      "Designed and mocked up pages in Photoshop and Illustrator, then built them as HTML, CSS and JavaScript sites",
      "Built the HTML and CSS templates that the .NET developers worked from",
      "Put together front-end build tooling in Gulp, and added interactivity in JavaScript",
      "Worked on internal Umbraco sites and applications, including the Liverpool City Council intranet, the LDL intranet and recruitment websites",
      "Got my first exposure to accessibility",
    ],
  },
];

export const education: Qualification[] = [
  {
    title: "BA (Hons) TV Production and Film Studies",
    institution: "University of Chester",
    period: "2006 – 2009",
    grade: "2:1",
  },
];

export const projects: Project[] = [
  {
    name: "This CV",
    description:
      "My CV as a website, a PDF, plain text and an interactive version you can open from a terminal with `ssh mikebeach.co.uk`. AI tools can read it too, and the source code is public.",
    url: "https://github.com/bakimchee/mikebeach-ssh-cv",
    tech: ["Node.js", "TypeScript", "ssh2", "blessed", "Fly.io"],
  },
];

export const skills: string[] = [
  "Technical Leadership",
  "People Management",
  "Agile Delivery",
  "Design Systems",
  "Design System Analytics",
  "Design Tokens (Style Dictionary, Figma API)",
  "Figma API & Plugins",
  "Storybook & Chromatic",
  "React / Next.js",
  "JavaScript / TypeScript",
  "CSS & HTML",
  "Accessibility (WCAG AA, axe-core, Evinced)",
  "UX",
  "CMS Architecture",
  "AI-Assisted Development (v0, MCP, AI Skills, Evals)",
  "Testing (Jest, axe-core, Lighthouse)",
  "CI/CD (GitHub Actions, Vercel)",
];
