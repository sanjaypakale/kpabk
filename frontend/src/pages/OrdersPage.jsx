import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** Placeholder for Orders (common route for all roles). */
export default function OrdersPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h1" fontWeight={600}>
          Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Orders will be configured here.
        </Typography>
      </Stack>
    </Box>
  );
}
