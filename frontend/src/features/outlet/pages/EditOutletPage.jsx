import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { OutletBreadcrumbs } from '../components/OutletBreadcrumbs';
import { OutletForm } from '../components/OutletForm';
import { fetchOutletById, updateOutlet, clearError, clearSelectedOutlet } from '../outletSlice';

export function EditOutletPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedOutlet, actionLoading, error } = useSelector((state) => state.outlet);

  useEffect(() => {
    if (id) dispatch(fetchOutletById(id));
    return () => dispatch(clearSelectedOutlet());
  }, [id, dispatch]);

  const handleSubmit = (values) => {
    if (!id) return;
    dispatch(updateOutlet({ id: Number(id), body: values })).then((result) => {
      if (updateOutlet.fulfilled.match(result)) {
        navigate(`/admin/outlets/${id}`, { replace: true });
      }
    });
  };

  const handleCancel = () => navigate(`/admin/outlets/${id}`);

  const initialValues = selectedOutlet
    ? {
        outletName: selectedOutlet.outletName,
        ownerName: selectedOutlet.ownerName,
        email: selectedOutlet.email,
        phoneNumber: selectedOutlet.phoneNumber ?? '',
        address: selectedOutlet.address ?? '',
        city: selectedOutlet.city ?? '',
        state: selectedOutlet.state ?? '',
        pincode: selectedOutlet.pincode ?? '',
        isActive: !!selectedOutlet.isActive,
      }
    : null;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={3}>
        <OutletBreadcrumbs outletName={selectedOutlet?.outletName} currentLabel="Edit" />

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Edit outlet
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {!selectedOutlet && (actionLoading || id) ? (
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 1 }} />
            ) : (
              <OutletForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={actionLoading}
                submitLabel="Save"
              />
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

export default EditOutletPage;
