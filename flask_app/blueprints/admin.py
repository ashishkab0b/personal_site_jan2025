from functools import wraps

from flask import Blueprint, current_app, jsonify, request, session
from werkzeug.security import check_password_hash

from analytics_store import (
    client_ip_from_request,
    fetch_stats,
    fetch_visits,
    record_admin_login_attempt,
    too_many_failed_admin_attempts,
)


admin_bp = Blueprint("admin", __name__)


def admin_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("admin_authenticated"):
            return jsonify({"error": "Unauthorized"}), 401
        return view(*args, **kwargs)

    return wrapped


def parse_days():
    try:
        days = int(request.args.get("days", 30))
    except ValueError:
        days = 30
    return min(max(days, 1), 3650)


def parse_traffic():
    traffic = request.args.get("traffic", "human")
    if traffic not in {"human", "bot", "all"}:
        return "human"
    return traffic


@admin_bp.route("/login", methods=["POST"])
def login():
    payload = request.get_json(silent=True) or {}
    password = payload.get("password") or ""
    ip = client_ip_from_request(request)
    user_agent = request.headers.get("User-Agent", "")

    if too_many_failed_admin_attempts(current_app, ip):
        record_admin_login_attempt(current_app, ip, user_agent, False)
        return jsonify({"error": "Too many failed login attempts"}), 429

    password_hash = current_app.config.get("ADMIN_PASSWORD_HASH")
    if not password_hash:
        record_admin_login_attempt(current_app, ip, user_agent, False)
        return jsonify({"error": "Admin password hash is not configured"}), 503

    success = check_password_hash(password_hash, password)
    record_admin_login_attempt(current_app, ip, user_agent, success)
    if not success:
        return jsonify({"error": "Invalid password"}), 401

    session.clear()
    session.permanent = True
    session["admin_authenticated"] = True
    session["admin_login_ip"] = ip
    return jsonify({"authenticated": True}), 200


@admin_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"authenticated": False}), 200


@admin_bp.route("/me", methods=["GET"])
def me():
    return jsonify({"authenticated": bool(session.get("admin_authenticated"))}), 200


@admin_bp.route("/stats", methods=["GET"])
@admin_required
def stats():
    return jsonify(fetch_stats(current_app, traffic=parse_traffic(), days=parse_days())), 200


@admin_bp.route("/visits", methods=["GET"])
@admin_required
def visits():
    try:
        limit = int(request.args.get("limit", 100))
    except ValueError:
        limit = 100
    return (
        jsonify(
            {
                "visits": fetch_visits(
                    current_app,
                    traffic=parse_traffic(),
                    days=parse_days(),
                    limit=limit,
                )
            }
        ),
        200,
    )
