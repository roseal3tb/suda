import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type CSSProperties, type FormEvent } from "react";
import {
  Pencil,
  Plus,
  Check,
  ArrowLeft,
  Copy,
  ExternalLink,
  Globe,
  Lock,
  Sparkles,
  Award,
  Images,
} from "lucide-react";
import { Reveal } from "@/components/suda/reveal";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  FormField,
  MemberGate,
  Modal,
  PageIntro,
  TagInput,
  splitTags,
} from "@/components/suda/shared";
import { pageHead, profileCompleteness } from "@/features/suda/mock-data";
import { useDemo } from "@/features/suda/demo-context";

export const Route = createFileRoute("/profile")({
  head: () =>
    pageHead(
      "الملف المهني",
      "مهاراتك واهتماماتك وتجاربك في تصميم الأزياء، في ملف مهني يشبهك",
    ),
  component: () => (
    <MemberGate>
      <ProfilePage />
    </MemberGate>
  ),
});

const skillSuggestions = [
  "رسم الأزياء",
  "الباترون",
  "الخياطة",
  "التطريز",
  "التشكيل على المانيكان",
  "اختيار الأقمشة",
  "Adobe Illustrator",
  "CLO 3D",
  "التصميم الرقمي",
  "لوحات الإلهام",
];
const interestSuggestions = [
  "الأزياء التراثية",
  "الأزياء المستدامة",
  "فساتين السهرة",
  "العبايات",
  "الأزياء الجاهزة",
  "الإكسسوارات",
  "تصميم الأقمشة",
];

interface FieldErrors {
  name?: string;
  skills?: string;
  interests?: string;
}

