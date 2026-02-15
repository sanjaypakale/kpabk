import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** Placeholder for Payments (common route for all roles). */
export default function PaymentsPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h1" fontWeight={600}>
          Payments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Payments will be configured here.
        </Typography>
      </Stack>
    </Box>
  );
}
