# Admin Analytics

The admin dashboard is served from `/admin` and uses Flask session auth.

## Password Setup

Generate a password hash:

```bash
cd flask_app
python scripts/generate_admin_password_hash.py
```

Put the printed value in `flask_app/.env`:

```env
SECRET_KEY=replace-with-a-long-random-value
ADMIN_PASSWORD_HASH=replace-with-generated-hash
```

## Visitor Storage

Analytics events are stored in SQLite at `ANALYTICS_DB_PATH`. In Docker, the
compose file mounts `./data/flask` to `/app/data`, so the database survives
container rebuilds.

## GeoIP Enrichment

For country, city, and ASN enrichment, place MaxMind database files here:

```text
data/flask/geoip/GeoLite2-City.mmdb
data/flask/geoip/GeoLite2-ASN.mmdb
```

The dashboard still works without these files; location and network fields will
show as unknown until the databases are present.

## Updating GeoIP Databases

Add these to `flask_app/.env`:

```env
MAXMIND_ACCOUNT_ID=your-account-id
MAXMIND_LICENSE_KEY=your-license-key
```

Then run from the repo root:

```bash
./scripts/update_maxmind.sh
```

To automate updates, run the same command from cron, for example weekly:

```cron
17 4 * * 2 cd /home/ashish/personal_site_jan2025 && ./scripts/update_maxmind.sh >> logs/maxmind-update.log 2>&1
```

