import { Box, Divider, Link, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';
import { appointments, education, employment, grants, publications } from '../content/cv';

const sections = [
  { id: 'appointments', title: 'Postdoctoral Research Appointments', shortTitle: 'Appointments' },
  { id: 'education', title: 'Education', shortTitle: 'Education' },
  { id: 'grants', title: 'Grants and Fellowships', shortTitle: 'Grants & Fellowships' },
  { id: 'publications', title: 'Publications', shortTitle: 'Publications' },
  { id: 'employment', title: 'Other Employment', shortTitle: 'Employment' },
];

function CvSection({ section, children }) {
  return (
    <Box
      component="section"
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '190px minmax(0, 1fr)' },
        gap: { xs: 2, md: 5 },
        py: { xs: 3, md: 4 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        scrollMarginTop: { xs: '88px', sm: '24px' },
      }}
    >
      <Typography
        component="h2"
        variant="h5"
        id={`${section.id}-heading`}
        sx={{ color: 'primary.main', fontWeight: 500, lineHeight: 1.4 }}
      >
        {section.title}
      </Typography>
      <Box sx={{ minWidth: 0 }}>{children}</Box>
    </Box>
  );
}

CvSection.propTypes = {
  section: PropTypes.shape({ id: PropTypes.string, title: PropTypes.string }).isRequired,
  children: PropTypes.node.isRequired,
};

function CvEntries({ entries }) {
  return (
    <Stack component="ul" spacing={3} sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {entries.map((entry) => (
        <Box
          component="li"
          key={`${entry.title}-${entry.dates}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) auto' },
            columnGap: 3,
            rowGap: 0.5,
          }}
        >
          <Box>
            <Typography component="h3" variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {entry.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
              {entry.organization}
            </Typography>
            {entry.details && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 0 }}>
                {entry.details}
                {entry.detailsLink && (
                  <>
                    {' '}
                    <Link href={entry.detailsLink.href} target="_blank" rel="noopener noreferrer" underline="hover">
                      {entry.detailsLink.label}
                    </Link>
                  </>
                )}
              </Typography>
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{ color: 'secondary.main', whiteSpace: 'nowrap', mb: 0, pt: { lg: 0.25 } }}
          >
            {entry.dates}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

CvEntries.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    organization: PropTypes.string.isRequired,
    dates: PropTypes.string.isRequired,
    details: PropTypes.string,
    detailsLink: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  })).isRequired,
};

export default function CvPage() {
  const { onContact } = useOutletContext();

  return (
    <Box sx={{ maxWidth: '1100px', mx: 'auto', pb: 4, overflowWrap: 'break-word' }}>
      <Box
        component="header"
        sx={{ bgcolor: 'background.paper', borderRadius: 3, p: { xs: 3, md: 4 }, mb: 3 }}
      >
        <Typography component="p" variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          Ashish Mehta, Ph.D.
        </Typography>
        <Typography component="h1" variant="h2" sx={{ mb: 2 }}>
          Curriculum Vitae
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
          <Link component="button" type="button" onClick={onContact} underline="hover" sx={{ fontSize: '1rem', textAlign: 'left' }}>
            Contact
          </Link>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
            Updated October 2026
          </Typography>
        </Stack>
      </Box>

      <Stack
        component="nav"
        aria-label="CV sections"
        direction="row"
        useFlexGap
        flexWrap="wrap"
        spacing={1}
        sx={{ mb: 2 }}
      >
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`#${section.id}`}
            underline="none"
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              fontSize: '0.875rem',
              '&:hover, &:focus-visible': { bgcolor: 'action.hover', textDecoration: 'underline' },
            }}
          >
            {section.shortTitle}
          </Link>
        ))}
      </Stack>
      <Divider />

      <CvSection section={sections[0]}>
        <CvEntries entries={appointments} />
      </CvSection>
      <CvSection section={sections[1]}>
        <CvEntries entries={education} />
      </CvSection>
      <CvSection section={sections[2]}>
        <CvEntries entries={grants} />
      </CvSection>
      <CvSection section={sections[3]}>
        <Box
          component="ol"
          sx={{
            m: 0,
            pl: 3,
            '& > li': { pl: 1, pb: 3, mb: 3, borderBottom: '1px solid', borderColor: 'divider' },
            '& > li:last-child': { pb: 0, mb: 0, borderBottom: 0 },
            '& > li::marker': { color: 'text.secondary', fontSize: '0.875rem' },
          }}
        >
          {publications.map((publication) => (
            <Box component="li" key={publication.title}>
              <Typography component="h3" variant="body1" sx={{ fontWeight: 600, mb: 0.75 }}>
                {publication.url ? (
                  <Link href={publication.url} target="_blank" rel="noopener noreferrer" underline="hover">
                    {publication.title}
                  </Link>
                ) : publication.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {publication.authors.split(/(Mehta, A\.)/).map((part, index) => (
                  part === 'Mehta, A.' ? <strong key={index}>{part}</strong> : part
                ))} ({publication.year}).
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 0 }}>
                {publication.venue}
              </Typography>
            </Box>
          ))}
        </Box>
      </CvSection>
      <CvSection section={sections[4]}>
        <CvEntries entries={employment} />
      </CvSection>

      <Box sx={{ pt: 3, textAlign: 'right' }}>
        <Link href="#" underline="hover" variant="body2">Back to top ↑</Link>
      </Box>
    </Box>
  );
}
