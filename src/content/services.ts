import type { Service } from "./schemas";

export const services: Service[] = [
  {
    id: "website",
    order: 1,
    title: {
      en: "Website development",
      fr: "Développement de sites web",
      ar: "تطوير المواقع الإلكترونية",
    },
    description: {
      en: "Fast, accessible websites built around a clear message and a simple path to contact.",
      fr: "Des sites rapides et accessibles, centrés sur un message clair et un chemin de contact simple.",
      ar: "مواقع سريعة ويمكن الوصول إليها، تركز على رسالة واضحة ومسار تواصل بسيط.",
    },
  },
  {
    id: "business",
    order: 2,
    title: {
      en: "Business websites and landing pages",
      fr: "Sites vitrines et pages d'atterrissage",
      ar: "مواقع الشركات والصفحات الإعلانية",
    },
    description: {
      en: "Focused pages that present an offer clearly and support it with strong technical fundamentals.",
      fr: "Des pages ciblées qui présentent une offre clairement, soutenues par des bases techniques solides.",
      ar: "صفحات مركزة تعرض العرض بوضوح وتستند إلى أسس تقنية متينة.",
    },
  },
  {
    id: "webapp",
    order: 3,
    title: {
      en: "Web application development",
      fr: "Développement d'applications web",
      ar: "تطوير تطبيقات الويب",
    },
    description: {
      en: "Interactive applications with maintainable structure, typed data and thoughtful user flows.",
      fr: "Applications interactives avec une structure maintenable, des données typées et des parcours soignés.",
      ar: "تطبيقات تفاعلية بهيكل قابل للصيانة وبيانات محددة النوع وتدفقات مستخدم مدروسة.",
    },
  },
  {
    id: "backend",
    order: 4,
    title: {
      en: "Backend development",
      fr: "Développement backend",
      ar: "تطوير الخلفية",
    },
    description: {
      en: "Server-side logic, data modelling and APIs designed to stay understandable as a project grows.",
      fr: "Logique serveur, modélisation des données et API conçues pour rester compréhensibles à mesure qu'un projet grandit.",
      ar: "منطق الخادم ونمذجة البيانات وواجهات برمجة مصممة لتظل مفهومة مع نمو المشروع.",
    },
  },
  {
    id: "automation",
    order: 5,
    title: {
      en: "AI automation and workflow integration",
      fr: "Automatisation par IA et intégration de flux",
      ar: "أتمتة الذكاء الاصطناعي وربط سير العمل",
    },
    description: {
      en: "Practical automation that connects existing tools and reduces repetitive manual work.",
      fr: "Une automatisation pratique qui relie les outils existants et réduit les tâches manuelles répétitives.",
      ar: "أتمتة عملية تربط الأدوات الحالية وتقلل الأعمال اليدوية المتكررة.",
    },
  },
  {
    id: "api",
    order: 6,
    title: {
      en: "API integrations",
      fr: "Intégrations d'API",
      ar: "ربط واجهات البرمجة",
    },
    description: {
      en: "Connecting third-party services with clean contracts, validation and clear failure states.",
      fr: "Connexion de services tiers avec des contrats clairs, une validation et des états d'erreur explicites.",
      ar: "ربط الخدمات الخارجية بعقود واضحة وتحقق وحالات خطأ صريحة.",
    },
  },
];
