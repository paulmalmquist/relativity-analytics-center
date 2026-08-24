# Relativity Analytics Center

A portable, working prototype for a Netflix-inspired analytics discovery experience. It presents dashboards as a browsable internal product: a rotating featured hero, domain-specific content rails, hover previews, search, saved dashboards, trust metadata, and detailed dashboard views.

This package contains the complete source, generated visual assets, lockfile, build scripts, and integration guidance. It contains no credentials, API keys, company data, or deployment identity.

## What is included

- Rotating featured-dashboard hero with manual pagination
- Relativity operating-domain rows:
  - Mission & Vehicle Readiness
  - Manufacturing & Propulsion
  - Test, Quality & Reliability
  - Supply Chain & Program Execution
  - Business & Executive
  - `#DATA` Platform & Governance
- Horizontal dashboard rails with mouse, keyboard, touch, and arrow navigation
- Netflix-style card expansion on hover or keyboard focus
- Dashboard details including owner, connected sources, freshness, trust state, KPI, and trend
- Search across titles, domains, descriptions, owners, and source systems
- In-session “My Dashboards” selection
- Responsive desktop, tablet, and mobile layouts
- Reduced-motion accessibility support
- Original aerospace hero, additive-manufacturing, and social-preview imagery

## Prototype status

This is a production-quality front-end reference, not a production data connection.

- Dashboard names, KPIs, values, freshness times, and status indicators are representative.
- “Open dashboard” currently demonstrates the action with a confirmation toast.
- “My Dashboards” is held in React state and resets when the page reloads.
- Search runs locally against the representative catalog.
- The included `PM` profile mark is a placeholder.
- No backend, authentication requirement, telemetry, or external connector is enabled.

Reference deployment: <https://relativity-analytics-center.paulmalmquistsora.chatgpt.site>

## Technology

- React 19
- Next.js-compatible App Router surface
- TypeScript
- Vinext/Vite build target
- Tailwind present in the starter; most visual design is explicit CSS in `app/globals.css`
- Cloudflare Worker-compatible production output

## Prerequisites

- Node.js 22.13 or newer
- npm
- Linux is recommended for the included bounded build helpers (`flock` and GNU `timeout`)

For an existing corporate Next.js application, you do not need Vinext. Copy the page/component logic and styles into the host application as described under “Integration options.”

## Run locally

From the extracted directory:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite.

Production build:

```bash
npm run build
npm run start
```

The current prototype requires no environment variables.

## Project map

```text
app/
  page.tsx            Complete experience, dashboard catalog, and interactions
  globals.css         Design system, layout, motion, hover, and responsive rules
  layout.tsx          Page metadata and social-preview configuration
  chatgpt-auth.ts     Optional authentication helpers from the starter
public/
  hero-factory.png    Featured aerospace hero artwork
  metal-print.png     Additive-manufacturing card artwork
  og.png              Social-preview image
scripts/              Reproducible install and build helpers
tests/                Starter rendered-output validation
package.json          Runtime and command definitions
package-lock.json     Locked dependency graph
```

The optional `db/`, `drizzle/`, `examples/d1/`, and `worker/` folders are inherited from the portable starter. The current user experience does not depend on them. They can remain in a standalone deployment or be omitted when the page is merged into an existing application.

## Where the content lives

The dashboard catalog is the `rows` array near the top of `app/page.tsx`. Each row represents one operating domain and contains dashboard records created with the `d(...)` helper.

Each dashboard currently supplies:

| Field | Purpose |
| --- | --- |
| `id` | Stable dashboard key; use a durable registry ID rather than a display name |
| `title` | User-facing dashboard name |
| `domain` | Card eyebrow and search facet |
| `description` | Decision-oriented summary of what the dashboard answers |
| `owner` | Accountable business or product owner |
| `source` | Connected source systems shown to the user |
| `updated` | Human-readable freshness indicator |
| `state` | `Live`, `Certified`, or `Review` trust posture |
| `metric` | Featured KPI name |
| `value` | Featured KPI value |
| `trend` | Short directional or comparison statement |
| `tone` | Visual accent token |
| `image` | Optional artwork path under `public/` |

