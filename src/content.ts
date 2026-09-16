export interface Job {
  role: string;
  company: string;
  period: string;
  /** Optional paragraph shown above the highlights, for roles that need framing. */
  summary?: string;
  highlights: string[];
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
  "Engineering manager for the Fable Design System at Sainsbury's, after progressing from software engineer to senior engineer and then into leadership. I build accessible frontend platforms, scale a multi-brand design system across web, iOS and Android, manage engineers, and bring AI-assisted development workflows into how we build.",
  "I care about UI that stays accessible and consistent as it grows: reusable components, design tokens, and the documentation and workflows that get a design system actually adopted. I've worked across JavaScript, TypeScript, CSS and Node.js, and I still like building things end to end. This CV is one of them.",
];

export const experience: Job[] = [
  {
    role: "Engineering Manager, Fable Design System",
    company: "Sainsbury's Digital, Tech and Data",
    period: "March 2024 – Present",
    summary:
      "Moved from software engineering into management, now responsible for the engineers, the technical direction and scaling a multi-brand design system across web, iOS and Android.",
    highlights: [
      "Lead engineering for Fable adoption across Sainsbury's and Argos. In 2025 the team shipped 77 releases, migrated 40 applications to Fable v5 and cut the number of design tokens by 42%",
      "Took Fable beyond web, bringing design tokens and typography to iOS and Android",
      "Helped introduce the Fable MCP package in January 2026, so AI-assisted tools work from approved components and design tokens",
      "Lead work on AI-assisted engineering workflows, design-system analytics, platform migrations and adoption measurement",
      "Manage engineers day to day, including recruitment and colleague development",
      "Coordinated the Luna registry migration across the organisation in March and April 2026: found the affected repositories, communicated the risks and tracked it to completion",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Sainsbury's Digital, Tech and Data",
    period: "July 2021 – March 2024",
    highlights: [
      "Moved into technical leadership, owning more of the engineering standards, shared components and design-system adoption",
      "Advised engineers and delivery teams on implementation, accessibility, reusable components and migration planning",
      "Worked with engineering, product and design to turn design-system strategy into technical plans teams could build on",
      "Picked up the stakeholder management, delivery coordination and mentoring that led to the move into management",
    ],
  },
  {
    role: "Software Engineer",
    company: "Sainsbury's",
    period: "March 2019 – July 2021",
    highlights: [
      "Built and maintained customer-facing web experiences on shared component libraries",
      "Contributed reusable components, design tokens, accessibility improvements and engineering documentation",
      "Worked with designers, product managers and engineers to keep the UI consistent",
      "Built experience in automated testing, CI/CD, Agile delivery and production support",
    ],
  },
  {
    role: "Front End Developer",
    company: "Moriyama",
    period: "March 2014 – March 2019",
    summary: "Agency work, building front ends for client brands.",
    highlights: [
      "Built front ends for clients including PwC, PPG, Antiques Trade Gazette, Towergate Insurance and Sodexo",
      "Worked in JavaScript and early TypeScript, building with Angular",
      "Did a lot of the design work in code, alongside the front-end development",
      "Built CMS architecture on Umbraco, and earned official Umbraco level 1 and 2 certifications",
    ],
  },
  {
    role: "Early career: Web Design & Development",
    company: "Liverpool Direct Limited, freelance, Community Integrated Care",
    period: "2010 – 2014",
    highlights: [
      "Web Designer at Liverpool Direct Limited, freelance website development, and Website & Marketing Assistant at Community Integrated Care",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "This CV",
    description:
      "You're looking at it: a public, unauthenticated SSH server that renders this CV as an interactive TUI. There's no website, you just run `ssh mikebeach.co.uk`.",
    url: "https://github.com/bakimchee/mikebeach-ssh-cv",
    tech: ["Node.js", "TypeScript", "ssh2", "blessed", "Fly.io"],
  },
];

export const skills: string[] = [
  "Design Systems",
  "Design System Analytics",
  "Technical Leadership",
  "People Management",
  "AI-Assisted Development",
  "JavaScript / TypeScript",
  "CSS & HTML",
  "CMS Architecture",
  "Accessibility (a11y)",
  "Agile Delivery",
  "UX",
];
