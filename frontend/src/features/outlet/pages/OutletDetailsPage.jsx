import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Edit from '@mui/icons-material/Edit';
import Inventory from '@mui/icons-material/Inventory';
import { OutletBreadcrumbs } from '../components/OutletBreadcrumbs';
import { fetchOutletById, clearError, clearSelectedOutlet } from '../outletSlice';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Soft status chip to match list/dashboard style. */
function StatusChip({ value }) {
  const isActive = !!value;
  return (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      size="small"
      sx={{
        fontWeight: 500,
        fontSize: '0.75rem',
        ...(isActive
          ? { bgcolor: 'rgba(46, 125, 50, 0.1)', color: 'success.main' }
          : { bgcolor: 'grey.200', color: 'grey.700' }),
      }}
    />
  );
}

export function OutletDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedOutlet, actionLoading, error } = useSelector((state) => state.outlet);

  useEffect(() => {
    if (id) dispatch(fetchOutletById(id));
    return () => dispatch(clearSelectedOutlet());
  }, [id, dispatch]);

  const handleEdit = () => navigate(`/admin/outlets/${id}/edit`);
  const handleProducts = () => navigate(`/admin/outlets/${id}/products`);

  if (!id) return null;

  const addressLine = [
    selectedOutlet?.address,
    selectedOutlet?.city,
    selectedOutlet?.state,
    selectedOutlet?.pincode,
  ]
    .filter(Boolean)
    .join(', ') || '—';

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={3}>
        <OutletBreadcrumbs outletName={selectedOutlet?.outletName} />

        {error && (
          <Alert severity="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        {!selectedOutlet && (actionLoading || id) ? (
          <Card>
            <CardContent>
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        ) : selectedOutlet ? (
          <>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 0 }}>
                    Outlet details
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      startIcon={<Edit />}
                      variant="outlined"
                      size="medium"
                      onClick={handleEdit}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<Inventory />}
                      variant="contained"
                      size="medium"
                      onClick={handleProducts}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      Manage products
                    </Button>
                  </Stack>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" sx={{ mb: 0.5 }}>
                      Name
                    </Typography>
                    <Typography variant="body1">{selectedOutlet.outletName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" sx={{ mb: 0.5 }}>
                      Owner
                    </Typography>
                    <Typography variant="body1">{selectedOutlet.ownerName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" sx={{ mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body1">{selectedOutlet.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" sx={{ mb: 0.5 }}>
                      Phone
                    </Typography>
                    <Typography variant="body1">{selectedOutlet.phoneNumber || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" sx={{ mb: 0.5 }}>
                      Status
                    </Typography>
                    <StatusChip value={selectedOutlet.isActive} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" sx={{ mb: 0.5 }}>
                      Created
                    </Typography>
                    <Typography variant="body1">{formatDate(selectedOutlet.createdAt)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" sx={{ mb: 0.5 }}>
                      Address
                    </Typography>
                    <Typography variant="body1">{addressLine}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Outlet products
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Assign and manage products for this outlet.
                </Typography>
                <Button variant="outlined" size="medium" startIcon={<Inventory />} onClick={handleProducts}>
                  Go to products
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent>
              <Typography color="text.secondary">Outlet not found.</Typography>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
}

export default OutletDetailsPage;