## Recommended production catalog contract

Replace the inline catalog with a governed API or generated static manifest. A practical first contract is:

```ts
type AnalyticsCatalogItem = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryLabel: string;
  dashboardUrl: string;
  platform: "power-bi" | "grafana" | "custom" | "other";
  owner: { team: string; contact?: string };
  sourceSystems: string[];
  certifiedMetricIds: string[];
  trustState: "live" | "certified" | "review" | "deprecated";
  freshness: {
    observedAt: string;
    expectedIntervalMinutes?: number;
    state: "fresh" | "late" | "stale" | "unknown";
  };
  audience?: string[];
  tags?: string[];
  hero?: {
    enabled: boolean;
    priority?: number;
    startAt?: string;
    endAt?: string;
    imageUrl?: string;
  };
};
```

Keep the catalog declarative. The home page should consume catalog state; it should not become the source of truth for dashboard ownership, certification, or freshness.

## Connecting real dashboard URLs

The current `open(item)` function in `app/page.tsx` shows a toast. For production:

1. Add `dashboardUrl` and `platform` to the `Dashboard` type.
2. Populate them from the catalog API.
3. Resolve internal destinations through an approved URL allowlist.
4. Replace the toast implementation with same-tab navigation, a controlled new tab, or a Paul OS embedded-view route.
5. Record the launch event using your existing product analytics standard.

Do not interpolate untrusted URLs directly into navigation. Validate the protocol and allowed host before opening a catalog-provided destination.

## Integration options

### Option A — Standalone analytics center

Use this package as its own application and connect it to the governed dashboard catalog. This preserves the prototype almost exactly and gives the center an independent release lifecycle.

Recommended when:

- dashboard discovery is a distinct product;
- the center needs its own access boundary;
- multiple host applications should link to the same experience.

### Option B — Paul OS route

Move the experience into a route such as `app/analytics/page.tsx` in the existing Paul OS repository.

Recommended sequence:

1. Copy `app/page.tsx` into the new route.
2. Convert `app/globals.css` to a route-scoped CSS module before merging it into an application with established global styles.
3. Reuse Paul OS navigation, identity, feature flags, and observability.
4. Replace the representative `rows` array with the catalog adapter.
5. Map the `open(item)` action to the host application’s approved internal-link component.
6. Move “My Dashboards” into the existing user-preference store or API.
7. Retain the present keyboard, touch, reduced-motion, and responsive behavior.

### Option C — UI package

Extract the page into reusable components such as `AnalyticsHero`, `DashboardRail`, `DashboardCard`, `DashboardDetail`, and `AnalyticsSearch`. Publish them inside the existing monorepo rather than creating a new external package unless multiple repositories genuinely require versioned reuse.

## Real inputs required at transfer

| Input | Owner to confirm | Used for |
| --- | --- | --- |
| Canonical dashboard inventory and IDs | BI / `#DATA` | Catalog records and deduplication |
| Approved Power BI, Grafana, and custom-app URLs | Platform owners | Real navigation |
| Operating-domain taxonomy and display order | Leadership / program owners | Category rails |
| Dashboard business owner and support contact | Dashboard owners | Accountability and detail view |
| Metric registry IDs and certification state | Data governance | Trust labeling |
| Dataset refresh telemetry or SLA status | Data platform | Freshness indicators |
| Usage and favoriting history | BI telemetry / identity | Personalized ordering |
| Role and program entitlements | Security / application owners | Visibility and access filtering |
| Official Relativity brand assets and usage approval | Brand / communications | Logo, typography, imagery |
| Product analytics event standard | Paul OS / platform team | Adoption and click-through measurement |

## Production hardening checklist

