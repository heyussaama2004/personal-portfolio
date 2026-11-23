import type { Experience } from "./schemas";

export const experience: Experience[] = [
  {
    id: "education",
    order: 1,
    title: {
      en: "Technicien Spécialisé en Développement Digital (Bac+2)",
      fr: "Technicien Spécialisé en Développement Digital (Bac+2)",
      ar: "تقني متخصص في التطوير الرقمي (بكالوريوس+2)",
    },
    organization: {
      en: "Institut Al-Ahramate",
      fr: "Institut Al-Ahramate",
      ar: "معهد الأحرامات",
    },
    location: "Laâyoune",
    description: {
      en: "Two-year specialized digital development programme.",
      fr: "Formation spécialisée de deux ans en développement digital.",
      ar: "برنامج تخصصي لسنتين في التطوير الرقمي.",
    },
  },
  {
    id: "internship",
    order: 2,
    title: {
      en: "Internship",
      fr: "Stage",
      ar: "تدريب",
    },
    organization: {
      en: "Provincial Directorate of National Education",
      fr: "Direction Provinciale de l'Éducation Nationale",
      ar: "المديرية الإقليمية للتعليم الوطني",
    },
    location: "Laâyoune, Morocco",
  },
  {
    id: "personal-projects",
    order: 3,
    title: {
      en: "Personal development projects and practical technical experience",
      fr: "Projets de développement personnels et expérience technique pratique",
      ar: "مشاريع تطوير شخصية وخبرة تقنية عملية",
    },
    organization: {
      en: "Independent",
      fr: "À titre indépendant",
      ar: "بشكل مستقل",
    },
  },
];
