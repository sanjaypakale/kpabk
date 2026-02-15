import { Link as RouterLink, useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const ADMIN_OUTLETS = '/admin/outlets';

/**
 * Breadcrumb for outlet admin: Outlets > [current label].
 * Use pathSegment to derive current page (e.g. 'new', ':id', ':id/edit', ':id/products').
 */
export function OutletBreadcrumbs({ outletName, currentLabel }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  const segments = [];
  if (pathnames[0] === 'admin') segments.push({ label: 'Admin', path: '/admin' });
  if (pathnames[1] === 'outlets') {
    segments.push({ label: 'Outlets', path: ADMIN_OUTLETS });
    if (pathnames[2] === 'new') {
      segments.push({ label: 'New outlet', path: null });
    } else if (pathnames[2]) {
      const id = pathnames[2];
      segments.push({
        label: outletName || `Outlet ${id}`,
        path: `${ADMIN_OUTLETS}/${id}`,
      });
      if (pathnames[3] === 'edit') segments.push({ label: 'Edit', path: null });
      else if (pathnames[3] === 'products') segments.push({ label: 'Products', path: null });
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

export default OutletBreadcrumbs;
