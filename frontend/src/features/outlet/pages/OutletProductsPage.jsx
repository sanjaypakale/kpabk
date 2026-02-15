import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { OutletBreadcrumbs } from '../components/OutletBreadcrumbs';
import { OutletProductTable } from '../components/OutletProductTable';
import {
  fetchOutletById,
  fetchOutletProducts,
  fetchOutletProductById,
  toggleProductAvailability,
  clearError,
  clearSelectedOutlet,
  clearSelectedProduct,
} from '../outletSlice';

function formatPrice(val) {
  if (val == null) return '—';
  return `₹${Number(val).toFixed(2)}`;
}

export function OutletProductsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const outletId = id ? Number(id) : null;

  const {
    selectedOutlet,
    outletProducts,
    selectedProduct,
    loading,
    actionLoading,
    error,
  } = useSelector((state) => state.outlet);

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  useEffect(() => {
    if (outletId) {
      dispatch(fetchOutletById(outletId));
      dispatch(fetchOutletProducts(outletId));
    }
    return () => {
      dispatch(clearSelectedOutlet());
      dispatch(clearSelectedProduct());
    };
  }, [outletId, dispatch]);

  useEffect(() => {
    if (error) {
      setSnackMessage(error);
      setSnackOpen(true);
    }
  }, [error]);

  const handleToggleAvailability = async (outId, productId, available) => {
    const result = await dispatch(toggleProductAvailability({ outletId: outId, productId, available }));
    if (toggleProductAvailability.fulfilled.match(result)) {
      setSnackMessage(available ? 'Product marked available' : 'Product marked unavailable');
      setSnackOpen(true);
    } else {
      setSnackMessage(result.payload || 'Update failed');
      setSnackOpen(true);
    }
  };

  const handleViewDetails = (productId) => {
    if (!outletId) return;
    dispatch(fetchOutletProductById({ outletId, productId }));
    setProductDialogOpen(true);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
    dispatch(clearError());
  };

  if (!outletId) return null;

  return (
    <Box sx={{ p: 2 }}>
      <OutletBreadcrumbs outletName={selectedOutlet?.outletName} currentLabel="Products" />

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button startIcon={<ArrowBack />} size="small" onClick={() => navigate(`/admin/outlets/${outletId}`)}>
          Back to outlet
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Outlet products — {selectedOutlet?.outletName ?? `Outlet ${outletId}`}
          </Typography>

          {loading && outletProducts.length === 0 ? (
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
          ) : (
            <OutletProductTable
              rows={outletProducts}
              loading={loading}
              outletId={outletId}
              onToggleAvailability={handleToggleAvailability}
              onViewDetails={handleViewDetails}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={productDialogOpen} onClose={() => setProductDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Product details
          {actionLoading && ' (loading…)'}
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Product name</Typography>
                <Typography>{selectedProduct.productName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">SKU / Product ID</Typography>
                <Typography>{String(selectedProduct.productId ?? '—')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Price</Typography>
                <Typography>{formatPrice(selectedProduct.outletPrice ?? selectedProduct.basePrice)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography>{selectedProduct.categoryName || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Available</Typography>
                <Box>
                  <Chip
                    label={selectedProduct.isAvailable ? 'Yes' : 'No'}
                    size="small"
                    color={selectedProduct.isAvailable ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Description</Typography>
                <Typography>{selectedProduct.description || '—'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose} message={snackMessage} />
    </Box>
  );
}

export default OutletProductsPage;
