import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { UserBreadcrumbs } from '../components/UserBreadcrumbs';
import { fetchUserById, clearError } from '../userSlice';

export function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedUser, actionLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) dispatch(fetchUserById(id));
    return () => dispatch(clearError());
  }, [id, dispatch]);

  const handleEdit = () => navigate(`/admin/users/${id}/edit`);
  const handleBack = () => navigate('/admin/users');

  if (actionLoading && !selectedUser) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
        <UserBreadcrumbs currentLabel="User" />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
      </Box>
    );
  }

  if (!selectedUser) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
        <UserBreadcrumbs currentLabel="User" />
        <Typography color="text.secondary">User not found.</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>Back to users</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={3}>
        <UserBreadcrumbs userName={selectedUser.displayName || selectedUser.email} currentLabel="View" />

        <Typography variant="h5" component="h1" fontWeight={600}>
          {selectedUser.displayName || selectedUser.email}
        </Typography>

        {error && (
          <Typography color="error">{error}</Typography>
        )}

        <Stack spacing={1} sx={{ maxWidth: 400 }}>
          <Typography variant="body2"><strong>Email:</strong> {selectedUser.email ?? '—'}</Typography>
          <Typography variant="body2"><strong>Role:</strong> {String(selectedUser.role ?? '—')}</Typography>
          <Typography variant="body2"><strong>Outlet:</strong> {selectedUser.outletName ?? '—'}</Typography>
          <Typography variant="body2"><strong>Phone:</strong> {selectedUser.phone ?? '—'}</Typography>
          <Typography variant="body2"><strong>Status:</strong> {selectedUser.enabled ? 'Active' : 'Inactive'}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleEdit}>Edit</Button>
          <Button variant="outlined" onClick={handleBack}>Back to users</Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default UserDetailsPage;
