#  Multi-Site Platform

A production-style monorepo built around a headless CMS: four independent
public marketing sites and a private admin panel, all backed by one Django
REST API. Editors manage every page, section, image, and translation from
the admin panel — no code changes needed to update content.

## What's inside

| App | Purpose |
| --- | --- |
| `apps/main-site` | Holding company site — group overview, governance, contact |
| `apps/real-estate` | Property, construction, and investment services |
| `apps/finance` | Trade, import/export, and currency transfer services |
| `apps/visa` | Residency, visa, corporate setup, and translation services |
| `apps/admin-panel` | Private React dashboard for editing all four sites' content |
| `services/cms-api` | Django REST Framework CMS powering every site above |

Each public site is a standalone React app (Vite + Tailwind) that reads its
content from the CMS API at runtime and falls back to a committed JSON
snapshot if the API is unavailable — so the sites stay up even if the
backend goes down.

## Highlights

- **One CMS, four sites, four locales** — English, Persian, Arabic, and
  Turkish content managed from a single admin panel, with automatic
  fallback to English for missing translations.
- **Content/layout separation** — editors change text, links, and media;
  developers own layout and design. Structural fields (slugs, section
  keys, ordering) are protected from accidental edits.
- **Resilient by default** — every site ships an offline fallback snapshot
  (`src/content/fallback.json`) mirroring the CMS, regenerated with a
  single script.
- **Independently deployable** — each frontend builds and runs on its own;
  Nginx and Docker Compose tie them together for local dev and production.

## Architecture

```text
Visitor ──▶ Public sites (React/Vite) ──▶ CMS API (Django) ──▶ PostgreSQL
Admin   ──▶ Admin panel (React/Vite)  ──▶ CMS API (Django) ──▶ PostgreSQL
```

```text
apps/
  main-site/       real-estate/      finance/      visa/      admin-panel/
services/
  cms-api/         Django REST Framework, token auth, seed/import commands
infra/
  nginx/           dev.conf, prod.conf — routing for all five frontends + API
docker-compose.dev.yml
docker-compose.prod.yml
```

## Tech stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, TypeScript (partial)
- **Backend**: Django, Django REST Framework, PostgreSQL, gunicorn
- **Infra**: Docker Compose, Nginx (multi-host routing), single reverse proxy per environment

## Getting started

Requires Docker and Docker Compose.

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d --build
```

This starts all five frontends, the CMS API, and PostgreSQL behind an Nginx
proxy on local subdomains (e.g. `http://example.localhost:8080`,
`http://admin.example.localhost:8080`). On Windows, resolve local hostnames
by running `scripts/add-local-hosts.ps1` as Administrator.

To work on a single frontend without Docker:

```bash
cd apps/main-site   # or real-estate, finance, visa, admin-panel
npm ci
npm run dev
```

## Content management

All page text, images, videos, navigation, and per-locale UI strings are
editable from the admin panel — see [docs/ADMIN_USER_GUIDE.md](docs/ADMIN_USER_GUIDE.md).
For the content model, editorial rules, and file layout, see
[docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md) and
[docs/content-style.md](docs/content-style.md).

After editing seed JSON under `services/cms-api/content/seed_data/`, re-seed
the CMS:

```bash
docker compose -f docker-compose.dev.yml exec cms-api python manage.py seed_cms
```

## Testing

A smoke test guards against regressions where deleted hardcoded content
constants reappear in app source (e.g. stock image arrays, demo blog
posts):

```bash
npm run smoke-cms
```

## Production deployment

Full checklist, required environment variables, TLS, backups, and rollback
steps are documented separately: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
Security-specific guidance is in [SECURITY.md](SECURITY.md).

## License

See [LICENSE](LICENSE). This code is shared for portfolio/demonstration
purposes only — all rights reserved.
