# SUDA — Sprint 1 navigation and demonstration flow

```mermaid
flowchart TD
  H[الرئيسية] --> O[الفرص]
  H --> I[إلهام سعودي]
  H --> P[الملف المهني]
  H --> W[معرض الأعمال]
  O --> D[تفاصيل الفرصة]
  D -->|دورة مجانية| L[الالتحاق ثم رحلتي التعليمية]
  D -->|فرصة أخرى| X[موقع الجهة الخارجي إن توفر رابط موثق]
  P --> A[الدخول التجريبي]
  W --> A
  L --> A
  A --> P
  A --> W
  A --> L
  A -->|وضع المشرفة التجريبي| M[إدارة الفرص]
  M --> O
  I --> E[تفاصيل المصممة داخل الصفحة نفسها]
```

## Demo flows

- Visitor: home → opportunities → combined search/filter → details → login → free-course enrollment → learning progress.
- Designer: mock login → create/edit professional profile → add/edit/delete portfolio work (local compressed image) → manual progress and achievements.
- Supervisor: mock login with admin demo role → create/edit/delete opportunity across four categories → see changes reflected in browse/detail pages.
- Editorial: homepage lower teaser → inspiration → choose one of eight sourced designers → expanded details on the same page.
- Reset: footer action → confirmation → restore seed opportunities and clear per-user demo data.

No real authentication, backend, official external applications, or database integration in Sprint 1.
