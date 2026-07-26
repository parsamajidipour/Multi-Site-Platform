# Rezaei CMS API

Phase 1 Django REST Framework backend for CMS-managed content across:

- `main-site`
- `real-estate`
- `finance`
- `visa`

This service intentionally does not include the React admin panel, public-site integration, media library UI, form submissions, review workflow, or complex roles.

## Packages

- Django
- Django REST Framework
- django-cors-headers
- dj-database-url
- psycopg
- gunicorn

## Local Docker

This compose file is scoped to the CMS only and does not modify existing public website Docker/Nginx routing.

```bash
cd services/cms-api
docker compose -f docker-compose.cms.yml up --build
```

Create a superuser:

```bash
docker compose -f docker-compose.cms.yml exec cms_api python manage.py createsuperuser
```

## Admin Auth

```http
POST /api/auth/login/
POST /api/auth/logout/
GET  /api/auth/me/
```

`POST /api/auth/login/` accepts:

```json
{
  "username": "admin",
  "password": "password"
}
```

It returns a DRF token. Admin clients should send:

```http
Authorization: Token <token>
```

Phase 1 admin endpoints require a Django superuser.

## Admin Endpoints

```http
GET    /api/admin/sites/
POST   /api/admin/sites/
GET    /api/admin/sites/{id}/
PATCH  /api/admin/sites/{id}/
DELETE /api/admin/sites/{id}/

GET    /api/admin/pages/?site=real-estate&locale=en
POST   /api/admin/pages/
GET    /api/admin/pages/{id}/
PATCH  /api/admin/pages/{id}/
DELETE /api/admin/pages/{id}/
POST   /api/admin/pages/{id}/publish/
POST   /api/admin/pages/{id}/unpublish/

GET    /api/admin/pages/{page_id}/sections/
POST   /api/admin/pages/{page_id}/sections/
POST   /api/admin/pages/{page_id}/sections/reorder/
GET    /api/admin/sections/{id}/
PATCH  /api/admin/sections/{id}/
DELETE /api/admin/sections/{id}/

GET    /api/admin/sections/{section_id}/blocks/
POST   /api/admin/sections/{section_id}/blocks/
POST   /api/admin/sections/{section_id}/blocks/reorder/
GET    /api/admin/blocks/{id}/
PATCH  /api/admin/blocks/{id}/
DELETE /api/admin/blocks/{id}/

GET    /api/admin/sites/{site_id}/navigation/?locale=en
POST   /api/admin/sites/{site_id}/navigation/
POST   /api/admin/sites/{site_id}/navigation/reorder/
PATCH  /api/admin/navigation/{id}/
DELETE /api/admin/navigation/{id}/

GET    /api/admin/sites/{site_id}/settings/
PATCH  /api/admin/sites/{site_id}/settings/

GET    /api/admin/media-assets/
POST   /api/admin/media-assets/
GET    /api/admin/media-assets/{id}/
PATCH  /api/admin/media-assets/{id}/
DELETE /api/admin/media-assets/{id}/
```

## Public Endpoints

Public endpoints return only active sites and published pages.

```http
GET /api/public/sites/{site_key}/
GET /api/public/sites/{site_key}/navigation/?locale=en
GET /api/public/sites/{site_key}/settings/
GET /api/public/sites/{site_key}/homepage/?locale=en
GET /api/public/sites/{site_key}/pages/{slug}/?locale=en
```

Example public page response:

```json
{
  "site": {},
  "page": {},
  "navigation": [],
  "settings": {},
  "sections": []
}
```

## Seed Command

The seed command is ready for later static-to-CMS migration.

```bash
python manage.py seed_cms
python manage.py seed_cms --path path/to/content.json
python manage.py seed_cms --path path/to/seed_data_directory
python manage.py seed_cms --path path/to/content.json --clear
```

By default, `seed_cms` imports every `*.json` file in:

```text
content/seed_data/
```

Current Phase 1 seed files:

```text
content/seed_data/main-site.json
content/seed_data/real-estate.json
content/seed_data/finance.json
content/seed_data/visa.json
```

Expected seed shape:

```json
{
  "sites": [
    {
      "key": "real-estate",
      "name": "Rezaei Real Estate",
      "default_locale": "en",
      "settings": {},
      "navigation": [],
      "pages": [
        {
          "slug": "/",
          "title": "Home",
          "locale": "en",
          "status": "published",
          "seo": {},
          "sections": []
        }
      ]
    }
  ]
}
```

A seed file may also contain a single top-level `site` object instead of a `sites` list.

## Warning

Public websites are not connected yet. They should later fetch these public endpoints at runtime and keep committed fallback JSON.
