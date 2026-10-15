import { createFileRoute } from "@tanstack/react-router";
import { Search, RotateCcw } from "lucide-react";
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
      "استكشفي دورات ومسابقات وفرص تدريب وفرص وظيفية في تصميم الأزياء.",
    ),
  component: Opportunities,
});
function Opportunities() {
  const { opportunities } = useDemo();
  const { category } = Route.useSearch();
  const [filters, setFilters] = useState({
    ...emptyFilters,
    type: category || "",
  });
  useEffect(() => {
    setFilters((prev) => ({ ...prev, type: category || "" }));
  }, [category]);
  const items = filterOpportunities(opportunities, filters);
  function change(key: keyof typeof filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  return (
    <div className="content-wrap">
      <PageIntro
        eyebrow="الفرص"
        title="استكشاف الفرص"
        description="ابحثي في الدورات والمسابقات والتدريب والفرص الوظيفية، واستخدمي الفلاتر لتحديد ما يناسبك."
      />
      <div className="category-tabs">
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
      {items.length ? (
        <div className="opportunity-grid">
          {items.map((item, i) => (
            <OpportunityCard key={item.id} item={item} delay={(i % 3) * 0.15} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="لا توجد نتائج"
          description="لا توجد فرص تطابق بحثك. جرّبي كلمة أخرى أو امسحي الفلاتر."
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
      )}
      <DemoNote />
    </div>
  );
}
