# Creator Business Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build non-payment creator business management for services, products, memberships, bookings, and revenue presentation.
**Architecture:** Business entities and derived analytics live in the shared local repository; inquiries connect to Inbox and accepted work to Projects.
**Tech Stack:** React, TypeScript, Vitest, Testing Library, Recharts, CSS.
**Spec:** `docs/superpowers/specs/2026-09-12-complete-frontend-product-design.md`

## Global Constraints
- Exclude checkout, cards, payment processing, payouts, and purchase-success states.
- Label revenue and supporter data as preview/sample data.
- Service requests are inquiries, not paid bookings.

---

### Task 1: Services and booking pipeline
- [ ] Add failing tests for list/edit/publish, inquiry, booking stages, conversation, and project conversion.
- [ ] Implement `src/redesign/business/BusinessHub.tsx`, `Services.tsx`, `Bookings.tsx`, and `business.css`.
- [ ] Verify tests and commit `feat: add services and bookings preview`.

### Task 2: Digital products and memberships
- [ ] Add failing tests for product metadata, publish state, tier features, and supporter presentation without purchase actions.
- [ ] Implement `DigitalProducts.tsx` and `Memberships.tsx`.
- [ ] Verify tests and commit `feat: add creator offerings preview`.

### Task 3: Revenue insights
- [ ] Add failing tests for source breakdown, date filters, top supporters, and empty state.
- [ ] Implement `RevenueInsights.tsx` with accessible chart summaries.
- [ ] Verify tests and commit `feat: add creator revenue insights preview`.

