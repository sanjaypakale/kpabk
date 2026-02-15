import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Skeleton from '@mui/material/Skeleton';
import { UserBreadcrumbs } from '../components/UserBreadcrumbs';
import { UserForm } from '../components/UserForm';
import { fetchUserById, updateUser, setUserEnabled, clearError } from '../userSlice';
import { fetchOutlets } from '../../outlet/outletSlice';

export function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedUser, actionLoading, error } = useSelector((state) => state.user);
  const { outlets } = useSelector((state) => state.outlet);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSuccess, setSnackSuccess] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchUserById(id));
    return () => dispatch(clearError());
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchOutlets({ page: 0, size: 500 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackSuccess(false);
      setSnackOpen(true);
    }
  }, [error]);

  const handleSubmit = (payload) => {
    const { enabled, ...updateBody } = payload;
    const enabledChanged = selectedUser && enabled !== selectedUser.enabled;

    dispatch(
      updateUser({
        id: Number(id),
        body: {
          firstName: updateBody.firstName,
          lastName: updateBody.lastName,
          phone: updateBody.phone,
          role: updateBody.role ?? undefined,
          outletId: updateBody.outletId,
        },
      })
    ).then((updateResult) => {
      if (!updateUser.fulfilled.match(updateResult)) return;
      if (enabledChanged) {
        return dispatch(setUserEnabled({ id: Number(id), enabled })).then((enabledResult) => {
          if (setUserEnabled.fulfilled.match(enabledResult)) {
            setSnackSuccess(true);
            setSnackOpen(true);
            navigate('/admin/users', { replace: true });
          }
        });
      }
      setSnackSuccess(true);
      setSnackOpen(true);
      navigate('/admin/users', { replace: true });
    });
  };

  const handleCancel = () => navigate('/admin/users');

  const handleSnackClose = () => {
    setSnackOpen(false);
    dispatch(clearError());
  };

  if (actionLoading && !selectedUser) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
        <UserBreadcrumbs currentLabel="Edit" />
        <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (!selectedUser) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
        <UserBreadcrumbs currentLabel="Edit" />
        <Typography color="text.secondary">User not found.</Typography>
        <Button onClick={handleCancel} sx={{ mt: 2 }} variant="outlined">
          Back to users
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={3}>
        <UserBreadcrumbs
          userName={selectedUser.displayName || selectedUser.email}
          currentLabel="Edit"
        />

        <Card variant="outlined" sx={{ borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Edit user
            </Typography>

            {error && (
              <Alert
                severity="error"
                onClose={() => dispatch(clearError())}
                sx={{ mb: 3 }}
              >
                {error}
              </Alert>
            )}

            <Box sx={{ maxWidth: 640 }}>
              <UserForm
                mode="edit"
                initialValues={selectedUser}
                outlets={outlets}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={actionLoading}
                submitLabel="Save changes"
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackSuccess ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackSuccess ? 'User updated successfully.' : error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditUserPage;
