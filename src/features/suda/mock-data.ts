const u=(id:string,w=1400)=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
const atelier=u('1753162659724-004dd26e1de3'); const draping=u('1753162657191-c8002d067f1d'); const sketches=u('1775471234117-adff84750dd0'); const studio=u('1680835099030-9c7532f744f1');
export const images = { atelier, draping, sketches, studio };
/** Image inventory: licensed general stock photos, never attributed to specific designers. */
export const imageCredits = [
 { key:'atelier', author:'Vitaly Gariev', source:'https://unsplash.com/photos/a-seamstress-is-sewing-at-her-work-station-eFAvYBCfmJY', license:'Unsplash License' },
 { key:'draping', author:'Vitaly Gariev', source:'https://unsplash.com/photos/fashion-designers-work-together-on-a-project-Qw59dUeQnNI', license:'Unsplash License' },
 { key:'sketches', author:'Ambati Cherubim', source:'https://unsplash.com/photos/women-embroidering-intricate-patterns-on-fabric-f5RmDMCPBzg', license:'Unsplash License' },
 { key:'studio', author:'Arawark chen', source:'https://unsplash.com/photos/a-room-filled-with-mannequins-and-sewing-machines-HIrP05jnXNs', license:'Unsplash License' },
];
export const categories = ['الدورات', 'المسابقات', 'التدريب', 'الفرص الوظيفية'] as const;
export type Category = typeof categories[number];
export interface Opportunity {
  id: string; title: string; type: Category; organization: string; location: string;
  mode: 'عن بُعد' | 'حضوري'; level: 'مبتدئ' | 'متوسط' | 'جميع المستويات';
  description: string; requirements: string; deadline: string; image: string; externalUrl?: string; zoomUrl?: string;
}
export const initialOpportunities: Opportunity[] = [
 { id:'pattern', title:'من الفكرة إلى الباترون', type:'الدورات', organization:'أكاديمية الخيط — جهة خيالية', location:'عن بُعد', mode:'عن بُعد', level:'مبتدئ', description:'رحلة في أساسيات رسم الباترون؛ من قراءة القياسات إلى بناء نموذجك الأول، مع تطبيقات في تصميم الأزياء المعاصرة.', requirements:'اهتمام بتصميم الأزياء، أدوات رسم أساسية ودفتر للتطبيقات. لا تُشترط خبرة سابقة.', deadline:'2026-12-20', image:atelier },
 { id:'heritage', title:'أزياء تنسج حكايتنا', type:'المسابقات', organization:'استوديو أثر — جهة خيالية', location:'الرياض', mode:'حضوري', level:'جميع المستويات', description:'تحدٍّ تصميمي تجريبي يستلهم التفاصيل التراثية السعودية ويعيد تقديمها في قطعة معاصرة.', requirements:'تصوّر أصلي لقطعة أزياء، لوحة إلهام وثلاثة رسومات توضح الفكرة.', deadline:'2026-12-28', image:sketches },
 { id:'atelier', title:'تجربة في قلب الأتيليه', type:'التدريب', organization:'أتيليه نسيج — جهة خيالية', location:'جدة', mode:'حضوري', level:'مبتدئ', description:'فرصة تدريب تجريبية للتعرّف على مراحل تطوير مجموعة أزياء، من اختيار الأقمشة إلى تنفيذ العينات.', requirements:'طالبة تصميم أزياء أو خريجة حديثة، معرفة أولية بالخياطة وملف أعمال مختصر.', deadline:'2027-01-10', image:draping },
 { id:'designer', title:'مصممة أزياء مبتدئة', type:'الفرص الوظيفية', organization:'دار طيّة — جهة خيالية', location:'الرياض', mode:'حضوري', level:'متوسط', description:'فرصة وظيفية تجريبية للمشاركة في تطوير التصاميم والرسومات الفنية لمجموعة أزياء معاصرة.', requirements:'معرفة برسم الأزياء والباترون، مهارات اختيار الأقمشة، وملف أعمال يعكس أسلوبك.', deadline:'2027-01-15', image:sketches },
 { id:'draping', title:'فن التشكيل على المانيكان', type:'الدورات', organization:'أكاديمية الخيط — جهة خيالية', location:'عن بُعد', mode:'عن بُعد', level:'متوسط', description:'اكتشفي لغة القماش من خلال تقنيات التشكيل اليدوي وصناعة الطيّات وبناء الأحجام على المانيكان.', requirements:'معرفة بأساسيات الخياطة، قماش للتطبيق ومانيكان أو نموذج مصغّر.', deadline:'', image:draping },
 { id:'textile', title:'حوار مع النسيج', type:'المسابقات', organization:'مرسم لون — جهة خيالية', location:'عن بُعد', mode:'عن بُعد', level:'جميع المستويات', description:'مسابقة تجريبية لتصميم قطعة تستكشف التباين بين الخامات وتوظّف الملمس كعنصر تعبيري.', requirements:'رسم تصميم أصلي، صور الخامات المقترحة ووصف مختصر لفكرة العمل.', deadline:'2027-01-25', image:atelier },
 { id:'studio', title:'تدريب في تطوير المجموعات', type:'التدريب', organization:'استوديو طراز — جهة خيالية', location:'الدمام', mode:'حضوري', level:'متوسط', description:'تجربة تدريبية تجريبية في إعداد لوحات الإلهام وتوثيق الرسومات الفنية وتنسيق عينات الأقمشة.', requirements:'معرفة بالرسم الفني، اهتمام بالبحث البصري وتنظيم ملفات التصميم.', deadline:'2027-02-01', image:sketches },
 { id:'pattern-career', title:'متخصصة باترون', type:'الفرص الوظيفية', organization:'دار طيّة — جهة خيالية', location:'جدة', mode:'حضوري', level:'متوسط', description:'فرصة تجريبية للعمل على تحويل الرسومات إلى باترونات ومراجعة ملاءمة العينات.', requirements:'خبرة في إعداد الباترون وقراءة القياسات وتعديل العينات.', deadline:'', image:draping },
];
export interface Profile { name:string; bio:string; skills:string[]; interests:string[]; experience:string; }
export interface Work { id:string; title:string; description:string; image:string; }
export interface Enrollment { courseId:string; progress:number; achievements:string[]; }
export interface Filters { query:string; type:string; mode:string; level:string; location:string; }
export const emptyFilters: Filters = {query:'',type:'',mode:'',level:'',location:''};
export const normalizeArabic = (value:string) => value.normalize('NFKD').replace(/[\u064B-\u065F\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ـ/g,'').toLowerCase();
export function filterOpportunities(items:Opportunity[], filters:Filters) {
 const words=normalizeArabic(filters.query.trim()).split(/\s+/).filter(Boolean);
 return items.filter(item => words.every(word=>normalizeArabic(`${item.title} ${item.description} ${item.organization} ${item.type} ${item.requirements}`).includes(word)) && (!filters.type || item.type===filters.type) && (!filters.mode || item.mode===filters.mode) && (!filters.level || item.level===filters.level) && (!filters.location || item.location===filters.location));
}
export function validateOpportunity(item:Pick<Opportunity,'title'|'organization'|'description'|'requirements'>) {
 return Boolean(item.title.trim() && item.organization.trim() && item.description.trim() && item.requirements.trim());
}
export function enrollCourse(enrollments:Enrollment[], item:Opportunity):Enrollment[] {
 if(item.type!=='الدورات' || enrollments.some(e=>e.courseId===item.id)) return enrollments;
 return [...enrollments,{courseId:item.id,progress:0,achievements:[]}];
}
export const canAccessZoom = (enrollments:Enrollment[], id:string) => enrollments.some(e=>e.courseId===id);
/** Only explicit HTTPS Zoom meeting URLs are offered to enrolled learners. */
export const isValidZoomUrl = (value:string) => {
 try { const u=new URL(value); return u.protocol==='https:' && (u.hostname==='zoom.us'||u.hostname.endsWith('.zoom.us')) && /^\/(j|my|wc|s)\//.test(u.pathname); }
 catch { return false; }
};
export const isValidExternalUrl = (value:string) => {
 try { const u=new URL(value); return u.protocol==='https:' && Boolean(u.hostname.includes('.')); }
 catch { return false; }
};
export const clampProgress = (value:number) => Math.min(100,Math.max(0,Math.round(value)));
export const formatDate = (date:string) => date ? new Intl.DateTimeFormat('ar-SA',{day:'numeric',month:'long',year:'numeric',calendar:'gregory'}).format(new Date(`${date}T12:00:00`)) : 'غير محدد';
export function pageHead(title:string,description:string) { return {meta:[{title:`${title} | سُدى`},{name:'description',content:description},{property:'og:title',content:`${title} | سُدى`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}; }
