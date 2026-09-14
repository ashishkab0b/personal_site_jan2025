import hashlib
import json
import os
import re
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone
from functools import lru_cache
from ipaddress import ip_address
from pathlib import Path
from urllib.parse import urlsplit

try:
    import geoip2.database
except ImportError:  # pragma: no cover - dependency may be absent in dev
    geoip2 = None

try:
    from user_agents import parse as parse_user_agent
except ImportError:  # pragma: no cover - dependency may be absent in dev
    parse_user_agent = None


BOT_UA_PATTERNS = [
    ("Googlebot", r"googlebot"),
    ("Bingbot", r"bingbot"),
    ("DuckDuckBot", r"duckduckbot"),
    ("YandexBot", r"yandex(bot)?"),
    ("Baiduspider", r"baiduspider"),
    ("Applebot", r"applebot"),
    ("Facebook crawler", r"facebookexternalhit|facebot"),
    ("Twitterbot", r"twitterbot"),
    ("LinkedInBot", r"linkedinbot"),
    ("Slackbot", r"slackbot"),
    ("Discordbot", r"discordbot"),
    ("WhatsApp", r"whatsapp"),
    ("TelegramBot", r"telegrambot"),
    ("SemrushBot", r"semrushbot"),
    ("AhrefsBot", r"ahrefsbot"),
    ("MJ12bot", r"mj12bot"),
    ("DotBot", r"dotbot"),
    ("PetalBot", r"petalbot"),
    ("CCBot", r"ccbot"),
    ("GPTBot", r"gptbot"),
    ("ClaudeBot", r"claudebot|anthropic-ai"),
    ("PerplexityBot", r"perplexitybot"),
    ("Generic bot", r"\b(bot|crawler|spider|scrapy)\b"),
]

SCANNER_UA_PATTERNS = [
    ("curl", r"\bcurl\b"),
    ("wget", r"\bwget\b"),
    ("python-requests", r"python-requests"),
    ("Go HTTP client", r"go-http-client"),
    ("Java client", r"java/"),
    ("zgrab", r"zgrab"),
    ("masscan", r"masscan"),
    ("Nmap", r"nmap"),
    ("Nikto", r"nikto"),
    ("sqlmap", r"sqlmap"),
    ("Gobuster", r"gobuster"),
    ("DirBuster", r"dirbuster"),
    ("Nuclei", r"nuclei"),
    ("Acunetix", r"acunetix"),
    ("Nessus", r"nessus"),
]

SUSPICIOUS_PATH_PATTERNS = [
    r"^/\.env",
    r"^/\.git",
    r"^/\.svn",
    r"^/wp-",
    r"^/wordpress",
    r"^/xmlrpc\.php",
    r"^/phpmyadmin",
    r"^/pma",
    r"^/adminer",
    r"^/vendor/phpunit",
    r"^/cgi-bin",
    r"^/HNAP1",
    r"^/actuator",
    r"^/server-status",
    r"^/\.aws",
    r"^/backup",
    r"^/config",
    r"^/debug",
    r"^/shell",
    r"^/boaform",
    r"^/manager/html",
    r"^/login\.action",
    r".*\.php$",
    r".*\.aspx?$",
    r".*\.jsp$",
]

STATIC_EXTENSIONS = (
    ".css",
    ".js",
    ".map",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".txt",
)

NGINX_LOG_RE = re.compile(
    r'(?P<ip>\S+) - (?P<user>\S+) \[(?P<time>[^\]]+)\] '
    r'"(?P<request>[^"]*)" (?P<status>\d{3}) (?P<body_bytes>\S+) '
    r'"(?P<referrer>[^"]*)" "(?P<user_agent>[^"]*)"'
)


def utc_now():
    return datetime.now(timezone.utc)


def iso_now():
    return utc_now().isoformat()


def init_analytics_store(app):
    ensure_db(app)


def get_db_path(app):
    return app.config.get("ANALYTICS_DB_PATH") or "/app/data/analytics.sqlite3"


def connect(app):
    db_path = Path(get_db_path(app))
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA busy_timeout = 5000")
    return conn


