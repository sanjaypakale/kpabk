import { Link as RouterLink, useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const ADMIN_USERS = '/admin/users';

export function UserBreadcrumbs({ userName, currentLabel }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  const segments = [];
  if (pathnames[0] === 'admin') segments.push({ label: 'Admin', path: '/admin' });
  if (pathnames[1] === 'users') {
    segments.push({ label: 'Users', path: ADMIN_USERS });
    if (pathnames[2] === 'new') {
      segments.push({ label: 'New user', path: null });
    } else if (pathnames[2]) {
      const id = pathnames[2];
      segments.push({
        label: userName || `User ${id}`,
        path: `${ADMIN_USERS}/${id}`,
      });
      if (pathnames[3] === 'edit') segments.push({ label: 'Edit', path: null });
    }
  }

  if (currentLabel) {
    const last = segments[segments.length - 1];
    if (last && !last.path) last.label = currentLabel;
    else segments.push({ label: currentLabel, path: null });
  }

  return (
    <Breadcrumbs sx={{ mb: 2 }}>
      <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">
        Dashboard
      </Link>
      {segments.map((seg, i) =>
        seg.path && i < segments.length - 1 ? (
          <Link
            key={seg.path}
            component={RouterLink}
            to={seg.path}
            color="inherit"
            underline="hover"
          >
            {seg.label}
          </Link>
        ) : (
          <Typography key={i} color="text.primary">
            {seg.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}

export default UserBreadcrumbs;
