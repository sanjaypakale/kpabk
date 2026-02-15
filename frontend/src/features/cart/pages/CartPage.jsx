import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import {
  fetchCart,
  updateCartItem,
  deleteCartItem,
  clearCartError,
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectUpdatingProductId,
  selectDeletingCartItemId,
} from '../index';
import { CartItem } from '../components/CartItem';
import { OrderSummary } from '../components/OrderSummary';
import { grey } from '@mui/material/colors';

/** Empty cart illustration (simple SVG). */
function EmptyCartIllustration() {
  return (
    <Box
      sx={{
        width: 160,
        height: 160,
        mx: 'auto',
        color: grey[400],
        '& svg': { width: '100%', height: '100%' },
      }}
    >
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="currentColor" opacity={0.08} />
        <path
          d="M40 42h42l-4 24H44L40 42z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.5}
        />
        <path
          d="M50 42c0-6 4.5-10 10-10s10 4 10 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
        />
        <circle cx="52" cy="68" r="3" fill="currentColor" opacity={0.4} />
        <circle cx="68" cy="68" r="3" fill="currentColor" opacity={0.4} />
      </svg>
    </Box>
  );
}

export function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const updatingProductId = useSelector(selectUpdatingProductId);
  const deletingCartItemId = useSelector(selectDeletingCartItemId);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleIncrease = useCallback(
    (item) => {
      dispatch(
        updateCartItem({
          productId: item.productId,
          quantity: (item.quantity ?? 1) + 1,
        })
      );
    },
    [dispatch]
  );

  const handleDecrease = useCallback(
    (item) => {
      const next = Math.max(1, (item.quantity ?? 1) - 1);
      dispatch(updateCartItem({ productId: item.productId, quantity: next }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (item) => {
      dispatch(deleteCartItem(item.id));
    },
    [dispatch]
  );

  const isEmpty = !loading && (!items || items.length === 0);

  return (
    <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, md: 3 } }}>
      <Typography variant="h5" fontWeight={600} color="grey.900" gutterBottom>
        Cart
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearCartError())}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 280,
          }}
        >
          <CircularProgress size={40} />
        </Box>
      ) : isEmpty ? (
        <Box
          sx={{
            py: 6,
            px: 2,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: grey[50],
            border: '1px dashed',
            borderColor: grey[300],
          }}
        >
          <EmptyCartIllustration />
          <Typography variant="h6" fontWeight={600} color="grey.700" sx={{ mt: 2 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 360, mx: 'auto' }}>
            Add products from the Products page to see them here. You can adjust quantities and
            remove items before checkout.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            sx={{ mt: 3, px: 3, py: 1.25, fontWeight: 600 }}
          >
            Browse products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={() => handleIncrease(item)}
                  onDecrease={() => handleDecrease(item)}
                  onRemove={() => handleRemove(item)}
                  isUpdating={updatingProductId === item.productId}
                  isDeleting={deletingCartItemId === item.id}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <OrderSummary />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default CartPage;
