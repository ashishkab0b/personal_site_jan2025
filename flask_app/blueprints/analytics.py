from flask import Blueprint, current_app, jsonify, request

from analytics_store import (
    build_pageview_event,
    get_or_create_visitor_id,
    normalized_session_id,
    record_event,
)


analytics_bp = Blueprint("analytics", __name__)


def visitor_cookie_options():
    secure = bool(current_app.config.get("SESSION_COOKIE_SECURE"))
    return {
        "max_age": 60 * 60 * 24 * 365,
        "httponly": True,
        "secure": secure,
        "samesite": "Lax",
        "path": "/",
    }


@analytics_bp.route("/pageview", methods=["POST"])
def pageview():
    payload = request.get_json(silent=True) or {}
    visitor_id, is_new_visitor = get_or_create_visitor_id(request)
    event = build_pageview_event(current_app, request, payload, visitor_id)
    inserted = record_event(current_app, event)

    response = jsonify(
        {
            "ok": True,
            "inserted": inserted,
            "visitor_id": visitor_id,
            "session_id": event["session_id"],
            "is_new_visitor": is_new_visitor,
            "traffic_class": event["traffic_class"],
        }
    )
    response.set_cookie("visitor_id", visitor_id, **visitor_cookie_options())
    return response, 201 if inserted else 200


@analytics_bp.route("/activity", methods=["POST"])
def activity():
    payload = request.get_json(silent=True) or {}
    visitor_id, is_new_visitor = get_or_create_visitor_id(request)
    event = build_pageview_event(current_app, request, payload, visitor_id)
    event["event_type"] = payload.get("event_type") or "activity"
    event["session_id"] = normalized_session_id(payload.get("session_id"))
    inserted = record_event(current_app, event)

    response = jsonify(
        {
            "ok": True,
            "inserted": inserted,
            "visitor_id": visitor_id,
            "session_id": event["session_id"],
            "is_new_visitor": is_new_visitor,
            "traffic_class": event["traffic_class"],
        }
    )
    response.set_cookie("visitor_id", visitor_id, **visitor_cookie_options())
    return response, 201 if inserted else 200
