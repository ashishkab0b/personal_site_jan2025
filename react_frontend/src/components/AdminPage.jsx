/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    throw error;
  }
  return data;
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(value || 0);
}

function formatDate(value) {
  if (!value) {
    return 'Unknown';
  }
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function safeLabel(value) {
  if (!value || value === '-') {
    return 'Direct / unknown';
  }
  return value;
}

function metricLabel(key) {
  return key.replace(/_/g, ' ');
}

function MetricTile({ label, value }) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 1,
        minHeight: 104,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Typography variant="h3" sx={{ fontSize: '1.9rem', lineHeight: 1.1 }}>
        {formatNumber(value)}
      </Typography>
    </Paper>
  );
}

function BreakdownList({ title, items }) {
  const max = useMemo(
    () => Math.max(1, ...(items || []).map((item) => item.count || 0)),
    [items],
  );

  return (
    <Paper sx={{ p: 2, borderRadius: 1 }}>
      <Typography variant="h3" sx={{ fontSize: '1.05rem', mb: 1.5 }}>
        {title}
      </Typography>
      <Stack spacing={1}>
        {(items || []).length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No data
          </Typography>
        ) : (
          items.map((item) => (
            <Box
              key={`${title}-${item.label}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(96px, 1fr) minmax(80px, 2fr) auto',
                gap: 1,
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" noWrap title={safeLabel(item.label)}>
                {safeLabel(item.label)}
              </Typography>
              <Box
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${Math.max(4, ((item.count || 0) / max) * 100)}%`,
                    bgcolor: 'secondary.main',
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(item.count)}
              </Typography>
            </Box>
          ))
        )}
      </Stack>
    </Paper>
  );
}

function TrafficChip({ value }) {
  const color =
    value === 'human'
      ? 'success'
      : value === 'scanner'
        ? 'error'
        : value === 'known_bot'
          ? 'warning'
          : 'default';

  return <Chip size="small" label={value || 'unknown'} color={color} variant="outlined" />;
}

