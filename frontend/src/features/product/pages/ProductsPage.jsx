import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * Products page placeholder. Cart button in the header is visible when you are on this page.
 * Full product requirements to be added later.
 */
export function ProductsPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h1" fontWeight={600}>
          Products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Product catalog and management will be configured here. Use the Cart button in the top bar to access the cart.
        </Typography>
      </Stack>
    </Box>
  );
}

export default ProductsPage;
