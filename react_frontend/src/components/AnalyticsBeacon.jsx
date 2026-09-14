import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const SESSION_ID_KEY = 'mehta_site_session_id';

function randomId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (char) =>
    (Number(char) ^ (Math.random() * 16 >> (Number(char) / 4))).toString(16),
  );
}

function getSessionId() {
  try {
    const existing = window.sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) {
      return existing;
    }
    const created = randomId();
    window.sessionStorage.setItem(SESSION_ID_KEY, created);
    return created;
  } catch {
    return randomId();
  }
}

export default function AnalyticsBeacon() {
  const location = useLocation();
  const sentPaths = useRef(new Set());

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const path = `${location.pathname}${location.search}${location.hash}`;
    if (sentPaths.current.has(path)) {
      return;
    }
    sentPaths.current.add(path);

    const payload = {
      event_id: randomId(),
      session_id: getSessionId(),
      path,
      url: window.location.href,
      title: document.title,
      referrer: document.referrer || null,
      screen_width: window.screen?.width,
      screen_height: window.screen?.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      language: window.navigator?.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezone_offset: new Date().getTimezoneOffset(),
      color_depth: window.screen?.colorDepth,
      hardware_concurrency: window.navigator?.hardwareConcurrency,
      device_memory: window.navigator?.deviceMemory,
    };

    window
      .fetch('/api/analytics/pageview', {
        method: 'POST',
        credentials: 'include',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      .catch(() => {});
  }, [location.pathname, location.search, location.hash]);

  return null;
}