function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      setPassword('');
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 3,
          borderRadius: 1,
        }}
      >
        <Typography variant="h2" sx={{ fontSize: '1.45rem', mb: 2 }}>
          Admin
        </Typography>
        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<LoginIcon />}
            disabled={submitting}
          >
            {submitting ? 'Signing in' : 'Sign in'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

function RecentVisitsTable({ visits }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Class</TableCell>
            <TableCell>IP</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Device</TableCell>
            <TableCell>Path</TableCell>
            <TableCell>Referrer</TableCell>
            <TableCell>Reason</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(visits || []).map((visit) => (
            <TableRow key={visit.id} hover>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(visit.occurred_at)}</TableCell>
              <TableCell>
                <TrafficChip value={visit.traffic_class} />
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{visit.ip || 'Unknown'}</TableCell>
              <TableCell>
                {[visit.city, visit.region, visit.country].filter(Boolean).join(', ') || 'Unknown'}
              </TableCell>
              <TableCell>
                {[visit.device_type, visit.browser, visit.os].filter(Boolean).join(' / ')}
              </TableCell>
              <TableCell sx={{ maxWidth: 220 }} title={visit.path || ''}>
                <Typography variant="body2" noWrap>
                  {visit.path || '/'}
                </Typography>
              </TableCell>
              <TableCell sx={{ maxWidth: 220 }} title={visit.referrer || ''}>
                <Typography variant="body2" noWrap>
                  {safeLabel(visit.referrer)}
                </Typography>
              </TableCell>
              <TableCell sx={{ maxWidth: 260 }} title={visit.bot_reason || ''}>
                <Typography variant="body2" noWrap>
                  {visit.bot_reason || visit.as_org || ''}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function EnrichmentStatus({ enrichment }) {
  const maxmind = enrichment?.maxmind || {};
  const nginx = enrichment?.nginx_import || {};
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      <Chip
        size="small"
        label={maxmind.city_db ? 'GeoLite2 City active' : 'GeoLite2 City missing'}
        color={maxmind.city_db ? 'success' : 'default'}
        variant="outlined"
      />
      <Chip
        size="small"
        label={maxmind.asn_db ? 'GeoLite2 ASN active' : 'GeoLite2 ASN missing'}
        color={maxmind.asn_db ? 'success' : 'default'}
        variant="outlined"
      />
      <Chip
        size="small"
        label={nginx.available ? `nginx import: ${nginx.imported || 0}` : 'nginx log unavailable'}
        color={nginx.available ? 'success' : 'default'}
        variant="outlined"
      />
    </Stack>
  );
}

function Dashboard({ onLogout }) {
  const [traffic, setTraffic] = useState('human');
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest(`/api/admin/stats?traffic=${traffic}&days=${days}`);
      setStats(data);
    } catch (err) {
      if (err.status === 401) {
        onLogout();
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [days, onLogout, traffic]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const totals = stats?.totals || {};
  const breakdown = stats?.breakdown || {};

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <Box>
            <Typography variant="h1" sx={{ fontSize: '2rem', mb: 0.5 }}>
              Admin Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generated {stats ? formatDate(stats.generated_at) : '...'}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <ToggleButtonGroup
              size="small"
              color="primary"
              exclusive
              value={traffic}
              onChange={(_, value) => value && setTraffic(value)}
            >
              <ToggleButton value="human">Human</ToggleButton>
              <ToggleButton value="bot">Bot</ToggleButton>
              <ToggleButton value="all">All</ToggleButton>
            </ToggleButtonGroup>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="days-label">Window</InputLabel>
              <Select
                labelId="days-label"
                value={days}
                label="Window"
                onChange={(event) => setDays(event.target.value)}
              >
                <MenuItem value={7}>7 days</MenuItem>
                <MenuItem value={30}>30 days</MenuItem>
                <MenuItem value={90}>90 days</MenuItem>
                <MenuItem value={365}>1 year</MenuItem>
                <MenuItem value={3650}>All time</MenuItem>
              </Select>
            </FormControl>
            <Button startIcon={<RefreshIcon />} onClick={loadStats} disabled={loading}>
              Refresh
            </Button>
            <Button startIcon={<LogoutIcon />} onClick={onLogout}>
              Logout
            </Button>
          </Stack>
        </Stack>

        {error ? <Alert severity="error">{error}</Alert> : null}
        <EnrichmentStatus enrichment={stats?.enrichment} />

        {loading && !stats ? (
          <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(6, minmax(0, 1fr))',
                },
                gap: 2,
              }}
            >
              {['events', 'pageviews', 'unique_visitors', 'sessions', 'human_events', 'bot_events'].map(
                (key) => (
                  <MetricTile key={key} label={metricLabel(key)} value={totals[key]} />
                ),
              )}
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              <BreakdownList title="Traffic classes" items={breakdown.traffic_classes} />
              <BreakdownList title="Countries" items={breakdown.countries} />
              <BreakdownList title="Cities" items={breakdown.cities} />
              <BreakdownList title="Devices" items={breakdown.devices} />
              <BreakdownList title="Browsers" items={breakdown.browsers} />
              <BreakdownList title="Operating systems" items={breakdown.operating_systems} />
              <BreakdownList title="Pages" items={breakdown.pages} />
              <BreakdownList title="Referrers" items={breakdown.referrers} />
              <BreakdownList title="Networks" items={breakdown.as_organizations} />
            </Box>

            <Box>
              <Typography variant="h2" sx={{ fontSize: '1.25rem', mb: 1.5 }}>
                Recent visits
              </Typography>
              <RecentVisitsTable visits={stats?.recent_visits || []} />
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const data = await apiRequest('/api/admin/me');
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setAuthenticated(false);
    }
  }, []);

  async function logout() {
    await apiRequest('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setAuthenticated(false);
  }

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (authenticated === null) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return <Dashboard onLogout={logout} />;
}
