# Deployment Guide

This document covers running the stack in production: environment setup,
release steps, backups, and rollback. For local development, see the
[root README](../README.md#getting-started).

## Production Deployment Checklist

1. Point DNS records for all production hostnames to the server:
   - `example.com`
   - `www.example.com`
   - `real-estate.example.com`
   - `finance.example.com`
   - `visa.example.com`
   - `admin.example.com`
   - `cms.example.com`

2. Create a production `.env` from `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. Set real production secrets in `.env`. Do not reuse development values.

4. Confirm `DJANGO_DEBUG=false`.

5. Start the production stack:

   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

6. Run migrations, if you want to execute them manually after startup:

   ```bash
   docker compose -f docker-compose.prod.yml exec cms-api python manage.py migrate --noinput
   ```

   The production `cms-api` service also runs migrations on container startup.

7. Create the first CMS superuser manually:

   ```bash
   docker compose -f docker-compose.prod.yml exec cms-api python manage.py createsuperuser
   ```

8. Initial CMS seed content is imported automatically only when the CMS has no sites.
   To run it manually on an empty production CMS:

   ```bash
   docker compose -f docker-compose.prod.yml exec cms-api python manage.py seed_cms_if_empty
   ```

   Run full seed imports carefully in production. Do not use `seed_cms` to overwrite edited live CMS content unless that is intentional.

9. Check service status:

   ```bash
   docker compose -f docker-compose.prod.yml ps
   docker compose -f docker-compose.prod.yml logs --tail=100 cms-api
   docker compose -f docker-compose.prod.yml logs --tail=100 proxy
   ```

## Required Production Environment Variables

Set these values in the production `.env` file:

```bash
HTTP_PORT=80

MAIN_SITE_PUBLIC_URL=https://example.com
REAL_ESTATE_PUBLIC_URL=https://real-estate.example.com
FINANCE_PUBLIC_URL=https://finance.example.com
VISA_PUBLIC_URL=https://visa.example.com
ADMIN_PUBLIC_URL=https://admin.example.com
CMS_PUBLIC_URL=https://cms.example.com

CMS_POSTGRES_DB=rezaei_cms
CMS_POSTGRES_USER=rezaei_cms
CMS_POSTGRES_PASSWORD=<strong-database-password>
DATABASE_URL=postgres://rezaei_cms:<strong-database-password>@cms-db:5432/rezaei_cms

DJANGO_SECRET_KEY=<long-random-secret>
DJANGO_DEBUG=false
DJANGO_ALLOWED_HOSTS=cms.example.com,admin.example.com,example.com,real-estate.example.com,finance.example.com,visa.example.com,cms-api
CORS_ALLOWED_ORIGINS=https://admin.example.com,https://example.com,https://real-estate.example.com,https://finance.example.com,https://visa.example.com
CSRF_TRUSTED_ORIGINS=https://cms.example.com,https://admin.example.com
CMS_GUNICORN_WORKERS=3

# Optional: create/update the CMS admin user automatically on deploy.
# Prefer a strong password stored only in the server .env or secret manager.
# CMS_SUPERUSER_USERNAME=admin
# CMS_SUPERUSER_EMAIL=admin@example.com
# CMS_SUPERUSER_PASSWORD=<strong-admin-password>
```

Never commit the production `.env` file.

## Security Notes

Default admin credentials must never exist in production. The production stack does not create a default superuser. Create the first superuser manually with `createsuperuser`, use a strong password, and store credentials in a password manager.

Keep `DJANGO_DEBUG=false` in production. Keep `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` restricted to real production domains.

See also [SECURITY.md](../SECURITY.md).

## TLS/SSL

`infra/nginx/prod.conf` currently listens on HTTP port `80`. Terminate TLS with one of these production options:

- A host-level Nginx or Caddy reverse proxy with Let's Encrypt.
- A cloud load balancer or CDN that provides certificates.
- A managed platform proxy in front of this Docker stack.

Whichever option is used, force HTTPS redirects at the edge and forward the original protocol with `X-Forwarded-Proto`.

## Health Check URLs

After deployment, verify:

```text
https://example.com
https://real-estate.example.com
https://finance.example.com
https://visa.example.com
https://admin.example.com
https://cms.example.com/api/public/sites/main-site/homepage/
https://cms.example.com/api/public/sites/real-estate/homepage/
https://cms.example.com/api/public/sites/finance/homepage/
https://cms.example.com/api/public/sites/visa/homepage/
```

Expected result:

- Public sites return their homepage.
- Admin panel loads the login screen.
- CMS public endpoints return JSON for published content.

## CMS Database Backup

The production PostgreSQL data is stored in the persistent Docker volume `cms_db_data`.

Create a SQL backup:

```bash
mkdir -p backups
docker compose -f docker-compose.prod.yml exec -T cms-db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > "backups/cms-$(date +%F-%H%M%S).sql"
```

Restore a SQL backup:

```bash
docker compose -f docker-compose.prod.yml exec -T cms-db sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"' < backups/cms-backup.sql
```

For server-level backups, also snapshot the Docker volume:

```bash
docker volume inspect rezaei_cms_db_data
```

Keep off-server encrypted backups and test restores before relying on them.

## Rollback Notes

Before deployment:

```bash
git rev-parse HEAD
docker compose -f docker-compose.prod.yml ps
```

Rollback application code:

```bash
git checkout <previous-good-commit>
docker compose -f docker-compose.prod.yml up -d --build
```

Rollback database content only if needed:

```bash
docker compose -f docker-compose.prod.yml exec -T cms-db sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"' < backups/cms-backup.sql
```

Be careful with database rollback after migrations. If a release includes database changes, confirm the migration path before restoring an older app version.
