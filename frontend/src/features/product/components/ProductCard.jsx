import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';

const placeholderSvg =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280"%3E%3Crect fill="%23fafafa" width="280" height="280"/%3E%3Ctext fill="%23bdbdbd" font-family="system-ui,sans-serif" font-size="14" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo image%3C/text%3E%3C/svg%3E';

/**
 * Product card for PLP: fixed 1:1 image area, bold price, 2-line description, Quick Add on hover.
 * Professional, minimal styling with consistent dimensions across all cards.
 */
export function ProductCard({ product, onAddToCart, isAddingToCart = false }) {
  const [hovered, setHovered] = useState(false);

  const { name, description, basePrice, productType, unit, imageUrl } = product;
  const price = basePrice != null ? Number(basePrice) : 0;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1.5,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: grey[200],
        bgcolor: 'background.paper',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          borderColor: grey[300],
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          minHeight: 0,
          overflow: 'hidden',
          bgcolor: grey[50],
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl || placeholderSvg}
          alt={name}
          onError={(e) => {
            e.target.src = placeholderSvg;
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.35s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: hovered || isAddingToCart ? 1 : 0,
            transition: 'opacity 0.2s ease',
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: 2,
            pt: 4,
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={handleAdd}
            disabled={isAddingToCart}
            startIcon={
              isAddingToCart ? (
                <CircularProgress size={16} color="inherit" sx={{ color: 'white' }} />
              ) : null
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              px: 2,
              boxShadow: 2,
              minWidth: 120,
              '&:hover': { boxShadow: 3 },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.9)' },
            }}
          >
            {isAddingToCart ? 'Adding…' : 'Add to Cart'}
          </Button>
        </Box>
      </Box>
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          pt: 1.5,
          '&:last-child': { pb: 2 },
          minHeight: 128,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="grey.900"
          noWrap
          gutterBottom
          sx={{ fontSize: '1.0625rem', lineHeight: 1.4, letterSpacing: '0.01em' }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.9375rem',
            lineHeight: 1.5,
            flex: 1,
            minHeight: 42,
            color: grey[600],
            fontWeight: 400,
          }}
        >
          {description || '—'}
        </Typography>
        <Typography
          variant="h6"
          fontWeight={700}
          color="grey.900"
          sx={{ mt: 1.5, fontSize: '1.25rem', letterSpacing: '0.02em' }}
        >
          {formattedPrice}
        </Typography>
        {(productType || unit) && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.5,
              fontSize: '0.8125rem',
              color: grey[600],
              fontWeight: 500,
            }}
          >
            {[productType, unit].filter(Boolean).join(' · ')}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default ProductCard;
