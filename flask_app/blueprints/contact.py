from flask import Blueprint, current_app, jsonify, request
import requests


contact_bp = Blueprint('contact', __name__)
TEST_SITE_KEY = '1x00000000000000000000AA'
TEST_SECRET_KEY = '1x0000000000000000000000000000000AA'
UNAVAILABLE = 'Email verification is temporarily unavailable. Please try again later.'


def verification_settings():
    site = current_app.config.get('TURNSTILE_SITE_KEY', '')
    secret = current_app.config.get('TURNSTILE_SECRET_KEY', '')
    local_debug = current_app.debug and request.host.split(':')[0] in {'localhost', '127.0.0.1'}
    if local_debug and not site and not secret:
        return TEST_SITE_KEY, TEST_SECRET_KEY, True
    dummy = any(key.startswith(('1x000000', '2x000000', '3x000000')) for key in (site, secret))
    if not site or not secret or dummy or not current_app.config.get('MAIL_SUPPORT_RECIPIENT'):
        return None
    return site, secret, False


@contact_bp.after_request
def prevent_caching(response):
    response.headers['Cache-Control'] = 'no-store'
    return response


@contact_bp.route('/contact/config', methods=['GET'])
def contact_config():
    settings = verification_settings()
    if not settings:
        return jsonify({'error': UNAVAILABLE}), 503
    return jsonify({'siteKey': settings[0]})


@contact_bp.route('/contact/email', methods=['POST'])
def reveal_email():
    if request.content_length and request.content_length > 4096:
        return jsonify({'error': 'Invalid verification request.'}), 413
    data = request.get_json(silent=True)
    token = data.get('turnstileToken') if isinstance(data, dict) else None
    if not isinstance(token, str) or not token.strip() or len(token) > 2048:
        return jsonify({'error': 'Please complete verification to see the email address.'}), 400

    settings = verification_settings()
    if not settings:
        return jsonify({'error': UNAVAILABLE}), 503
    _, secret, test_mode = settings
    try:
        response = requests.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            data={'secret': secret, 'response': token},
            timeout=(3.05, 5),
        )
        response.raise_for_status()
        result = response.json()
    except (requests.RequestException, ValueError):
        current_app.logger.warning('Email verification service unavailable')
        return jsonify({'error': UNAVAILABLE}), 503

    valid = isinstance(result, dict) and result.get('success') is True
    if valid and not test_mode:
        hosts = current_app.config.get('TURNSTILE_ALLOWED_HOSTNAMES', set())
        action = 'contact-email'
        hostname = result.get('hostname')
        valid = isinstance(hostname, str) and hostname in hosts and result.get('action') == action
    if not valid:
        return jsonify({'error': 'Verification failed or expired. Please try again.'}), 400

    # The address only leaves the server after the token, hostname, and action pass.
    return jsonify({'email': current_app.config['MAIL_SUPPORT_RECIPIENT']})
