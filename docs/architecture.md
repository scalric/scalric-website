# Scalric implementation map

## Information architecture

| Route | Page | Main sections / interaction |
| --- | --- | --- |
| `/` | Home | Video hero and two CTAs; four capability cards; three insight previews; Impact teaser; Careers teaser; contact band |
| `/what-we-do` | What We Do | SaaS, AI, Data & Automation, Consulting; strategic framing and detail points |
| `/industries` | Industries | Proposed focus areas, clearly flagged for confirmation |
| `/insights` | Insights | 17 topic chips, client-side filtering, structured article cards |
| `/insights/:slug` | Insight article | Hero art, metadata, body, related cards, closing contact CTA |
| `/impact` | Impact microsite | Mission, pending metrics, approach, story placeholder, Get Involved form |
| `/company` | Company | Positioning, approach, mission and links to key destinations |
| `/careers` | Careers | Culture, open-role listing/empty state, hiring-process placeholder |
| `/careers/:role-slug` | Role detail | SEO-ready role template; empty until roles are approved |
| `/contact` | Contact | Inquiry intent selector and database-backed contact form |

## Component and data map

- `src/app/` holds the Next.js routes; each page sets its own title and description through `metadata`, and `src/components/SiteShell.jsx` wraps public pages with the header, footer and navigation behaviour.
- `src/components/Header.jsx` owns the six-item navigation, desktop mega menus, mobile accordion navigation, search and persistent contact CTA.
- `src/components/Forms.jsx` owns contact and Impact form behavior; `src/lib/api.js` sends requests to the API.
- `src/data/siteContent.js` is the editable content model for capabilities, proposed industries, topic taxonomy and roles.
- The API (health, forms, roles, admin) and the database schema are in the sibling project `scalric-website-backend`.

## PRD event names

The frontend emits `contact_form_submit`, `impact_teaser_click`, `impact_to_home_click`, `insight_card_click`, `view_all_insights_click`, `careers_apply_click`, and `careers_view_role_click` through `window.dataLayer`. Add the selected analytics provider after its account and privacy configuration are confirmed.

## Design and accessibility

Single-family Manrope typography, white/green/charcoal palette, responsive layouts, focus-visible controls, keyboard-operable navigation, semantic form labels and reduced-motion support. The supplied 8-second video is used on desktop with a generated still poster; mobile uses a CSS abstract fallback to limit video loading.
- `src/admin/` (with the backend's `/api/admin/*` routes) implements the `/admin` site (signed-cookie login, enquiry inbox, status, notes, CSV export).
