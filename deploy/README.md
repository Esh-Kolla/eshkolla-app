# Deploying eshwarkolla.com

Self-hosted on a Mac Mini. Cloudflare Tunnel terminates public traffic and
forwards it to the Next.js container. There is **no reverse proxy** — no Caddy,
no nginx, and no ports open on the router.

```
browser → Cloudflare edge (TLS) → cloudflared (host, LaunchAgent) → localhost:4917 → web container :3000
```

TLS is handled entirely by Cloudflare (Universal SSL, Google Trust Services).
Nothing on the Mac Mini provisions or renews a certificate.

## Components

| Piece | Where it lives | Managed by |
|---|---|---|
| Next.js app | `web` service, published on `localhost:4917` | Docker (`restart: unless-stopped`) |
| Tunnel connector | `/opt/homebrew/bin/cloudflared` | launchd LaunchAgent |
| Tunnel config | `~/.cloudflared/config.yml` | **not in git** |
| Tunnel credentials | `~/.cloudflared/<tunnel-id>.json` | **not in git — secret** |
| DNS | Cloudflare `CNAME` → `<tunnel-id>.cfargotunnel.com` | Cloudflare dashboard |

Only the app is version-controlled. The tunnel config and credentials live in
`~/.cloudflared/` on the Mac Mini and are **not** reproducible from this repo —
back them up separately. `com.cloudflare.cloudflared.plist` in this directory is
a known-good reference copy of the LaunchAgent, not the live file.

## Deploying a change

```bash
git pull
docker compose up -d --build
```

The tunnel is unaffected by app rebuilds — cloudflared keeps its connection and
retries the origin while the container restarts. Expect a few seconds of 502.

## First-time setup on a new machine

1. **App:**

   ```bash
   git clone <repo-url> eshkolla-app && cd eshkolla-app
   cp .env.example .env    # fill in GEMINI_API_KEY, ADMIN_PASSWORD, RESEND_API_KEY
   docker compose up -d --build
   curl -I localhost:4917  # expect 200
   ```

2. **Tunnel:**

   ```bash
   brew install cloudflared
   cloudflared tunnel login
   cloudflared tunnel create eshwarkolla
   cloudflared tunnel route dns eshwarkolla eshwarkolla.com
   ```

   Write `~/.cloudflared/config.yml`:

   ```yaml
   tunnel: <tunnel-id>
   credentials-file: /Users/<user>/.cloudflared/<tunnel-id>.json

   ingress:
     - hostname: eshwarkolla.com
       service: http://localhost:4917
     - hostname: www.eshwarkolla.com
       service: http://localhost:4917
     - service: http_status:404
   ```

3. **Autostart:** copy `com.cloudflare.cloudflared.plist` from this directory to
   `~/Library/LaunchAgents/`, correcting the paths, then:

   ```bash
   launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.cloudflare.cloudflared.plist
   ```

   > `cloudflared service install` writes a plist whose `ProgramArguments` is
   > just the bare binary, with no `tunnel run` subcommand. That plist starts,
   > prints ``use `cloudflared tunnel run` to start tunnel``, exits 1, and
   > crash-loops forever on the `ThrottleInterval`. The reference copy here has
   > the correct `--config … tunnel run` arguments. Do not regenerate it.

## SQLite data

`./data/analytics.db` is bind-mounted into the container and persists across
rebuilds. It is gitignored — back it up separately.

## Troubleshooting

**Site returns HTTP 530 / `error code: 1033`** — Cloudflare's edge is up but no
tunnel is connected. This is the connector, not DNS and not TLS. The origin is
usually healthy.

```bash
launchctl list | grep cloudflared   # 2nd column is last exit status; 0 = ok, 1 = crash loop
tail ~/Library/Logs/com.cloudflare.cloudflared.err.log
curl -I localhost:4917              # confirm the origin itself is fine
```

Restart the connector:

```bash
launchctl kickstart -k gui/$UID/com.cloudflare.cloudflared
```

**The LaunchAgent is a user agent, not a system daemon** — it starts at login,
not at boot. Docker Desktop is also login-scoped, so the whole stack requires a
login. If the Mac Mini boots to a login screen, the site stays down until
someone logs in. Enable automatic login if that is not acceptable.

**Other:**

- App logs: `docker compose logs web`
- Tunnel logs: `~/Library/Logs/com.cloudflare.cloudflared.{out,err}.log`
- Rebuild clean: `docker compose down && docker compose up -d --build`