def ensure_db(app):
    with connect(app) as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS analytics_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_hash TEXT UNIQUE,
                occurred_at TEXT NOT NULL,
                event_type TEXT NOT NULL,
                source TEXT NOT NULL,
                visitor_id TEXT NOT NULL,
                session_id TEXT NOT NULL,
                ip TEXT,
                ip_hash TEXT,
                method TEXT,
                status_code INTEGER,
                path TEXT,
                page_url TEXT,
                title TEXT,
                referrer TEXT,
                user_agent TEXT,
                browser_name TEXT,
                browser_version TEXT,
                os_name TEXT,
                os_version TEXT,
                device_type TEXT,
                device_brand TEXT,
                device_model TEXT,
                country_code TEXT,
                country_name TEXT,
                region TEXT,
                city TEXT,
                latitude REAL,
                longitude REAL,
                timezone TEXT,
                asn INTEGER,
                as_org TEXT,
                traffic_class TEXT NOT NULL,
                bot_name TEXT,
                bot_reason TEXT,
                screen_width INTEGER,
                screen_height INTEGER,
                viewport_width INTEGER,
                viewport_height INTEGER,
                language TEXT,
                timezone_offset INTEGER,
                metadata TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_events_occurred_at
                ON analytics_events (occurred_at);
            CREATE INDEX IF NOT EXISTS idx_events_traffic
                ON analytics_events (traffic_class, occurred_at);
            CREATE INDEX IF NOT EXISTS idx_events_visitor
                ON analytics_events (visitor_id, occurred_at);
            CREATE INDEX IF NOT EXISTS idx_events_session
                ON analytics_events (session_id, occurred_at);

            CREATE TABLE IF NOT EXISTS visitor_sessions (
                session_id TEXT PRIMARY KEY,
                visitor_id TEXT NOT NULL,
                first_seen_at TEXT NOT NULL,
                last_seen_at TEXT NOT NULL,
                pageviews INTEGER NOT NULL DEFAULT 0,
                ip TEXT,
                user_agent TEXT,
                traffic_class TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS admin_login_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                attempted_at TEXT NOT NULL,
                ip TEXT,
                user_agent TEXT,
                success INTEGER NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_admin_attempts_ip_time
                ON admin_login_attempts (ip, attempted_at);

            CREATE TABLE IF NOT EXISTS nginx_import_state (
                source TEXT PRIMARY KEY,
                position INTEGER NOT NULL DEFAULT 0,
                updated_at TEXT NOT NULL
            );
            """
        )


def valid_uuid(value):
    if not value:
        return False
    try:
        uuid.UUID(str(value))
        return True
    except ValueError:
        return False


def get_or_create_visitor_id(request):
    visitor_id = request.cookies.get("visitor_id")
    if not valid_uuid(visitor_id):
        visitor_id = str(uuid.uuid4())
        return visitor_id, True
    return visitor_id, False


def normalized_session_id(value):
    if valid_uuid(value):
        return value
    return str(uuid.uuid4())


def client_ip_from_request(request):
    forwarded_for = request.headers.get("X-Forwarded-For", "")
    if forwarded_for:
        first_hop = forwarded_for.split(",")[0].strip()
        if first_hop:
            return first_hop
    real_ip = request.headers.get("X-Real-IP", "").strip()
    if real_ip:
        return real_ip
    return request.remote_addr


def hash_ip(ip):
    if not ip:
        return None
    return hashlib.sha256(ip.encode("utf-8")).hexdigest()


def parse_device(user_agent):
    if not user_agent:
        return {
            "browser_name": "Unknown",
            "browser_version": "",
            "os_name": "Unknown",
            "os_version": "",
            "device_type": "unknown",
            "device_brand": "",
            "device_model": "",
        }

    if parse_user_agent:
        parsed = parse_user_agent(user_agent)
        if parsed.is_bot:
            device_type = "bot"
        elif parsed.is_mobile:
            device_type = "mobile"
        elif parsed.is_tablet:
            device_type = "tablet"
        elif parsed.is_pc:
            device_type = "desktop"
        else:
            device_type = "other"

        return {
            "browser_name": parsed.browser.family or "Unknown",
            "browser_version": parsed.browser.version_string or "",
            "os_name": parsed.os.family or "Unknown",
            "os_version": parsed.os.version_string or "",
            "device_type": device_type,
            "device_brand": parsed.device.brand or "",
            "device_model": parsed.device.model or "",
        }

    ua = user_agent.lower()
    device_type = "desktop"
    if "mobile" in ua or "iphone" in ua or "android" in ua:
        device_type = "mobile"
    if "ipad" in ua or "tablet" in ua:
        device_type = "tablet"

    browser_name = "Unknown"
    if "firefox" in ua:
        browser_name = "Firefox"
    elif "edg/" in ua:
        browser_name = "Edge"
    elif "chrome" in ua:
        browser_name = "Chrome"
    elif "safari" in ua:
        browser_name = "Safari"

    os_name = "Unknown"
    if "windows" in ua:
        os_name = "Windows"
    elif "mac os" in ua or "macintosh" in ua:
        os_name = "macOS"
    elif "android" in ua:
        os_name = "Android"
    elif "iphone" in ua or "ipad" in ua:
        os_name = "iOS"
    elif "linux" in ua:
        os_name = "Linux"

    return {
        "browser_name": browser_name,
        "browser_version": "",
        "os_name": os_name,
        "os_version": "",
        "device_type": device_type,
        "device_brand": "",
        "device_model": "",
    }


def safe_int(value):
    if value in (None, ""):
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def normalize_path(path_or_url):
    if not path_or_url:
        return "/"
    try:
        parsed = urlsplit(path_or_url)
        if parsed.scheme or parsed.netloc:
            return parsed.path or "/"
    except ValueError:
        pass
    path = str(path_or_url).split("?", 1)[0]
    return path or "/"


def classify_traffic(path, user_agent, source="beacon", status_code=None):
    ua = (user_agent or "").lower()
    normalized_path = normalize_path(path)

    for pattern in SUSPICIOUS_PATH_PATTERNS:
        if re.match(pattern, normalized_path, flags=re.IGNORECASE):
            return {
                "traffic_class": "scanner",
                "bot_name": "Scanner",
                "bot_reason": f"suspicious_path:{normalized_path}",
            }

    for name, pattern in SCANNER_UA_PATTERNS:
        if re.search(pattern, ua, flags=re.IGNORECASE):
            return {
                "traffic_class": "scanner",
                "bot_name": name,
                "bot_reason": f"scanner_user_agent:{name}",
            }

    for name, pattern in BOT_UA_PATTERNS:
        if re.search(pattern, ua, flags=re.IGNORECASE):
            return {
                "traffic_class": "known_bot",
                "bot_name": name,
                "bot_reason": f"bot_user_agent:{name}",
            }

    if not ua:
        return {
            "traffic_class": "likely_bot",
            "bot_name": "Unknown",
            "bot_reason": "empty_user_agent",
        }

    if source == "nginx" and status_code and int(status_code) >= 400:
        return {
            "traffic_class": "likely_bot",
            "bot_name": "Unknown",
            "bot_reason": f"nginx_only_error_status:{status_code}",
        }

    return {
        "traffic_class": "human",
        "bot_name": None,
        "bot_reason": None,
    }


@lru_cache(maxsize=4)
def get_geo_reader(path):
    if not geoip2 or not path or not os.path.exists(path):
        return None
    return geoip2.database.Reader(path)


def private_or_invalid_ip(ip):
    if not ip:
        return True
    try:
        parsed = ip_address(ip)
    except ValueError:
        return True
    return parsed.is_private or parsed.is_loopback or parsed.is_link_local


def enrich_ip(app, ip):
    enrichment = {
        "country_code": None,
        "country_name": None,
        "region": None,
        "city": None,
        "latitude": None,
        "longitude": None,
        "timezone": None,
        "asn": None,
        "as_org": None,
    }

    if private_or_invalid_ip(ip):
        return enrichment

    db_dir = Path(app.config.get("MAXMIND_DB_DIR") or "/app/data/geoip")
    city_reader = get_geo_reader(str(db_dir / "GeoLite2-City.mmdb"))
    asn_reader = get_geo_reader(str(db_dir / "GeoLite2-ASN.mmdb"))

    if city_reader:
        try:
            response = city_reader.city(ip)
            enrichment.update(
                {
                    "country_code": response.country.iso_code,
                    "country_name": response.country.name,
                    "region": response.subdivisions.most_specific.name,
                    "city": response.city.name,
                    "latitude": response.location.latitude,
                    "longitude": response.location.longitude,
                    "timezone": response.location.time_zone,
                }
            )
        except Exception:
            pass

    if asn_reader:
        try:
            response = asn_reader.asn(ip)
            enrichment.update(
                {
                    "asn": response.autonomous_system_number,
                    "as_org": response.autonomous_system_organization,
                }
            )
        except Exception:
            pass

    return enrichment


def maxmind_status(app):
    db_dir = Path(app.config.get("MAXMIND_DB_DIR") or "/app/data/geoip")
    return {
        "city_db": (db_dir / "GeoLite2-City.mmdb").exists(),
        "asn_db": (db_dir / "GeoLite2-ASN.mmdb").exists(),
        "geoip2_installed": bool(geoip2),
    }


def record_event(app, event):
    ensure_db(app)
    now = iso_now()
    event.setdefault("occurred_at", now)
    event.setdefault("metadata", {})
    event_hash = event.get("event_hash")
    metadata_json = json.dumps(event.get("metadata") or {}, sort_keys=True)

    fields = [
        "event_hash",
        "occurred_at",
        "event_type",
        "source",
        "visitor_id",
        "session_id",
        "ip",
        "ip_hash",
        "method",
        "status_code",
        "path",
        "page_url",
        "title",
        "referrer",
        "user_agent",
        "browser_name",
        "browser_version",
        "os_name",
        "os_version",
        "device_type",
        "device_brand",
        "device_model",
        "country_code",
        "country_name",
        "region",
        "city",
        "latitude",
        "longitude",
        "timezone",
        "asn",
        "as_org",
        "traffic_class",
        "bot_name",
        "bot_reason",
        "screen_width",
        "screen_height",
        "viewport_width",
        "viewport_height",
        "language",
        "timezone_offset",
        "metadata",
    ]
    values = [metadata_json if field == "metadata" else event.get(field) for field in fields]

    with connect(app) as conn:
        placeholders = ", ".join(["?"] * len(fields))
        columns = ", ".join(fields)
        sql = f"INSERT OR IGNORE INTO analytics_events ({columns}) VALUES ({placeholders})"
        cursor = conn.execute(sql, values)
        inserted = cursor.rowcount > 0

        if inserted and event.get("event_type") == "pageview":
            conn.execute(
                """
                INSERT INTO visitor_sessions (
                    session_id, visitor_id, first_seen_at, last_seen_at,
                    pageviews, ip, user_agent, traffic_class
                )
                VALUES (?, ?, ?, ?, 1, ?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    last_seen_at = excluded.last_seen_at,
                    pageviews = visitor_sessions.pageviews + 1,
                    ip = excluded.ip,
                    user_agent = excluded.user_agent,
                    traffic_class = excluded.traffic_class
                """,
                (
                    event.get("session_id"),
                    event.get("visitor_id"),
                    event.get("occurred_at"),
                    event.get("occurred_at"),
                    event.get("ip"),
                    event.get("user_agent"),
                    event.get("traffic_class"),
                ),
            )

    return inserted


def build_pageview_event(app, request, payload, visitor_id):
    path = normalize_path(payload.get("path") or payload.get("url") or request.referrer)
    ip = client_ip_from_request(request)
    user_agent = request.headers.get("User-Agent", "")
    device = parse_device(user_agent)
    enrichment = enrich_ip(app, ip)
    classification = classify_traffic(path, user_agent, source="beacon")
    session_id = normalized_session_id(payload.get("session_id"))

    event = {
        "event_hash": payload.get("event_id"),
        "occurred_at": iso_now(),
        "event_type": "pageview",
        "source": "beacon",
        "visitor_id": visitor_id,
        "session_id": session_id,
        "ip": ip,
        "ip_hash": hash_ip(ip),
        "method": request.method,
        "status_code": 200,
        "path": path,
        "page_url": payload.get("url"),
        "title": payload.get("title"),
        "referrer": payload.get("referrer"),
        "user_agent": user_agent,
        "screen_width": safe_int(payload.get("screen_width")),
        "screen_height": safe_int(payload.get("screen_height")),
        "viewport_width": safe_int(payload.get("viewport_width")),
        "viewport_height": safe_int(payload.get("viewport_height")),
        "language": payload.get("language"),
        "timezone_offset": safe_int(payload.get("timezone_offset")),
        "metadata": {
            "timezone": payload.get("timezone"),
            "color_depth": payload.get("color_depth"),
            "hardware_concurrency": payload.get("hardware_concurrency"),
            "device_memory": payload.get("device_memory"),
        },
    }
    event.update(device)
    event.update(enrichment)
    event.update(classification)
    return event


def record_admin_login_attempt(app, ip, user_agent, success):
    ensure_db(app)
    with connect(app) as conn:
        conn.execute(
            """
            INSERT INTO admin_login_attempts (attempted_at, ip, user_agent, success)
            VALUES (?, ?, ?, ?)
            """,
            (iso_now(), ip, user_agent, 1 if success else 0),
        )


def too_many_failed_admin_attempts(app, ip, window_minutes=15, limit=5):
    ensure_db(app)
    since = (utc_now() - timedelta(minutes=window_minutes)).isoformat()
    with connect(app) as conn:
        row = conn.execute(
            """
            SELECT COUNT(*) AS count
            FROM admin_login_attempts
            WHERE ip = ? AND attempted_at >= ? AND success = 0
            """,
            (ip, since),
        ).fetchone()
    return row["count"] >= limit


def traffic_where_clause(traffic):
    if traffic == "human":
        return "traffic_class = 'human' AND event_type = 'pageview'", []
    if traffic == "bot":
        return "traffic_class IN ('known_bot', 'likely_bot', 'scanner')", []
    return "1 = 1", []


def date_where_clause(days):
    since = (utc_now() - timedelta(days=days)).isoformat()
    return "occurred_at >= ?", [since]


def fetch_grouped(conn, where_sql, params, column, limit=10):
    rows = conn.execute(
        f"""
        SELECT COALESCE(NULLIF({column}, ''), 'Unknown') AS label, COUNT(*) AS count
        FROM analytics_events
        WHERE {where_sql}
        GROUP BY label
        ORDER BY count DESC, label ASC
        LIMIT ?
        """,
        [*params, limit],
    ).fetchall()
    return [dict(row) for row in rows]


def fetch_stats(app, traffic="human", days=30):
    ensure_db(app)
    imported = import_nginx_logs(app)
    traffic_sql, traffic_params = traffic_where_clause(traffic)
    date_sql, date_params = date_where_clause(days)
    where_sql = f"{traffic_sql} AND {date_sql}"
    params = [*traffic_params, *date_params]

    with connect(app) as conn:
        totals = conn.execute(
            f"""
            SELECT
                COUNT(*) AS events,
                SUM(CASE WHEN event_type = 'pageview' THEN 1 ELSE 0 END) AS pageviews,
                COUNT(DISTINCT visitor_id) AS unique_visitors,
                COUNT(DISTINCT session_id) AS sessions,
                SUM(CASE WHEN traffic_class = 'human' THEN 1 ELSE 0 END) AS human_events,
                SUM(CASE WHEN traffic_class IN ('known_bot', 'likely_bot', 'scanner') THEN 1 ELSE 0 END) AS bot_events
            FROM analytics_events
            WHERE {where_sql}
            """,
            params,
        ).fetchone()

        timeseries_rows = conn.execute(
            f"""
            SELECT
                substr(occurred_at, 1, 10) AS date,
                COUNT(*) AS events,
                SUM(CASE WHEN event_type = 'pageview' THEN 1 ELSE 0 END) AS pageviews,
                COUNT(DISTINCT visitor_id) AS visitors
            FROM analytics_events
            WHERE {where_sql}
            GROUP BY date
            ORDER BY date ASC
            """,
            params,
        ).fetchall()

        recent_rows = conn.execute(
            f"""
            SELECT *
            FROM analytics_events
            WHERE {where_sql}
            ORDER BY occurred_at DESC
            LIMIT 50
            """,
            params,
        ).fetchall()

        breakdown = {
            "traffic_classes": fetch_grouped(conn, where_sql, params, "traffic_class", 10),
            "countries": fetch_grouped(conn, where_sql, params, "country_name", 12),
            "regions": fetch_grouped(conn, where_sql, params, "region", 12),
            "cities": fetch_grouped(conn, where_sql, params, "city", 12),
            "devices": fetch_grouped(conn, where_sql, params, "device_type", 10),
            "browsers": fetch_grouped(conn, where_sql, params, "browser_name", 10),
            "operating_systems": fetch_grouped(conn, where_sql, params, "os_name", 10),
            "pages": fetch_grouped(conn, where_sql, params, "path", 12),
            "referrers": fetch_grouped(conn, where_sql, params, "referrer", 12),
            "as_organizations": fetch_grouped(conn, where_sql, params, "as_org", 12),
        }

    totals_dict = dict(totals)
    return {
        "generated_at": iso_now(),
        "filters": {"traffic": traffic, "days": days},
        "totals": {key: totals_dict.get(key) or 0 for key in totals_dict.keys()},
        "timeseries": [dict(row) for row in timeseries_rows],
        "breakdown": breakdown,
        "recent_visits": [serialize_visit(row) for row in recent_rows],
        "enrichment": {
            "maxmind": maxmind_status(app),
            "nginx_import": imported,
        },
    }


def fetch_visits(app, traffic="human", days=30, limit=100):
    ensure_db(app)
    traffic_sql, traffic_params = traffic_where_clause(traffic)
    date_sql, date_params = date_where_clause(days)
    where_sql = f"{traffic_sql} AND {date_sql}"
    params = [*traffic_params, *date_params, min(max(limit, 1), 250)]

    with connect(app) as conn:
        rows = conn.execute(
            f"""
            SELECT *
            FROM analytics_events
            WHERE {where_sql}
            ORDER BY occurred_at DESC
            LIMIT ?
            """,
            params,
        ).fetchall()

    return [serialize_visit(row) for row in rows]


def serialize_visit(row):
    return {
        "id": row["id"],
        "occurred_at": row["occurred_at"],
        "event_type": row["event_type"],
        "source": row["source"],
        "visitor_id": row["visitor_id"],
        "session_id": row["session_id"],
        "ip": row["ip"],
        "path": row["path"],
        "referrer": row["referrer"],
        "user_agent": row["user_agent"],
        "browser": compact_version(row["browser_name"], row["browser_version"]),
        "os": compact_version(row["os_name"], row["os_version"]),
        "device_type": row["device_type"],
        "country": row["country_name"] or row["country_code"],
        "region": row["region"],
        "city": row["city"],
        "asn": row["asn"],
        "as_org": row["as_org"],
        "traffic_class": row["traffic_class"],
        "bot_name": row["bot_name"],
        "bot_reason": row["bot_reason"],
        "status_code": row["status_code"],
    }


def compact_version(name, version):
    if not name:
        return "Unknown"
    if version:
        return f"{name} {version}"
    return name


def should_import_nginx_entry(path, user_agent, status_code):
    normalized = normalize_path(path)
    if normalized.startswith("/api/analytics") or normalized.startswith("/api/admin"):
        return False
    if normalized == "/health":
        return False
    if normalized.lower().endswith(STATIC_EXTENSIONS):
        return False
    classification = classify_traffic(normalized, user_agent, source="nginx", status_code=status_code)
    return classification["traffic_class"] != "human"


def parse_nginx_request(request_text):
    parts = request_text.split()
    if len(parts) < 2:
        return None, None
    method = parts[0]
    path = normalize_path(parts[1])
    return method, path


def parse_nginx_time(value):
    try:
        return datetime.strptime(value, "%d/%b/%Y:%H:%M:%S %z").astimezone(timezone.utc).isoformat()
    except ValueError:
        return iso_now()


def get_import_position(conn, source):
    row = conn.execute(
        "SELECT position FROM nginx_import_state WHERE source = ?",
        (source,),
    ).fetchone()
    return row["position"] if row else 0


def save_import_position(conn, source, position):
    conn.execute(
        """
        INSERT INTO nginx_import_state (source, position, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(source) DO UPDATE SET
            position = excluded.position,
            updated_at = excluded.updated_at
        """,
        (source, position, iso_now()),
    )


def import_nginx_logs(app, max_lines=5000):
    ensure_db(app)
    log_path = app.config.get("NGINX_ACCESS_LOG_PATH") or "/app/nginx_logs/access.log"
    if not os.path.exists(log_path):
        return {"available": False, "imported": 0, "path": log_path}

    source = f"nginx:{log_path}"
    imported = 0
    total_seen = 0

    with connect(app) as conn:
        position = get_import_position(conn, source)
        size = os.path.getsize(log_path)
        if position > size:
            position = 0

        with open(log_path, "r", encoding="utf-8", errors="replace") as handle:
            handle.seek(position)
            for _ in range(max_lines):
                line = handle.readline()
                if not line:
                    break
                total_seen += 1
                event = nginx_line_to_event(app, line)
                if event:
                    cursor = insert_event_with_connection(conn, event)
                    if cursor.rowcount > 0:
                        imported += 1
            new_position = handle.tell()

        save_import_position(conn, source, new_position)

    return {"available": True, "imported": imported, "seen": total_seen, "path": log_path}


def nginx_line_to_event(app, line):
    match = NGINX_LOG_RE.match(line.strip())
    if not match:
        return None

    request_text = match.group("request")
    method, path = parse_nginx_request(request_text)
    if not method or not path:
        return None

    status_code = safe_int(match.group("status"))
    user_agent = match.group("user_agent")
    if not should_import_nginx_entry(path, user_agent, status_code):
        return None

    ip = match.group("ip")
    occurred_at = parse_nginx_time(match.group("time"))
    classification = classify_traffic(path, user_agent, source="nginx", status_code=status_code)
    device = parse_device(user_agent)
    enrichment = enrich_ip(app, ip)
    fingerprint = hashlib.sha256(line.encode("utf-8", errors="ignore")).hexdigest()
    visitor_key = hashlib.sha256(f"{ip}|{user_agent}".encode("utf-8")).hexdigest()[:24]
    session_key = hashlib.sha256(f"{ip}|{user_agent}|{occurred_at[:10]}".encode("utf-8")).hexdigest()[:24]

    event = {
        "event_hash": f"nginx:{fingerprint}",
        "occurred_at": occurred_at,
        "event_type": "request",
        "source": "nginx",
        "visitor_id": f"nginx:{visitor_key}",
        "session_id": f"nginx:{session_key}",
        "ip": ip,
        "ip_hash": hash_ip(ip),
        "method": method,
        "status_code": status_code,
        "path": path,
        "page_url": path,
        "title": None,
        "referrer": None if match.group("referrer") == "-" else match.group("referrer"),
        "user_agent": None if user_agent == "-" else user_agent,
        "metadata": {"body_bytes": match.group("body_bytes")},
    }
    event.update(device)
    event.update(enrichment)
    event.update(classification)
    return event


def insert_event_with_connection(conn, event):
    event.setdefault("metadata", {})
    fields = [
        "event_hash",
        "occurred_at",
        "event_type",
        "source",
        "visitor_id",
        "session_id",
        "ip",
        "ip_hash",
        "method",
        "status_code",
        "path",
        "page_url",
        "title",
        "referrer",
        "user_agent",
        "browser_name",
        "browser_version",
        "os_name",
        "os_version",
        "device_type",
        "device_brand",
        "device_model",
        "country_code",
        "country_name",
        "region",
        "city",
        "latitude",
        "longitude",
        "timezone",
        "asn",
        "as_org",
        "traffic_class",
        "bot_name",
        "bot_reason",
        "screen_width",
        "screen_height",
        "viewport_width",
        "viewport_height",
        "language",
        "timezone_offset",
        "metadata",
    ]
    values = [
        json.dumps(event.get(field) or {}, sort_keys=True) if field == "metadata" else event.get(field)
        for field in fields
    ]
    placeholders = ", ".join(["?"] * len(fields))
    columns = ", ".join(fields)
    return conn.execute(
        f"INSERT OR IGNORE INTO analytics_events ({columns}) VALUES ({placeholders})",
        values,
    )
