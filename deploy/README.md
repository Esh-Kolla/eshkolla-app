# Deploying eshwarkolla.com

Self-hosted on a Mac Mini with Docker and Caddy reverse proxy.

## Prerequisites

- Docker and Docker Compose installed on the Mac Mini
- Domain `eshwarkolla.com` pointing to the Mac Mini's public IP
- Ports 80 and 443 open on the router/firewall

## Steps

1. **Clone the repo on the Mac Mini:**

   ```bash
   git clone <repo-url> eshkolla-app
   cd eshkolla-app
   ```

2. **Create the environment file:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in:
   - `GEMINI_API_KEY` - Google Gemini API key for AI features
   - `ADMIN_PASSWORD` - Password for the admin dashboard
   - `RESEND_API_KEY` - Resend API key for email

3. **Point DNS to the Mac Mini:**

   In GoDaddy (or your DNS provider), set an A record:
   - Name: `@`
   - Value: Your Mac Mini's public IP address
   - TTL: 600 (or lowest available)

4. **Start the services:**

   ```bash
   docker compose up -d
   ```

   This builds the Next.js app, starts it on port 3000, and starts Caddy which automatically provisions an HTTPS certificate from Let's Encrypt.

5. **Verify:**

   ```bash
   docker compose logs -f
   ```

   Wait for Caddy to obtain the TLS certificate. Then visit `https://eshwarkolla.com`.

## Updating

Pull the latest code and rebuild:

```bash
git pull
docker compose up -d --build
```

## SQLite Data

The SQLite database is stored in `./data/analytics.db` on the host, mounted into the container. This directory persists across container rebuilds.

## Troubleshooting

- **Certificate issues:** Ensure ports 80 and 443 are reachable from the internet (Caddy needs these for ACME challenge).
- **Container logs:** `docker compose logs web` or `docker compose logs caddy`
- **Rebuild from scratch:** `docker compose down && docker compose up -d --build`
