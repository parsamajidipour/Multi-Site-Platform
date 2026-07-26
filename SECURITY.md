# Security

## Production Credentials

Never use default or shared admin credentials in production. The production stack must not create any predictable admin account.

Create the first CMS superuser manually:

```bash
docker compose -f docker-compose.prod.yml exec cms-api python manage.py createsuperuser
```

Use a strong unique password and store it in a password manager.

## Required Production Settings

Production must use:

```bash
DJANGO_DEBUG=false
DJANGO_SECRET_KEY=<long-random-secret>
DJANGO_ALLOWED_HOSTS=cms.example.com,admin.example.com,example.com,real-estate.example.com,finance.example.com,visa.example.com,cms-api
CORS_ALLOWED_ORIGINS=https://admin.example.com,https://example.com,https://real-estate.example.com,https://finance.example.com,https://visa.example.com
CSRF_TRUSTED_ORIGINS=https://admin.example.com
```

Never commit the production `.env` file or database backups.

## TLS

Serve production traffic over HTTPS. The included production Nginx config listens on port `80`; place a TLS terminator such as host-level Nginx, Caddy, a cloud load balancer, or a CDN in front of it.

## Backups

Back up the CMS PostgreSQL database before deployments and before running seed/import commands. Store backups encrypted and off-server, and periodically test restores.

## Reporting Issues

For private deployments, report security issues directly to the project owner or server administrator. Do not disclose secrets, database dumps, or admin credentials in tickets or chat logs.
