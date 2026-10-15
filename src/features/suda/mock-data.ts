import { filmAssets } from "./film-assets";

/** User-supplied editorial media. These images illustrate fictional opportunities;
 * they are never represented as work owned by a demo user or a named designer. */
const media = (file: string) => `/editorial/images/${file}.webp`;
export const images = {
  atelier: media("career_studio_sewing"),
  draping: media("internship_draping"),
  sketches: media("course_pattern_making"),
  studio: media("internship_beadwork"),
};
/** Distinct user-supplied photo selections for each homepage/auth location.
 * Collective inspiration imagery is not assigned to individual designers. */
export const fashionMedia = {
  login: {
    src: media("editorial_teal_gown"),
    alt: "مودل بفستان تركوازي طويل بين أعمدة فاتحة",
  },
  register: {
    src: media("editorial_couture_duo"),
    alt: "مودلز بفساتين سهرة مطرزة بألوان هادئة",
  },
  profile: [
    {
      src: media("profile_red_carpet_gold"),
      alt: "إطلالة بفستان ذهبي طويل على السجادة الحمراء",
    },
    {
      src: media("profile_red_carpet_black"),
      alt: "إطلالة بفستان أسود طويل في حفل جوائز",
    },
    {
      src: media("editorial_burgundy_look"),
      alt: "إطلالة بفستان خمري على درج أحمر",
    },
  ],
  inspiration: [
    {
      src: media("editorial_pastel_gown"),
      alt: "فستان راقٍ بألوان باستيلية وسط خلفية ملونة",
    },
    {
      src: media("inspiration_yellow_model"),
      alt: "مودل بفستان أصفر بتفاصيل بارزة",
    },
    {
      src: media("editorial_group_gowns"),
      alt: "مجموعة إطلالات متنوعة من فساتين السهرة",
    },
    {
      src: media("inspiration_lilac_model"),
      alt: "مودل بفستان ليلكي بتفاصيل مطرزة",
    },
    {
      src: media("editorial_black_couture"),
      alt: "تفاصيل فستان أسود بقصة أنيقة وتطريز لامع",
    },
    {
      src: media("inspiration_mauve_model"),
      alt: "فستان سهرة وردي فاتح بتنورة انسيابية",
    },
    {
      src: media("inspiration_monochrome_model"),
      alt: "إطلالة بفستان أسود في صورة بالأبيض والأسود",
    },
  ],
};
export const editorialMedia = {
  poster: media("hero_atelier_poster"),
  montageWebm: filmAssets.webm,
  montageMp4: filmAssets.mp4,
  sewing: "/editorial/motion/loop_sewing.mp4",
  draping: "/editorial/motion/loop_draping.mp4",
  beading: "/editorial/motion/loop_beading.mp4",
};
export const categoryMedia = {
  الدورات: media("course_pattern_making"),
  المسابقات: media("competition_embroidered_couture"),
  التدريب: media("internship_draping"),
  "الفرص الوظيفية": media("career_studio_sewing"),
};
export const opportunityImageAlt = {
  الدورات: "تفاصيل حرفية لتعلّم تقنيات تصميم الأزياء",
  المسابقات: "تفاصيل تصميم وتطريز لقطعة أزياء توضيحية",
  التدريب: "عمل يدوي على القماش داخل مشغل أزياء",
  "الفرص الوظيفية": "تقنيات تنفيذ وتطوير الملابس في مشغل أزياء",
};
export const categories = [
  "الدورات",
  "المسابقات",
  "التدريب",
  "الفرص الوظيفية",
] as const;
export type Category = (typeof categories)[number];
export interface Opportunity {
  id: string;
  title: string;
  type: Category;
  organization: string;
  location: string;
  mode: "عن بُعد" | "حضوري";
  level: "مبتدئ" | "متوسط" | "جميع المستويات";
  description: string;
  requirements: string;
  deadline: string;
  image: string;
  externalUrl?: string;
  zoomUrl?: string;
}
export const initialOpportunities: Opportunity[] = [
  {
    id: "pattern",
    title: "من الفكرة إلى الباترون",
    type: "الدورات",
    organization: "أكاديمية الخيط — جهة خيالية",
    location: "عن بُعد",
    mode: "عن بُعد",
    level: "مبتدئ",
    description:
      "رحلة في أساسيات رسم الباترون؛ من قراءة القياسات إلى بناء نموذجك الأول، مع تطبيقات في تصميم الأزياء المعاصرة.",
    requirements:
      "اهتمام بتصميم الأزياء، أدوات رسم أساسية ودفتر للتطبيقات. لا تُشترط خبرة سابقة.",
    deadline: "2026-12-20",
    image: media("course_pattern_making"),
  },
  {
    id: "heritage",
    title: "أزياء تنسج حكايتنا",
    type: "المسابقات",
    organization: "استوديو أثر — جهة خيالية",
    location: "الرياض",
    mode: "حضوري",
    level: "جميع المستويات",
    description:
      "تحدٍّ تصميمي تجريبي يستلهم التفاصيل التراثية السعودية ويعيد تقديمها في قطعة معاصرة.",
    requirements:
      "تصوّر أصلي لقطعة أزياء، لوحة إلهام وثلاثة رسومات توضح الفكرة.",
    deadline: "2026-12-28",
    image: media("competition_embroidered_couture"),
  },
  {
    id: "atelier",
    title: "تجربة في قلب الأتيليه",
    type: "التدريب",
    organization: "أتيليه نسيج — جهة خيالية",
    location: "جدة",
    mode: "حضوري",
    level: "مبتدئ",
    description:
      "فرصة تدريب تجريبية للتعرّف على مراحل تطوير مجموعة أزياء، من اختيار الأقمشة إلى تنفيذ العينات.",
    requirements:
      "طالبة تصميم أزياء أو خريجة حديثة، معرفة أولية بالخياطة وملف أعمال مختصر.",
    deadline: "2027-01-10",
    image: media("internship_beadwork"),
  },
  {
    id: "designer",
    title: "مصممة أزياء مبتدئة",
    type: "الفرص الوظيفية",
    organization: "دار طيّة — جهة خيالية",
    location: "الرياض",
    mode: "حضوري",
    level: "متوسط",
    description:
      "فرصة وظيفية تجريبية للمشاركة في تطوير التصاميم والرسومات الفنية لمجموعة أزياء معاصرة.",
    requirements:
      "معرفة برسم الأزياء والباترون، مهارات اختيار الأقمشة، وملف أعمال يعكس أسلوبك.",
    deadline: "2027-01-15",
    image: media("career_studio_sewing"),
  },
  {
    id: "draping",
    title: "فن التشكيل على المانيكان",
    type: "الدورات",
    organization: "أكاديمية الخيط — جهة خيالية",
    location: "عن بُعد",
    mode: "عن بُعد",
    level: "متوسط",
    description:
      "اكتشفي لغة القماش من خلال تقنيات التشكيل اليدوي وصناعة الطيّات وبناء الأحجام على المانيكان.",
    requirements:
      "معرفة بأساسيات الخياطة، قماش للتطبيق ومانيكان أو نموذج مصغّر.",
    deadline: "",
    image: media("internship_draping"),
  },
  {
    id: "textile",
    title: "حوار مع النسيج",
    type: "المسابقات",
    organization: "مرسم لون — جهة خيالية",
    location: "عن بُعد",
    mode: "عن بُعد",
    level: "جميع المستويات",
    description:
      "مسابقة تجريبية لتصميم قطعة تستكشف التباين بين الخامات وتوظّف الملمس كعنصر تعبيري.",
    requirements:
      "رسم تصميم أصلي، صور الخامات المقترحة ووصف مختصر لفكرة العمل.",
    deadline: "2027-01-25",
    image: media("competition_pink_couture"),
  },
  {
    id: "studio",
    title: "تدريب في تطوير المجموعات",
    type: "التدريب",
    organization: "استوديو طراز — جهة خيالية",
    location: "الدمام",
    mode: "حضوري",
    level: "متوسط",
    description:
      "تجربة تدريبية تجريبية في إعداد لوحات الإلهام وتوثيق الرسومات الفنية وتنسيق عينات الأقمشة.",
    requirements:
      "معرفة بالرسم الفني، اهتمام بالبحث البصري وتنظيم ملفات التصميم.",
    deadline: "2027-02-01",
    image: media("internship_pink_embroidery"),
  },
  {
    id: "pattern-career",
    title: "متخصصة باترون",
    type: "الفرص الوظيفية",
    organization: "دار طيّة — جهة خيالية",
    location: "جدة",
    mode: "حضوري",
    level: "متوسط",
    description:
      "فرصة تجريبية للعمل على تحويل الرسومات إلى باترونات ومراجعة ملاءمة العينات.",
    requirements: "خبرة في إعداد الباترون وقراءة القياسات وتعديل العينات.",
    deadline: "",
    image: media("career_pattern_cutting"),
  },
];
export interface Profile {
  name: string;
  bio: string;
  skills: string[];
  interests: string[];
  experience: string;
}
export interface Work {
  id: string;
  title: string;
  description: string;
  image: string;
}
export interface Enrollment {
  courseId: string;
  progress: number;
  achievements: string[];
}
export interface Filters {
  query: string;
  type: string;
  mode: string;
  level: string;
  location: string;
}
export const emptyFilters: Filters = {
  query: "",
  type: "",
  mode: "",
  level: "",
  location: "",
};
export const normalizeArabic = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ـ/g, "")
    .toLowerCase();
