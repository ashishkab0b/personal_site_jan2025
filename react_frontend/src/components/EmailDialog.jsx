import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Typography, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';

let scriptPromise;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => resolve(window.turnstile);
      script.onerror = () => {
        scriptPromise = undefined;
        script.remove();
        reject(new Error('Verification could not load. Please try again.'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export default function EmailDialog({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [attempt, setAttempt] = useState(0);
  const compact = useMediaQuery('(max-width:420px)');
  const container = useRef(null);

  useEffect(() => {
    if (!open || email) return;
    let cancelled = false;
    let widgetId;
    const controller = new AbortController();
    setError('');
    setStatus('Loading verification…');

    async function prepare() {
      try {
        const { data } = await axios.get('/api/contact/config', { signal: controller.signal });
        if (!data.siteKey) throw new Error('Verification unavailable');
        const turnstile = await loadTurnstile();
        if (cancelled || !container.current) return;
        widgetId = turnstile.render(container.current, {
          sitekey: data.siteKey,
          action: 'contact-email',
          theme: 'dark',
          size: compact ? 'compact' : 'normal',
          callback: async (token) => {
            if (cancelled) return;
            setError('');
            setStatus('Verifying…');
            try {
              const response = await axios.post('/api/contact/email', { turnstileToken: token }, { signal: controller.signal });
              if (cancelled) return;
              if (typeof response.data.email !== 'string' || !response.data.email.includes('@')) throw new Error('Invalid response');
              setEmail(response.data.email);
              setStatus('');
            } catch (failure) {
              if (cancelled) return;
              setStatus('');
              setError(failure.response?.data?.error || 'Could not verify. Please try again.');
            }
          },
          'expired-callback': () => {
            if (!cancelled) setAttempt(value => value + 1);
          },
          'error-callback': () => {
            if (cancelled) return;
            setStatus('');
            setError('Verification could not finish. Please try again.');
          },
        });
        setStatus('');
      } catch (failure) {
        if (cancelled) return;
        setStatus('');
        setError(failure.response?.data?.error || 'Verification could not load. Please try again.');
      }
    }

    prepare();
    return () => {
      cancelled = true;
      controller.abort();
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [open, email, compact, attempt]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="email-title">
      <DialogTitle id="email-title">Email Ashish</DialogTitle>
      <DialogContent>
        {email ? (
          <Link href={`mailto:${email}`} sx={{ overflowWrap: 'anywhere' }}>{email}</Link>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary">Complete this quick check to see my email address.</Typography>
            <Box ref={container} sx={{ minHeight: 65 }} />
            {status && <Typography role="status" variant="body2" sx={{ mt: 1, mb: 0 }}>{status}</Typography>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
        {!email && error && <Button onClick={() => setAttempt(value => value + 1)}>Try again</Button>}
      </DialogActions>
    </Dialog>
  );
}

EmailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
