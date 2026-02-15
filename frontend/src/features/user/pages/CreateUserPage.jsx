import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { UserBreadcrumbs } from '../components/UserBreadcrumbs';
import { UserForm } from '../components/UserForm';
import { createUser, clearError } from '../userSlice';
import { fetchOutlets } from '../../outlet/outletSlice';

export function CreateUserPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actionLoading, error } = useSelector((state) => state.user);
  const { outlets } = useSelector((state) => state.outlet);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSuccess, setSnackSuccess] = useState(false);

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
    dispatch(createUser(payload)).then((result) => {
      if (createUser.fulfilled.match(result)) {
        setSnackSuccess(true);
        setSnackOpen(true);
        navigate('/admin/users', { replace: true });
      }
    });
  };

  const handleCancel = () => navigate('/admin/users');

  const handleSnackClose = () => {
    setSnackOpen(false);
    dispatch(clearError());
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={3}>
        <UserBreadcrumbs currentLabel="New user" />

        <Card variant="outlined" sx={{ borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Create user
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
                mode="create"
                outlets={outlets}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={actionLoading}
                submitLabel="Create user"
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
          {snackSuccess ? 'User created successfully.' : error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CreateUserPage;