- [ ] Replace all representative records and values with a governed catalog feed.
- [ ] Resolve official terminology for operating domains and dashboard names.
- [ ] Add server-side entitlement filtering; hiding a card in the browser is not access control.
- [ ] Validate all dashboard URLs against an allowlist.
- [ ] Add loading, catalog-unavailable, dashboard-deprecated, and access-denied states.
- [ ] Persist favorites against authenticated user identity.
- [ ] Define how featured dashboards are selected, scheduled, and expired.
- [ ] Connect freshness to actual refresh/stream health rather than formatted sample text.
- [ ] Connect certification to the metric registry and lineage/catalog systems.
- [ ] Instrument impressions, searches, detail opens, dashboard launches, saves, and zero-result searches.
- [ ] Confirm official brand treatment and image usage.
- [ ] Review data classification, export controls, program segmentation, and audit requirements.
- [ ] Run accessibility checks with keyboard-only navigation and a screen reader.
- [ ] Test standard desktop displays, meeting-room displays, tablets, and supported mobile widths.
- [ ] Add component and end-to-end tests for catalog loading, search, favorites, and navigation.

## Suggested product events

```text
analytics_center_viewed
featured_dashboard_impression
featured_dashboard_selected
dashboard_card_impression
dashboard_detail_opened
dashboard_launched
dashboard_saved
dashboard_unsaved
dashboard_search_submitted
dashboard_search_zero_results
dashboard_rail_scrolled
```

Use stable dashboard IDs and category IDs in events. Do not send dashboard data, search text, user details, or program-sensitive attributes to an analytics destination without completing the relevant data-classification review.

## Design behavior worth preserving

- The hero is for one high-value, current decision surface—not a generic welcome message.
- Featured rotation pauses after deliberate manual selection.
- Cards lead with recognition and reveal detail only on hover/focus.
- Expanded cards expose launch, save, trust, freshness, description, KPI, and trend without requiring navigation.
- Category rows maintain a strong browsing rhythm while preserving domain ownership.
- Search accepts the language users naturally remember: topic, metric, owner, or source system.
- “My Dashboards” reduces repeat navigation without replacing the complete catalog.
- Trust and freshness are part of the discovery experience, not buried inside the dashboard.

## One-way handoff prompt

Use the following prompt with the coding agent on the destination computer after extracting this bundle:

```text
You are receiving a self-contained reference implementation named Relativity Analytics Center. Read README.md completely before changing code. Inspect app/page.tsx, app/globals.css, app/layout.tsx, package.json, and the public assets. First run the current implementation and preserve its Netflix-inspired interaction model: rotating featured hero, horizontal operating-domain rails, card hover/focus expansion, search, dashboard detail views, My Dashboards, responsive layouts, and reduced-motion support.

Then inspect the existing Paul OS application and propose the smallest production-quality integration that uses its current stack, routing, identity, authorization, design primitives, observability, and deployment conventions. Prefer a new /analytics route and route-scoped styles unless the repository’s architecture clearly supports a reusable feature module. Do not replace working infrastructure or introduce a parallel authentication, state-management, telemetry, or deployment system.

Treat all catalog values in the prototype as representative. Locate or define adapters for the real dashboard inventory, approved destination URLs, category taxonomy, owners, source systems, metric registry/certification, freshness telemetry, user favorites, entitlements, and usage events. Keep the UI decoupled from those sources through a typed AnalyticsCatalogItem contract. Validate destination URLs and enforce entitlements server-side. Do not expose credentials, restricted data, or cross-program metadata.

Before implementation, write a concise integration plan naming the exact files that will be created or changed, the real inputs that are available, the inputs still required, and the verification steps. Then implement the approved smallest coherent slice. Preserve the current visual quality and interaction density. Run the repository’s existing lint, typecheck, tests, production build, and browser verification. Finish with a handoff that lists changes, unresolved real-input dependencies, and the exact command or route for reviewing the result.
```

## Original assets

The three production PNGs under `public/` were generated specifically for this prototype and are bundled with it. Before internal production use, confirm the company’s normal approval process for generated visual assets and replace them with official photography if required.

## Transfer notes

- The archive intentionally excludes `node_modules`, build output, temporary runtime files, source-control history, and the original hosted-site identity.
- Run `npm ci` after extraction to restore locked dependencies.
- No secrets or `.env` files are included.
- Preserve `package-lock.json` when using the package as a standalone application.
- If merging into another repository, follow that repository’s package manager, lockfile, and contribution conventions instead of copying this package’s dependency infrastructure wholesale.