function ProfilePage() {
  const {
    profile,
    profileLoading,
    saveProfile,
    session,
    works,
    enrollments,
    published,
    publishLoading,
    setPublished,
  } = useDemo();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: [] as string[],
    skillDraft: "",
    interests: [] as string[],
    interestDraft: "",
    experience: "",
  });
  const completeness = profileCompleteness(profile, works.length);
  const achievements = enrollments.flatMap((e) => e.achievements);
  const shareUrl =
    session && typeof window !== "undefined"
      ? `${window.location.origin}/u/${session.uid}`
      : "";

  function start() {
    setForm({
      name: profile?.name || session?.name || "",
      bio: profile?.bio || "",
      skills: profile?.skills ?? [],
      skillDraft: "",
      interests: profile?.interests ?? [],
      interestDraft: "",
      experience: profile?.experience || "",
    });
    setError("");
    setFieldErrors({});
    setSaved(false);
    setEditing(true);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const merge = (tags: string[], draft: string) =>
      Array.from(new Set([...tags, ...splitTags(draft)]));
    const skills = merge(form.skills, form.skillDraft);
    const interests = merge(form.interests, form.interestDraft);
    const errors: FieldErrors = {};
    if (form.name.trim().length < 2)
      errors.name = "اكتبي اسمك (حرفان على الأقل)";
    if (!skills.length)
      errors.skills = "أضيفي مهارة واحدة على الأقل، أو اختاري من الاقتراحات";
    if (!interests.length) errors.interests = "أضيفي اهتمامًا واحدًا على الأقل";
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError("أكملي الحقول المحدّدة باللون الأحمر ثم احفظي");
      return;
    }
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const ok = await saveProfile({
        name: form.name.trim(),
        bio: form.bio.trim(),
        skills,
        interests,
        experience: form.experience.trim(),
      });
      if (!ok) {
        setError(
          "تعذّر حفظ الملف المهني، تحققي من اتصال الإنترنت وحاولي مجددًا",
        );
        return;
      }
      setEditing(false);
      setSaved(true);
    } catch (error) {
      console.error("Profile save failed:", error);
      setError("حدث خطأ أثناء حفظ الملف المهني، حاولي مجددًا");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublic() {
    if (sharing) return;
    setSharing(true);
    try {
      await setPublished(!published);
    } finally {
      setSharing(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="content-wrap">
      <PageIntro
        eyebrow="الملف المهني"
        title="ملفك المهني"
        description="مهاراتك واهتماماتك وخبراتك وأعمالك في صفحة واحدة يمكنك مشاركتها"
        action={
          profile ? (
            <Button onClick={start}>
              <Pencil />
              تعديل الملف
            </Button>
          ) : undefined
        }
      />
      {saved && (
        <p className="success-message" role="status">
          <Check size={16} />
          تم حفظ ملفك المهني بنجاح
          {works.length === 0 && (
            <Link className="text-link" to="/portfolio">
              الخطوة التالية: أضيفي أول عمل <ArrowLeft size={14} />
            </Link>
          )}
        </p>
      )}
      {profileLoading ? (
        <div className="profile-skeleton" role="status">
          <span className="sr-only">جارٍ تحميل الملف المهني…</span>
          <span className="shimmer profile-skeleton-avatar" />
          <span className="shimmer loading-line" />
          <span className="shimmer loading-line is-short" />
        </div>
      ) : profile ? (
        <>
          <Reveal as="section" className="completeness-card">
            <div className="completeness-head">
              <div
                className="completeness-ring"
                style={{ "--value": completeness.percent } as CSSProperties}
                role="img"
                aria-label={`اكتمال الملف ${completeness.percent}٪`}
              >
                <span>{completeness.percent.toLocaleString("ar-SA")}٪</span>
              </div>
              <div>
                <span className="eyebrow">اكتمال الملف</span>
                <h2>
                  {completeness.percent === 100
                    ? "ملفك مكتمل وجاهز للمشاركة"
                    : "خطوات قليلة ويكتمل ملفك"}
                </h2>
              </div>
            </div>
            {completeness.missing.length > 0 && (
              <ul className="completeness-steps">
                {completeness.missing.map((step) => (
                  <li key={step.key}>
                    {step.key === "work" ? (
                      <Link to="/portfolio">
                        <Plus size={14} /> {step.label}
                      </Link>
                    ) : (
                      <button type="button" onClick={start}>
                        <Plus size={14} /> {step.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
          <div className="profile-layout">
            <Reveal className="profile-person">
              <div className="profile-avatar">{profile.name.charAt(0)}</div>
              <span className="eyebrow">مصممة أزياء</span>
              <h2>{profile.name}</h2>
              <p>{profile.bio || "لم تُضَف نبذة بعد"}</p>
              <div className="share-card">
                <div className="share-card-head">
                  {published ? <Globe size={16} /> : <Lock size={16} />}
                  <strong>
                    {published ? "ملفك منشور برابط عام" : "ملفك خاص بك"}
                  </strong>
                </div>
                <p>
                  {published
                    ? "أي شخص لديه الرابط يرى ملفك وأعمالك وإنجازاتك، بريدك لا يظهر"
                    : "انشري ملفك لتحصلي على رابط تضعينه في سيرتك أو مع تقديمك على الفرص"}
                </p>
                <Button
                  variant={published ? "outline" : "default"}
                  disabled={sharing || publishLoading}
                  onClick={() => void togglePublic()}
                >
                  {published ? <Lock /> : <Globe />}
                  {sharing
                    ? "جارٍ التحديث…"
                    : published
                      ? "إيقاف المشاركة"
                      : "نشر ملفي برابط"}
                </Button>
                {published && shareUrl && (
                  <div className="share-link-row">
                    <code dir="ltr">
                      {shareUrl.replace(/^https?:\/\//, "")}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="نسخ رابط الملف"
                      onClick={() => void copyLink()}
                    >
                      {copied ? <Check /> : <Copy />}
                    </Button>
                    <Button
                      asChild
                      size="icon"
                      variant="ghost"
                      aria-label="فتح الملف العام"
                    >
                      <a href={shareUrl} target="_blank" rel="noopener">
                        <ExternalLink />
                      </a>
                    </Button>
                  </div>
                )}
                {copied && (
                  <small role="status" className="success-message">
                    نُسخ الرابط
                  </small>
                )}
              </div>
            </Reveal>
            <div>
              <Reveal as="section" className="profile-section" delay={0.15}>
                <h2>المهارات</h2>
                <div className="chips">
                  {profile.skills.map((skill, i) => (
                    <span className="chip" key={i}>
                      {skill}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal as="section" className="profile-section" delay={0.25}>
                <h2>الاهتمامات</h2>
                <div className="chips">
                  {profile.interests.map((interest, i) => (
                    <span className="chip" key={i}>
                      {interest}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal as="section" className="profile-section" delay={0.35}>
                <h2>الخبرات</h2>
                <p>{profile.experience || "لم تُضَف خبرات بعد"}</p>
              </Reveal>
              <Reveal as="section" className="profile-section" delay={0.4}>
                <div className="profile-section-head">
                  <h2>
                    <Images size={20} aria-hidden="true" /> من معرضي
                  </h2>
                  <Link className="text-link" to="/portfolio">
                    {works.length ? "كل الأعمال" : "أضيفي عملًا"}
                    <ArrowLeft size={14} />
                  </Link>
                </div>
                {works.length ? (
                  <div className="profile-works">
                    {works.slice(0, 3).map((work) => (
                      <figure key={work.id}>
                        {work.image ? (
                          <img
                            src={work.image}
                            alt={work.title}
                            loading="lazy"
                          />
                        ) : (
                          <span className="profile-work-empty">
                            <Sparkles size={20} />
                          </span>
                        )}
                        <figcaption>{work.title}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <p>معرضك فارغ بعد، أول عمل يجعل ملفك يحكي قصتك</p>
                )}
              </Reveal>
              {achievements.length > 0 && (
                <Reveal as="section" className="profile-section" delay={0.45}>
                  <h2>
                    <Award size={20} aria-hidden="true" /> إنجازاتي
                  </h2>
                  <div className="achievement-list">
                    {achievements.map((text, i) => (
                      <span key={i}>
                        <Check size={14} />
                        {text}
                      </span>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          title="ملفك المهني"
          description="ابدئي باسمك، أضيفي مهاراتك واهتماماتك، وأكملي نبذتك المهنية، يستغرق ذلك دقيقتين"
          action={
            <Button variant="outline" onClick={start}>
              <Plus />
              إنشاء ملفي المهني
            </Button>
          }
        />
      )}
      <Modal
        open={editing}
        onClose={() => {
          if (!saving) setEditing(false);
        }}
        title={profile ? "تعديل الملف المهني" : "إنشاء الملف المهني"}
        description="الحقول المعلّمة بـ * مطلوبة، اكتبي المهارة واضغطي Enter أو فاصلة، أو اختاري من الاقتراحات"
      >
        <form
          className="form-stack"
          onSubmit={submit}
          noValidate
          aria-busy={saving}
        >
          <FormField label="الاسم *">
            <input
              value={form.name}
              maxLength={100}
              aria-invalid={Boolean(fieldErrors.name)}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {fieldErrors.name && (
              <span className="field-error">{fieldErrors.name}</span>
            )}
          </FormField>
          <FormField label="نبذة عني" hint={`${form.bio.length}/400`}>
            <textarea
              value={form.bio}
              maxLength={400}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="عن شغفك وأسلوبك في التصميم"
            />
          </FormField>
          <TagInput
            label="المهارات *"
            hint="اكتبي المهارة ثم Enter أو فاصلة"
            tags={form.skills}
            draft={form.skillDraft}
            onTagsChange={(skills) => setForm((f) => ({ ...f, skills }))}
            onDraftChange={(skillDraft) =>
              setForm((f) => ({ ...f, skillDraft }))
            }
            suggestions={skillSuggestions}
            placeholder="رسم الأزياء، الباترون، الخياطة"
            {...(fieldErrors.skills ? { error: fieldErrors.skills } : {})}
          />
          <TagInput
            label="الاهتمامات *"
            hint="اكتبي الاهتمام ثم Enter أو فاصلة"
            tags={form.interests}
            draft={form.interestDraft}
            onTagsChange={(interests) => setForm((f) => ({ ...f, interests }))}
            onDraftChange={(interestDraft) =>
              setForm((f) => ({ ...f, interestDraft }))
            }
            suggestions={interestSuggestions}
            placeholder="الأزياء التراثية، الأقمشة، التشكيل"
            {...(fieldErrors.interests ? { error: fieldErrors.interests } : {})}
          />
          <FormField label="الخبرات">
            <textarea
              value={form.experience}
              maxLength={2000}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              placeholder="مشروعاتك الدراسية أو تجاربك السابقة"
            />
          </FormField>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <Button type="submit" disabled={saving}>
              {saving ? "جارٍ الحفظ…" : "حفظ الملف"} <Check />
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => setEditing(false)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
