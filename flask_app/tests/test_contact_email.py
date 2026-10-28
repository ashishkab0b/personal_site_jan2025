import unittest
from unittest.mock import patch

from flask import Flask
import requests

from blueprints.contact import contact_bp, TEST_SITE_KEY, TEST_SECRET_KEY


class ProtectedEmailTests(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config.update(
            TESTING=True, DEBUG=False,
            TURNSTILE_SITE_KEY='public-widget-key',
            TURNSTILE_SECRET_KEY='private-widget-secret',
            TURNSTILE_ALLOWED_HOSTNAMES={'ashish.mehta.fyi'},
            MAIL_SUPPORT_RECIPIENT='private-address@example.com',
        )
        self.app.register_blueprint(contact_bp, url_prefix='/api')
        self.client = self.app.test_client()
        self.verify = self.enterContext(patch('blueprints.contact.requests.post'))
        self.verify.return_value.json.return_value = {
            'success': True, 'hostname': 'ashish.mehta.fyi', 'action': 'contact-email',
        }

    def reveal(self, token='test-token'):
        return self.client.post('/api/contact/email', json={'turnstileToken': token})

    def assert_private(self, response):
        self.assertNotIn('private-address@example.com', response.get_data(as_text=True))
        self.assertNotIn('private-widget-secret', response.get_data(as_text=True))
        self.assertEqual(response.headers['Cache-Control'], 'no-store')

    def test_config_exposes_only_public_site_key(self):
        response = self.client.get('/api/contact/config')
        self.assertEqual(response.json, {'siteKey': 'public-widget-key'})
        self.assert_private(response)

    def test_get_cannot_reveal_address(self):
        self.assertEqual(self.client.get('/api/contact/email').status_code, 405)

    def test_missing_malformed_and_oversized_tokens_cannot_reveal(self):
        for token in [None, '', ' ', 123, {}, 'x' * 2049]:
            with self.subTest(token_type=type(token).__name__):
                response = self.reveal(token)
                self.assertEqual(response.status_code, 400)
                self.assert_private(response)
        self.verify.assert_not_called()

    def test_invalid_json_payloads_cannot_reveal(self):
        for payload in [None, [], 'text']:
            response = self.client.post('/api/contact/email', json=payload)
            self.assertEqual(response.status_code, 400)
            self.assert_private(response)
        self.verify.assert_not_called()

    def test_oversized_request_cannot_reveal(self):
        response = self.reveal('x' * 5000)
        self.assertEqual(response.status_code, 413)
        self.assert_private(response)

    def test_unconfigured_production_is_closed(self):
        self.app.config['TURNSTILE_SECRET_KEY'] = ''
        self.assertEqual(self.client.get('/api/contact/config').status_code, 503)
        response = self.reveal()
        self.assertEqual(response.status_code, 503)
        self.assert_private(response)
        self.verify.assert_not_called()

    def test_production_rejects_dummy_keys(self):
        self.app.config.update(TURNSTILE_SITE_KEY=TEST_SITE_KEY, TURNSTILE_SECRET_KEY=TEST_SECRET_KEY)
        response = self.reveal()
        self.assertEqual(response.status_code, 503)
        self.assert_private(response)
        self.verify.assert_not_called()

    def test_only_local_debug_can_use_fallback_test_keys(self):
        self.app.config.update(DEBUG=True, TURNSTILE_SITE_KEY='', TURNSTILE_SECRET_KEY='')
        self.assertEqual(self.client.get('/api/contact/config').json, {'siteKey': TEST_SITE_KEY})
        self.assertEqual(self.client.get('/api/contact/config', base_url='https://ashish.mehta.fyi').status_code, 503)
        self.verify.return_value.json.return_value = {'success': True, 'hostname': 'example.com', 'action': None}
        self.assertEqual(self.reveal().status_code, 200)
        self.assertEqual(self.verify.call_args.kwargs['data']['secret'], TEST_SECRET_KEY)

    def test_failed_expired_and_replayed_tokens_cannot_reveal(self):
        for errors in [['invalid-input-response'], ['timeout-or-duplicate']]:
            self.verify.return_value.json.return_value = {'success': False, 'error-codes': errors}
            response = self.reveal()
            self.assertEqual(response.status_code, 400)
            self.assert_private(response)

    def test_wrong_hostname_or_action_cannot_reveal(self):
        for host, action in [('other.example.com', 'contact-email'), ('ashish.mehta.fyi', 'contact'), ([], 'contact-email')]:
            self.verify.return_value.json.return_value = {'success': True, 'hostname': host, 'action': action}
            response = self.reveal()
            self.assertEqual(response.status_code, 400)
            self.assert_private(response)

    def test_malformed_service_response_cannot_reveal(self):
        self.verify.return_value.json.return_value = []
        response = self.reveal()
        self.assertEqual(response.status_code, 400)
        self.assert_private(response)

    def test_service_outage_cannot_reveal(self):
        self.verify.side_effect = requests.Timeout()
        response = self.reveal()
        self.assertEqual(response.status_code, 503)
        self.assert_private(response)

    def test_valid_token_reveals_configured_address_without_caching(self):
        response = self.reveal()
        self.assertEqual(response.json, {'email': 'private-address@example.com'})
        self.assertEqual(response.headers['Cache-Control'], 'no-store')
        self.verify.assert_called_once_with(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            data={'secret': 'private-widget-secret', 'response': 'test-token'},
            timeout=(3.05, 5),
        )

    def test_contact_form_endpoint_is_removed(self):
        self.assertEqual(self.client.post('/api/send_email', json={}).status_code, 404)


if __name__ == '__main__':
    unittest.main()