export function filterOpportunities(items: Opportunity[], filters: Filters) {
  const words = normalizeArabic(filters.query.trim())
    .split(/\s+/)
    .filter(Boolean);
  return items.filter(
    (item) =>
      words.every((word) =>
        normalizeArabic(
          `${item.title} ${item.description} ${item.organization} ${item.type} ${item.requirements}`,
        ).includes(word),
      ) &&
      (!filters.type || item.type === filters.type) &&
      (!filters.mode || item.mode === filters.mode) &&
      (!filters.level || item.level === filters.level) &&
      (!filters.location || item.location === filters.location),
  );
}
export function validateOpportunity(
  item: Pick<
    Opportunity,
    "title" | "organization" | "description" | "requirements"
  >,
) {
  return Boolean(
    item.title.trim() &&
    item.organization.trim() &&
    item.description.trim() &&
    item.requirements.trim(),
  );
}
export function enrollCourse(
  enrollments: Enrollment[],
  item: Opportunity,
): Enrollment[] {
  if (
    item.type !== "الدورات" ||
    enrollments.some((e) => e.courseId === item.id)
  )
    return enrollments;
  return [...enrollments, { courseId: item.id, progress: 0, achievements: [] }];
}
export const canAccessZoom = (enrollments: Enrollment[], id: string) =>
  enrollments.some((e) => e.courseId === id);
/** Only explicit HTTPS Zoom meeting URLs are offered to enrolled learners. */
export const isValidZoomUrl = (value: string) => {
  try {
    const u = new URL(value);
    return (
      u.protocol === "https:" &&
      (u.hostname === "zoom.us" || u.hostname.endsWith(".zoom.us")) &&
      /^\/(j|my|wc|s)\//.test(u.pathname)
    );
  } catch {
    return false;
  }
};
export const isValidExternalUrl = (value: string) => {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && Boolean(u.hostname.includes("."));
  } catch {
    return false;
  }
};
export const clampProgress = (value: number) =>
  Math.min(100, Math.max(0, Math.round(value)));
export const formatDate = (date: string) =>
  date
    ? new Intl.DateTimeFormat("ar-SA", {
        day: "numeric",
        month: "long",
        year: "numeric",
        calendar: "gregory",
      }).format(new Date(`${date}T12:00:00`))
    : "غير محدد";
export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | سُدى` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | سُدى` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
