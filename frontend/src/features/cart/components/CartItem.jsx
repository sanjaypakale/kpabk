import { memo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';

const PLACEHOLDER_IMG =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Crect fill="%23f5f5f5" width="120" height="120"/%3E%3Ctext fill="%23bdbdbd" font-family="system-ui,sans-serif" font-size="12" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo image%3C/text%3E%3C/svg%3E';

const currencyFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Single cart line item: image, name, unit price, quantity controls, line total, delete.
 * Memoized to avoid re-renders when sibling items update.
 */
function CartItemComponent({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  isUpdating = false,
  isDeleting = false,
}) {
  const price = Number(item.basePrice) || 0;
  const qty = item.quantity ?? 1;
  const lineTotal = price * qty;
  const disabled = isUpdating || isDeleting;

  const handleIncrease = () => {
    if (disabled) return;
    onIncrease?.();
  };

  const handleDecrease = () => {
    if (disabled || qty <= 1) return;
    onDecrease?.();
  };

  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: grey[200],
        bgcolor: 'background.paper',
        overflow: 'hidden',
        opacity: isDeleting ? 0.7 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: '100%', sm: 120 },
          height: { xs: 140, sm: 120 },
          bgcolor: grey[50],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={item.imageUrl || PLACEHOLDER_IMG}
          alt={item.productName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMG;
          }}
        />
      </Box>
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          gap: 2,
          py: 2,
          px: 2,
          '&:last-child': { pb: 2 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="grey.900"
            sx={{ fontSize: '0.9375rem' }}
          >
            {item.productName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {currencyFormat.format(price)} per unit
            {(item.productType || item.unit) &&
              ` · ${[item.productType, item.unit].filter(Boolean).join(' · ')}`}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid',
              borderColor: grey[300],
              borderRadius: 1,
              bgcolor: grey[50],
            }}
          >
            <IconButton
              size="small"
              onClick={handleDecrease}
              disabled={disabled || qty <= 1}
              aria-label="Decrease quantity"
              sx={{ color: 'grey.700' }}
            >
              <Remove fontSize="small" />
            </IconButton>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ minWidth: 28, textAlign: 'center' }}
            >
              {isUpdating ? (
                <CircularProgress size={16} sx={{ display: 'block', mx: 'auto' }} />
              ) : (
                qty
              )}
            </Typography>
            <IconButton
              size="small"
              onClick={handleIncrease}
              disabled={disabled}
              aria-label="Increase quantity"
              sx={{ color: 'grey.700' }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="grey.900"
            sx={{ minWidth: 72, textAlign: 'right' }}
          >
            {currencyFormat.format(lineTotal)}
          </Typography>

          <IconButton
            size="small"
            onClick={() => onRemove?.()}
            disabled={disabled}
            aria-label="Remove from cart"
            sx={{
              color: 'error.main',
              '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' },
            }}
          >
            {isDeleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DeleteOutline fontSize="small" />
            )}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export const CartItem = memo(CartItemComponent);
export default CartItem;
