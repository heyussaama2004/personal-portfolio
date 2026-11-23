import type { SkillGroup } from "./schemas";

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    order: 1,
    title: {
      en: "Frontend",
      fr: "Frontend",
      ar: "الواجهات",
    },
    skills: [
      { name: "TypeScript", level: "core" },
      { name: "Next.js App Router", level: "core" },
      { name: "Tailwind CSS", level: "core" },
      { name: "Framer Motion", level: "working" },
      { name: "Lucide Icons", level: "working" },
    ],
  },
  {
    id: "backend",
    order: 2,
    title: {
      en: "Backend",
      fr: "Backend",
      ar: "الخلفية",
    },
    skills: [{ name: "PHP", level: "working" }],
  },
  {
    id: "databases",
    order: 3,
    title: {
      en: "Databases",
      fr: "Bases de données",
      ar: "قواعد البيانات",
    },
    skills: [{ name: "MySQL", level: "working" }],
  },
  {
    id: "ai",
    order: 4,
    title: {
      en: "AI and automation",
      fr: "IA et automatisation",
      ar: "الذكاء الاصطناعي والأتمتة",
    },
    skills: [{ name: "Workflow automation", level: "learning" }],
  },
  {
    id: "tools",
    order: 5,
    title: {
      en: "Tools",
      fr: "Outils",
      ar: "الأدوات",
    },
    skills: [
      { name: "Git", level: "working" },
      { name: "Vercel", level: "working" },
    ],
  },
];
