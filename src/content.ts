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
  "I'm an engineering manager at Sainsbury's, leading Fable, the multi-brand design system behind sainsburys.co.uk and argos.co.uk, which get millions of visits a month. I build accessible front-end platforms and scale Fable across web, iOS and Android. I manage the engineers and bring AI-assisted development workflows into how we build. I moved into leadership after progressing from software engineer to senior engineer.",
  "I care about UI that stays accessible and consistent as it grows: reusable components, design tokens, and the documentation and workflows that get a design system adopted. I've worked across React, TypeScript, JavaScript, CSS and Node.js, and still build things end to end, including this CV.",
]

export const experience: Job[] = [
  {
    role: "Engineering Manager, Fable Design System",
    company: "Sainsbury's Digital, Tech and Data",
    period: "March 2024 – Present",
    summary:
      "Moved from software engineering into management, now responsible for the engineers, the technical direction and scaling a multi-brand design system across web, iOS and Android.",
    highlights: [
      "Lead engineering for Fable, the multi-brand design system behind sainsburys.co.uk and argos.co.uk, sites with millions of visits a month. In 2025 the team shipped 77 releases, migrated 40 applications to Fable v5 and cut the number of design tokens by 42%",
      "Continued building Fable's React and TypeScript components for Next.js and React applications",
      "Took Fable beyond web, bringing design tokens and typography to iOS and Android",
      "Set up Style Dictionary to generate design tokens for multiple brands, fed by the Figma API so designers have the source of truth",
      "Work closely with designers who build design systems in Sketch and Figma",
      "Built Figma plugins that measure design system adoption in a Figma file, to help the handover from design to development",
      "Create AI skills in Figma",
      "Helped introduce the Fable MCP package in January 2026, so AI-assisted tools work from approved components and design tokens",
      "Wrote in-depth AI skills for Fable that guide AI agents through codebase migrations and onboard them to the design system",
      "Wrote an AI skill for Vercel's v0 that restricts it to the design system, with a set of evals its output must pass",
      "Lead \"AI Assisted Engineering\" demos across engineering at Sainsbury's",
      "Set up our design systems in Vercel's v0, and gave detailed feedback on how it integrated as part of the v0 beta",
      "Lead work on AI-assisted engineering workflows, design system analytics, platform migrations and adoption measurement",
      "Manage engineers day to day, including recruitment and colleague development",
      "Coordinated the registry migration for Luna, the previous design system, across the organisation in March and April 2026: found the affected repositories, communicated the risks and tracked it to completion",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Sainsbury's Digital, Tech and Data",
    period: "July 2021 – March 2024",
    highlights: [
      "Built Fable, Sainsbury's multi-brand design system, as React components in TypeScript, optimised for use across Next.js and React applications. TypeScript was a main driver, as Luna, the previous design system, was JavaScript only",
      "Took on technical leadership, owning more of the engineering standards, shared components and design system adoption",
      "Advised engineers and delivery teams on implementation, accessibility, reusable components and migration planning",
      "Used Storybook extensively for the component library, and set up Chromatic for visual regression testing",
      "Built an alternative visual regression setup using Vercel and GitHub Actions",
      "Brought sites up to WCAG AA, with automated accessibility tests using Jest and axe-core",
      "Used Lighthouse to audit performance and accessibility",
      "Worked closely with Evinced to set up their accessibility unit testing tool, and gave feedback during their beta",
      "Worked with engineering, product and design to turn design system strategy into technical plans teams could build on",
      "Grew into stakeholder management, delivery coordination and mentoring alongside the engineering work",
    ],
  },
  {
    role: "Software Engineer",
    company: "Sainsbury's Digital, Tech and Data",
    period: "March 2019 – July 2021",
    highlights: [
      "Built and maintained customer-facing web experiences in React and TypeScript, on shared component libraries",
      "Contributed reusable components, design tokens, accessibility improvements and engineering documentation",
      "Kept the UI consistent alongside designers, product managers and engineers",
      "Learned automated testing, CI/CD, Agile delivery and production support",
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
      "An SSH server that serves this CV as an interactive terminal user interface (TUI), with HTML, plain-text and PDF versions for the browser. It's public and needs no login: run `ssh mikebeach.co.uk`.",
    url: "https://github.com/bakimchee/mikebeach-ssh-cv",
    tech: ["Node.js", "TypeScript", "ssh2", "blessed", "Fly.io"],
  },
];

export const skills: string[] = [
  "Design Systems",
  "Design System Analytics",
  "Technical Leadership",
  "People Management",
  "AI-Assisted Development (v0, MCP, AI Skills, Evals)",
  "Design Tokens (Style Dictionary, Figma API)",
  "Storybook & Chromatic",
  "Testing (Jest, axe-core, Lighthouse)",
  "CI/CD (GitHub Actions, Vercel)",
  "React / Next.js",
  "JavaScript / TypeScript",
  "Figma API & Plugins",
  "CSS & HTML",
  "CMS Architecture",
  "Accessibility (WCAG AA, axe-core, Evinced)",
  "Agile Delivery",
  "UX",
];
