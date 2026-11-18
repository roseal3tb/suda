import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ArrowLeft, Award, Check, Sparkles, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { Reveal } from "@/components/suda/reveal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/suda/shared";
import {
  MAX_WORK_IMAGE_CHARS,
  pageHead,
  type PublicProfile,
  type Work,
} from "@/features/suda/mock-data";

export const Route = createFileRoute("/u/$uid")({
  head: () =>
    pageHead(
      "ملف مصممة",
      "ملف مهني ومعرض أعمال لمصممة أزياء على سُدى",
    ),
  component: PublicProfilePage,
});

function asPublicProfile(value: unknown): PublicProfile | null {
  if (!value || typeof value !== "object") return null;
  const p = value as Record<string, unknown>;
  const list = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  if (p["published"] !== true || typeof p["name"] !== "string") return null;
  return {
    name: p["name"],
    bio: typeof p["bio"] === "string" ? p["bio"] : "",
    experience: typeof p["experience"] === "string" ? p["experience"] : "",
    skills: list(p["skills"]),
    interests: list(p["interests"]),
    achievements: list(p["achievements"]),
    published: true,
  };
}

function asWork(value: unknown, id: string): Work | null {
  if (!value || typeof value !== "object") return null;
  const w = value as Record<string, unknown>;
  if (typeof w["title"] !== "string" || typeof w["description"] !== "string")
    return null;
  const image = w["image"];
  return {
    id,
    title: w["title"],
    description: w["description"],
    image:
      typeof image === "string" &&
      /^data:image\/(jpeg|webp);base64,/.test(image) &&
      image.length <= MAX_WORK_IMAGE_CHARS
        ? image
        : "",
  };
}

function PublicProfilePage() {
  const { uid } = Route.useParams();
  const [state, setState] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [view, setView] = useState<Work | null>(null);

  useEffect(() => {
    let active = true;
    setState("loading");
    void (async () => {
      try {
        if (!uid || uid.includes("/")) throw new Error("Invalid profile id");
        const snapshot = await getDoc(doc(db, "publicProfiles", uid));
        const value = asPublicProfile(snapshot.data());
        if (!active) return;
        if (!value) {
          setState("missing");
          return;
        }
        setProfile(value);
        try {
          const list = await getDocs(collection(db, "users", uid, "works"));
          if (!active) return;
          setWorks(
            list.docs
              .map((entry) => asWork(entry.data(), entry.id))
              .filter((w): w is Work => w !== null)
              .sort((a, b) => b.id.localeCompare(a.id)),
          );
        } catch (error) {
          console.error("Failed to load public works:", error);
        }
        if (active) setState("ready");
      } catch (error) {
        console.error("Failed to load public profile:", error);
        if (active) setState("missing");
      }
    })();
    return () => {
      active = false;
    };
  }, [uid]);

  if (state === "loading")
    return (
      <div className="content-wrap">
        <div className="profile-skeleton" role="status">
          <span className="sr-only">جارٍ تحميل الملف…</span>
          <span className="shimmer profile-skeleton-avatar" />
          <span className="shimmer loading-line" />
          <span className="shimmer loading-line is-short" />
        </div>
      </div>
    );

  if (state === "missing" || !profile)
    return (
      <div className="content-wrap">
        <EmptyState
          title="هذا الملف غير متاح"
          description="ربما أوقفت صاحبته المشاركة، أو أن الرابط غير صحيح"
          action={
            <Button asChild>
              <Link to="/">
                تعرّفي على سُدى <ArrowLeft />
              </Link>
            </Button>
          }
        />
      </div>
    );

  return (
    <div className="lookbook">
      <Reveal as="header" className="lookbook-hero">
        <span className="eyebrow">
          <span className="tiny-line" />
          ملف مصممة على سُدى
        </span>
        <h1>{profile.name}</h1>
        {profile.bio && <p className="lookbook-bio">{profile.bio}</p>}
        <div className="chips">
          {profile.skills.map((skill) => (
            <span className="chip" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </Reveal>

      {works.length > 0 && (
        <section className="lookbook-gallery" aria-label="معرض الأعمال">
          {works.map((work, i) => (
            <Reveal
              as="article"
              key={work.id}
              className={`lookbook-piece lookbook-piece-${i % 5}`}
              delay={(i % 3) * 0.12}
            >
              <button
                type="button"
                onClick={() => setView(work)}
                aria-label={`عرض ${work.title}`}
              >
                {work.image ? (
                  <img src={work.image} alt={work.title} loading="lazy" />
                ) : (
                  <span className="lookbook-piece-empty">
                    <Sparkles size={26} strokeWidth={1.2} />
                  </span>
                )}
              </button>
              <h2>{work.title}</h2>
              <p>{work.description}</p>
            </Reveal>
          ))}
        </section>
      )}

      <div className="lookbook-details">
        {profile.interests.length > 0 && (
          <Reveal as="section">
            <h2>الاهتمامات</h2>
            <div className="chips">
              {profile.interests.map((interest) => (
                <span className="chip" key={interest}>
                  {interest}
                </span>
              ))}
            </div>
          </Reveal>
        )}
        {profile.experience && (
          <Reveal as="section" delay={0.1}>
            <h2>الخبرات</h2>
            <p>{profile.experience}</p>
          </Reveal>
        )}
        {profile.achievements.length > 0 && (
          <Reveal as="section" delay={0.2}>
            <h2>
              <Award size={20} aria-hidden="true" /> الإنجازات
            </h2>
            <div className="achievement-list">
              {profile.achievements.map((text, i) => (
                <span key={i}>
                  <Check size={14} />
                  {text}
                </span>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      <Reveal className="lookbook-cta">
        <p>رُؤى تُنسَج — ابدئي ملفك المهني ومعرض أعمالك في سُدى</p>
        <Button asChild variant="outline">
          <Link to="/register">
            إنشاء حساب <ArrowLeft />
          </Link>
        </Button>
      </Reveal>

      {view && (
        <div
          className="lookbook-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={view.title}
          onClick={() => setView(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setView(null);
          }}
        >
          <button
            type="button"
            className="lookbook-viewer-close"
            aria-label="إغلاق"
            autoFocus
            onClick={() => setView(null)}
          >
            <X />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            {view.image && <img src={view.image} alt={view.title} />}
            <figcaption>
              <strong>{view.title}</strong>
              <span>{view.description}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
