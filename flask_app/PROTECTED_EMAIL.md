# Protected direct email

Contact opens a Cloudflare Turnstile check. After verification, visitors see the
email address and can open their own email app. There is no contact form and the
site does not send messages on visitors' behalf.

The recipient remains in the backend's `MAIL_SUPPORT_RECIPIENT` setting. It is
absent from frontend source and builds. `/api/contact/config` returns only the
public widget key. `/api/contact/email` returns the address only after Cloudflare
validates a single-use token with the expected hostname and `contact-email`
action. Responses use `Cache-Control: no-store`. Invalid verification or service
outages do not reveal the address.

## Configuration

Add real keys for a **Managed** Turnstile widget to the server's
`flask_app/.env`:

```env
TURNSTILE_SITE_KEY=your-public-widget-key
TURNSTILE_SECRET_KEY=your-private-widget-secret
```

Allow `mehta.fyi` and `ashish.mehta.fyi` in the widget's hostname settings. The
backend additionally restricts verified hostnames to those two domains and their
`www` variants. Override with `TURNSTILE_ALLOWED_HOSTNAMES` (comma separated) if
the site moves. Do not put the secret or recipient in a `VITE_` variable.

The site key is fetched at runtime; backend recreation picks up rotated keys
without a frontend rebuild. The Flask Docker context excludes `.env` files.

## Development and tests

The local Vite server proxies `/api` to Flask on `127.0.0.1:8000`. Debug previews
on loopback use Cloudflare's public dummy keys when no keys are configured.
Dummy keys cannot activate production protection.

From `flask_app`, run `python -m unittest discover -s tests -v`. Tests mock
Cloudflare and send no email. Real production verification still needs a browser
check with a live widget. A visitor who completes verification can copy or share
the address, so this reduces automated harvesting rather than guaranteeing
secrecy.

[Cloudflare server-side verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
and [official testing keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
