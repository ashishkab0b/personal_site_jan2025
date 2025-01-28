from flask import Blueprint, request, g, Response, jsonify, current_app
from datetime import timedelta, datetime, timezone
from zoneinfo import ZoneInfo

from functools import wraps

api_bp = Blueprint('api', __name__)


    