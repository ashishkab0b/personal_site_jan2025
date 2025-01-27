from flask import Blueprint, request, g, Response, jsonify, current_app
from datetime import timedelta, datetime, timezone
from zoneinfo import ZoneInfo

from functools import wraps

api_bp = Blueprint('api', __name__)


@api_bp.route('/get_calendar', methods=['POST'])
def api_route_example():
    data = request.get_json()
    day_num = data.get('day_num')
    
    # logic
    
    return jsonify({'status': 'success', 'data': 'example data'})
    