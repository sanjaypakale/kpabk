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
import { OutletBreadcrumbs } from '../components/OutletBreadcrumbs';
import { OutletForm } from '../components/OutletForm';
import { createOutlet, clearError } from '../outletSlice';

export function CreateOutletPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actionLoading, error } = useSelector((state) => state.outlet);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSuccess, setSnackSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      setSnackSuccess(false);
      setSnackOpen(true);
    }
  }, [error]);

  const handleSubmit = (values) => {
    dispatch(createOutlet(values)).then((result) => {
      if (createOutlet.fulfilled.match(result)) {
        setSnackSuccess(true);
        setSnackOpen(true);
        navigate(`/admin/outlets/${result.payload.id}`, { replace: true });
      }
    });
  };

  const handleCancel = () => navigate('/admin/outlets');

  const handleSnackClose = () => {
    setSnackOpen(false);
    dispatch(clearError());
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={3}>
        <OutletBreadcrumbs currentLabel="New outlet" />

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Create outlet
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <OutletForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={actionLoading}
              submitLabel="Create outlet"
            />
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
          {snackSuccess ? 'Outlet created successfully.' : error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CreateOutletPage;
