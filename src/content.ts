export interface Job {
  role: string;
  company: string;
  period: string;
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
  tagline: "Software Engineering Manager, Design Systems",
  location: "Manchester, United Kingdom",
  email: "me@mikebeach.co.uk",
  links: {
    github: "https://github.com/bakimchee",
    linkedin: "https://www.linkedin.com/in/mike-beach/",
    website: "https://mikebeach.co.uk",
  },
};

export const about: string[] = [
  "Frontend engineer turned engineering manager, currently leading the Fable Design System at Sainsbury's — a component library used across the Sainsbury's and Argos websites.",
  "I care about accessible, consistent UI at scale: reusable components, design tokens, and the documentation and workflows that get a design system actually adopted. Along the way I've worked across JavaScript, TypeScript, CSS, and Node.js, and I still like building things end to end — this CV being a case in point.",
];

export const experience: Job[] = [
  {
    role: "Software Engineering Manager",
    company: "Sainsbury's Digital, Tech and Data",
    period: "March 2024 – Present",
    highlights: [
      "Lead development of the Fable Design System — a scalable, accessible, high-performance UI component library used across the Sainsbury's and Argos websites",
      "Work with design, engineering and product teams to drive consistency and best practices across user journeys",
      "Build reusable components and design tokens for brand consistency",
      "Own accessibility (a11y) compliance and advocate for inclusive design",
      "Define technical guidelines and streamline adoption workflows; drive documentation and developer education",
    ],
  },
  {
    role: "Senior Software Engineer (Senior Design Systems Engineer)",
    company: "Sainsbury's Digital, Tech and Data",
    period: "July 2021 – March 2024",
    highlights: ["Worked closely with Accessibility, Copy, Design and Front End Engineering specialists on the design system"],
  },
  {
    role: "UI Engineer",
    company: "Sainsbury's",
    period: "March 2019 – July 2021",
    highlights: [],
  },
  {
    role: "Front End Developer",
    company: "Moriyama",
    period: "March 2014 – March 2019",
    highlights: [],
  },
  {
    role: "Early career — Web Design & Development",
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
      "You're looking at it. A public, unauthenticated SSH server that renders this CV as an interactive TUI — no website, just `ssh mikebeach.co.uk`.",
    url: "https://github.com/bakimchee/mikebeach-ssh-cv",
    tech: ["Node.js", "TypeScript", "ssh2", "blessed", "Fly.io"],
  },
];

export const skills: string[] = [
  "Design Systems",
  "Technical Leadership",
  "JavaScript / TypeScript",
  "CSS & HTML",
  "Accessibility (a11y)",
  "Team Management",
  "Agile Delivery",
  "UX",
];
