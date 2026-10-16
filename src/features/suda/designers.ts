/** Editorial directory with photographs supplied by the project team; publishing rights must be checked before public use. */
export interface Designer {
  id: string;
  name: string;
  brand: string;
  focus: string;
  bio: string;
  tags: string[];
  source?: string;
  sourceLabel?: string;
  verified?: boolean;
  image?: string;
}
export const designers: Designer[] = [
  {
    id: "waad-aloqaili",
    name: "وعد العقيلي",
    brand: "Waad Aloqaili Couture",
    focus: "الأزياء الراقية والتصميم الحرفي",
    bio: "مصممة سعودية والمديرة الإبداعية لدار وعد العقيلي، التي تأسست عام 2019 بالشراكة مع أختها أحلام العقيلي. تقدم الدار مجموعات أزياء راقية تستلهم الهوية السعودية وتعتني بالتفاصيل الحرفية",
    tags: ["الأزياء الراقية", "الحرفية", "الهوية السعودية"],
    source: "https://waadaloqaili.com/ar/pages/من-نحن",
    sourceLabel: "الموقع الرسمي لدار وعد العقيلي",
  },
  {
    id: "iman-alajlan",
    name: "إيمان العجلان",
    brand: "Eman AlAjlan",
    focus: "أزياء السهرة والتصميم الفاخر",
    bio: "مصممة سعودية أسست دار إيمان العجلان في الرياض عام 2003. تقدم الدار فساتين المناسبات والأزياء الفاخرة، مع اهتمام بالخياطة والتفاصيل الدقيقة والحرفية",
    tags: ["فساتين السهرة", "الأزياء الفاخرة", "التفصيل"],
    source: "https://emanalajlan.co/ar/about-us/",
    sourceLabel: "الموقع الرسمي لدار إيمان العجلان",
  },
  {
    id: "rahaf-aziz",
    name: "رهف عزيز",
    brand: "Rahaf Aziz",
    focus: "الأزياء النسائية المعاصرة",
    bio: "مصممة أزياء سعودية درست تصميم الأزياء في جامعة الأميرة نورة بنت عبدالرحمن. أسست علامتها رهف عزيز في الرياض عام 2022، وتقدم قطعًا نسائية تعكس اهتمامها بالتفاصيل والأناقة المعاصرة",
    tags: ["الأزياء النسائية", "التصميم المعاصر", "تفاصيل الأقمشة"],
    source: "https://rahafaziz.com/ar/من-نحن/page-221868011",
    sourceLabel: "الموقع الرسمي لعلامة رهف عزيز",
  },
  {
    id: "arwa",
    image: "/editorial/people/designer_arwa.webp",
    name: "أروى البنّاوي",
    brand: "ARWÁ",
    focus: "أزياء جاهزة وتفصيل معاصر",
    bio: "مصممة سعودية أسست علامتها عام 2015. تمزج تصاميمها بين الخياطة المعاصرة والسرد البصري والإشارات إلى التراث السعودي",
    tags: ["الخياطة المعاصرة", "الأزياء الجاهزة", "الهوية السعودية"],
    source: "https://www.arwathebrand.com/pages/fashion-shows",
    sourceLabel: "الموقع الرسمي للعلامة",
  },
  {
    id: "honayda",
    image: "/editorial/people/designer_honayda.webp",
    name: "هنيدة صيرفي",
    brand: "HONAYDA",
    focus: "أزياء نسائية فاخرة",
    bio: "مؤسسة علامة HONAYDA السعودية التي انطلقت عام 2016. تستلهم مجموعاتها قصص نساء مؤثرات وتجمع بين التعبير الفني والحرفية",
    tags: ["الأزياء الفاخرة", "الحرفية", "السرد عبر المجموعات"],
    source: "https://www.honayda.com/the-brand/",
    sourceLabel: "الموقع الرسمي للعلامة",
  },
  {
    id: "tima",
    image: "/editorial/people/designer_tima.webp",
    name: "تيما عابد",
    brand: "Tima Abid",
    focus: "الأزياء الراقية وفساتين السهرة",
    bio: "مصممة سعودية تعمل في مجال الأزياء الراقية، وتشتهر بتفاصيل فساتين السهرة والتطريز والزخارف الدقيقة",
    tags: ["الأزياء الراقية", "فساتين السهرة", "التطريز"],
    source: "https://www.voguearabia.com/article/saudi-national-day-designers",
    sourceLabel: "Vogue Arabia — 2026",
  },
  {
    id: "reem",
    image: "/editorial/people/designer_reem.webp",
    name: "ريم الكنهل",
    brand: "Reem Al Kanhal",
    focus: "الأزياء الجاهزة",
    bio: "مصممة سعودية أسست علامتها عام 2010. تعتمد أعمالها على الأشكال الواضحة والخطوط النظيفة والتشكيل الحر للأقمشة",
    tags: ["الأزياء الجاهزة", "التشكيل", "القصّات المعاصرة"],
    source: "https://reemalkanhal.com/pages/about",
    sourceLabel: "الموقع الرسمي للعلامة",
  },
  {
    id: "nora",
    image: "/editorial/people/designer_nora.webp",
    name: "نورا آل الشيخ",
    brand: "Nora Al Shaikh",
    focus: "الأزياء الجاهزة",
    bio: "مصممة سعودية معروفة بتقديم القفطان ضمن تصاميم معاصرة تستكشف القصّات والخامات وتعيد قراءة عناصر اللباس المحلي",
    tags: ["القفطان", "الأزياء الجاهزة", "الخامات المعاصرة"],
    source:
      "https://www.voguearabia.com/article/homegrown-and-hopeful-saudi-fashion-brands",
    sourceLabel: "Vogue Arabia — 2026",
  },
  {
    id: "noura",
    image: "/editorial/people/designer_noura.webp",
    name: "نورة سليمان",
    brand: "Noura Sulaiman",
    focus: "أزياء نسائية معاصرة",
    bio: "مصممة سعودية تقدم مجموعات نسائية معاصرة تتنوع بين الملابس اليومية والقطع البارزة، وتستلهم بعض أعمالها موضوعات رياضية",
    tags: ["الأزياء المعاصرة", "الملابس اليومية", "تصميم المجموعات"],
    source:
      "https://www.voguearabia.com/article/homegrown-and-hopeful-saudi-fashion-brands",
    sourceLabel: "Vogue Arabia — 2026",
  },
  {
    id: "kawthar",
    image: "/editorial/people/designer_kawthar.webp",
    name: "كوثر الحريش",
    brand: "Kaf by Kaf",
    focus: "أزياء معاصرة مستلهمة من التراث",
    bio: "مصممة ومؤسسة علامة Kaf by Kaf السعودية، التي تقدم ملابس بتكوينات وأنماط تستلهم الثقافة المحلية",
    tags: ["التراث السعودي", "القصّات البنيوية", "الأزياء المعاصرة"],
    source:
      "https://www.arabnews.com/fashion/a-guide-to-all-the-homegrown-brands-at-riyadh-fashion-week-2393981",
    sourceLabel: "Arab News — 2023",
  },
  {
    id: "hala",
    image: "/editorial/people/designer_hala.webp",
    name: "هلا الغرباوي",
    brand: "Hala Algharbawi",
    focus: "الأزياء الراقية",
    bio: "مصممة أزياء سعودية عرضت أعمالها ضمن فعاليات أسبوع الموضة في الرياض. تجمع رؤيتها التصميمية بين مؤثرات ثقافية شرقية وغربية",
    tags: ["الأزياء الراقية", "التصميم المعاصر", "التأثيرات الثقافية"],
    source:
      "https://www.arabnews.com/fashion/a-guide-to-all-the-homegrown-brands-at-riyadh-fashion-week-2393981",
    sourceLabel: "Arab News — 2023",
  },
];
