import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  RotateCcw,
  X,
  SlidersHorizontal,
  Bookmark,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  LoadingCards,
  OpportunityCard,
  PageIntro,
  categoryIcons,
} from "@/components/suda/shared";
import {
  categories,
  deadlineInfo,
  emptyFilters,
  filterOpportunities,
  pageHead,
  savedStatuses,
  sortByDeadline,
  type Opportunity,
} from "@/features/suda/mock-data";
import { useDemo } from "@/features/suda/demo-context";
export const Route = createFileRoute("/opportunities/")({
  validateSearch: (search: Record<string, unknown>): { category?: string } => {
    const category = search["category"];
    return typeof category === "string" &&
      categories.some((c) => c === category)
      ? { category }
      : {};
  },
  head: () =>
    pageHead(
      "الفرص",
      "استكشفي دورات ومسابقات وفرص تدريب وفرص وظيفية في تصميم الأزياء",
    ),
  component: Opportunities,
});
function Opportunities() {
  const { opportunities, opportunitiesLoading, session, saved } = useDemo();
  const [showSaved, setShowSaved] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { category } = Route.useSearch();
  const [filters, setFilters] = useState({
    ...emptyFilters,
    type: category || "",
  });
  useEffect(() => {
    setFilters((prev) => ({ ...prev, type: category || "" }));
  }, [category]);
  const items = sortByDeadline(filterOpportunities(opportunities, filters));
  const savedItems = saved
    .map((entry) => ({
      entry,
      item: opportunities.find((o) => o.id === entry.opportunityId),
    }))
    .filter(
      (row): row is { entry: (typeof saved)[number]; item: Opportunity } =>
        Boolean(row.item),
    );
  const activeFilters = [
    { key: "query" as const, label: "البحث", value: filters.query.trim() },
    { key: "type" as const, label: "نوع الفرصة", value: filters.type },
    { key: "mode" as const, label: "طريقة المشاركة", value: filters.mode },
    { key: "level" as const, label: "المستوى", value: filters.level },
    { key: "location" as const, label: "الموقع", value: filters.location },
  ].filter((filter) => filter.value);
  function change(key: keyof typeof filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  return (
    <div className="content-wrap">
      <PageIntro
        eyebrow="الفرص"
        title="استكشاف الفرص"
        description="ابحثي في الدورات والمسابقات والتدريب والفرص الوظيفية، واستخدمي الفلاتر لتحديد ما يناسبك"
      />
      <section
        className="discovery-controls"
        aria-label="البحث عن الفرص وتصفيتها"
      >
        <div className="discovery-controls-heading">
          <div>
            <SlidersHorizontal size={17} aria-hidden="true" />
            <span>تصفّحي بالطريقة التي تناسبك</span>
          </div>
          <span className="discovery-count">
            {activeFilters.length
              ? `${activeFilters.length.toLocaleString("ar-SA")} فلاتر نشطة`
              : "كل الفرص متاحة للتصفّح"}
          </span>
        </div>
        <div className="category-tabs" aria-label="تصفية حسب نوع الفرصة">
          <Button
            variant={!filters.type ? "default" : "outline"}
            aria-pressed={!filters.type}
            onClick={() => change("type", "")}
          >
            جميع الفرص
          </Button>
          {categories.map((type) => {
            const Icon = categoryIcons[type];
            return (
              <Button
                key={type}
                variant={filters.type === type ? "default" : "outline"}
                aria-pressed={filters.type === type}
                onClick={() => change("type", type)}
              >
                <Icon />
                {type}
              </Button>
            );
          })}
          {session && (
            <Button
              variant={showSaved ? "default" : "outline"}
              className="saved-toggle"
              aria-pressed={showSaved}
              onClick={() => setShowSaved(!showSaved)}
            >
              <Bookmark />
              فرصي المحفوظة
              {savedItems.length > 0 && (
                <span className="count-pill">
                  {savedItems.length.toLocaleString("ar-SA")}
                </span>
              )}
            </Button>
          )}
        </div>
        <button
          type="button"
          className="filters-mobile-toggle"
          aria-expanded={filtersOpen}
          aria-controls="suda-filter-bar"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          البحث والفلاتر
          {activeFilters.length > 0 && (
            <span className="count-pill">
              {activeFilters.length.toLocaleString("ar-SA")}
            </span>
          )}
          <ChevronDown size={16} aria-hidden="true" />
        </button>
        <div
          id="suda-filter-bar"
          className={`filter-bar ${filtersOpen ? "is-open" : ""}`}
        >
          <label className="query-filter">
            ابحثي عن فرصتك
            <div className="search-input">
              <Search size={17} />
              <input
                aria-label="البحث عن الفرص"
                placeholder="باترون، تصميم، تشكيل…"
                value={filters.query}
                onChange={(e) => change("query", e.target.value)}
              />
            </div>
          </label>
          <label>
            طريقة المشاركة
            <select
              value={filters.mode}
              onChange={(e) => change("mode", e.target.value)}
            >
              <option value="">جميع الطرق</option>
              <option>عن بُعد</option>
              <option>حضوري</option>
            </select>
          </label>
          <label>
            المستوى
            <select
              value={filters.level}
              onChange={(e) => change("level", e.target.value)}
            >
              <option value="">جميع المستويات</option>
              <option>مبتدئ</option>
              <option>متوسط</option>
              <option value="جميع المستويات">مناسب لجميع المستويات</option>
            </select>
          </label>
          <label>
            الموقع
            <select
              value={filters.location}
              onChange={(e) => change("location", e.target.value)}
            >
              <option value="">جميع المواقع</option>
              {Array.from(new Set(opportunities.map((o) => o.location))).map(
                (location) => (
                  <option key={location}>{location}</option>
                ),
              )}
            </select>
          </label>
        </div>
      </section>
      {showSaved && session && <SavedTracker rows={savedItems} />}
      <div className="result-line">
        <span aria-live="polite">
          {opportunitiesLoading
            ? "جارٍ تجهيز النتائج…"
            : `${items.length.toLocaleString("ar-SA")} نتائج تجريبية`}
        </span>
        <Button
          variant="ghost"
          className="reset"
          onClick={() => setFilters({ ...emptyFilters })}
        >
          <RotateCcw />
          مسح الفلاتر
        </Button>
      </div>
      {activeFilters.length > 0 && (
        <div className="active-filter-list" aria-label="الفلاتر المطبّقة">
          <span className="active-filter-caption">الفلاتر المحدّدة</span>
          {activeFilters.map(({ key, label, value }) => (
            <button
              key={key}
              type="button"
              className="active-filter-chip"
              onClick={() => change(key, "")}
              aria-label={`إزالة فلتر ${label}: ${value}`}
            >
              <span>
                {label}: <strong>{value}</strong>
              </span>
              <X size={14} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
      {opportunitiesLoading ? (
        <LoadingCards label="جارٍ تحميل الفرص..." />
      ) : items.length ? (
        <div className="opportunity-grid" id="opportunity-results">
          {items.map((item, i) => (
            <OpportunityCard key={item.id} item={item} delay={(i % 3) * 0.15} />
          ))}
        </div>
      ) : (
        <div id="opportunity-results">
          <EmptyState
            title="لا توجد نتائج"
            description="لا توجد فرص تطابق بحثك، جرّبي كلمة أخرى أو امسحي الفلاتر"
            action={
              <Button
                variant="outline"
                onClick={() => setFilters({ ...emptyFilters })}
              >
                <RotateCcw />
                عرض جميع الفرص
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}

function SavedTracker({
  rows,
}: {
  rows: {
    entry: { opportunityId: string; status: (typeof savedStatuses)[number] };
    item: Opportunity;
  }[];
}) {
  const { setSavedStatus, toggleSaved } = useDemo();
  if (!rows.length)
    return (
      <section className="saved-tracker is-empty" aria-label="فرصي المحفوظة">
        <Bookmark size={22} strokeWidth={1.3} aria-hidden="true" />
        <p>
          لم تحفظي فرصًا بعد، اضغطي على علامة الحفظ في أي فرصة لتعودي إليها
          وتتابعي حالة تقديمك
        </p>
      </section>
    );
  return (
    <section className="saved-tracker" aria-label="فرصي المحفوظة">
      <header>
        <h2>فرصي المحفوظة</h2>
        <small>
          تابعي أين وصلتِ مع كل فرصة، التقديم نفسه يتم لدى الجهة المنظمة
        </small>
      </header>
      <ul>
        {sortByDeadline(
          rows.map((r) => ({ ...r, deadline: r.item.deadline })),
        ).map(({ entry, item }) => {
          const deadline = deadlineInfo(item.deadline);
          return (
            <li key={item.id}>
              <div className="saved-tracker-title">
                <Link to="/opportunities/$id" params={{ id: item.id }}>
                  {item.title}
                </Link>
                <span className={`deadline-badge is-${deadline.tone}`}>
                  {deadline.label}
                </span>
              </div>
              <div
                className="status-segments"
                role="radiogroup"
                aria-label={`حالة ${item.title}`}
              >
                {savedStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    role="radio"
                    aria-checked={entry.status === status}
                    className={entry.status === status ? "is-active" : ""}
                    onClick={() => void setSavedStatus(item.id, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`حذف ${item.title} من قائمتي`}
                onClick={() => void toggleSaved(item.id)}
              >
                <Trash2 />
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
