import { createFileRoute } from "@tanstack/react-router";
import { Search, RotateCcw, X, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DemoNote,
  EmptyState,
  OpportunityCard,
  PageIntro,
  categoryIcons,
} from "@/components/suda/shared";
import {
  categories,
  emptyFilters,
  filterOpportunities,
  pageHead,
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
  const { opportunities, opportunitiesLoading } = useDemo();
  const { category } = Route.useSearch();
  const [filters, setFilters] = useState({
    ...emptyFilters,
    type: category || "",
  });
  useEffect(() => {
    setFilters((prev) => ({ ...prev, type: category || "" }));
  }, [category]);
  const items = filterOpportunities(opportunities, filters);
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
        </div>
        <div className="filter-bar">
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
      <div className="result-line">
        <span aria-live="polite">
          {items.length.toLocaleString("ar-SA")} نتائج تجريبية
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
        <p role="status">جارٍ تحميل الفرص...</p>
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
            description="لا توجد فرص تطابق بحثك. جرّبي كلمة أخرى أو امسحي الفلاتر"
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
      <DemoNote />
    </div>
  );
}
