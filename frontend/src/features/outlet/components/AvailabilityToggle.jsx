import { useState } from 'react';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';

/**
 * Switch to toggle outlet product availability. Calls onToggle(outletId, productId, newValue).
 * Shows loading state while request is in flight.
 */
export function AvailabilityToggle({ outletId, productId, checked, onToggle, disabled }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newVal = e.target.checked;
    setLoading(true);
    try {
      await onToggle(outletId, productId, newVal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Switch
        checked={!!checked}
        onChange={handleChange}
        disabled={disabled || loading}
        color="primary"
        size="small"
      />
    </Box>
  );
}

export default AvailabilityToggle;
