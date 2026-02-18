import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import { grey } from '@mui/material/colors';
import { fetchOutlets } from '../../outlet/outletSlice';

/**
 * Outlet selector for checkout: lists all active outlets and allows
 * selecting one or multiple outlets to place the order for.
 * - value: array of outlet ids
 * - onChange: (ids: number[]) => void
 */
export function OutletSelector({ value = [], onChange, disabled = false }) {
  const dispatch = useDispatch();
  const { outlets, loading } = useSelector((state) => state.outlet);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && !outlets?.length) {
      dispatch(fetchOutlets({ isActive: true }));
      setInitialized(true);
    }
  }, [dispatch, initialized, outlets?.length]);

  const handleToggle = (id) => {
    if (disabled) return;
    const exists = value.includes(id);
    const next = exists ? value.filter((x) => x !== id) : [...value, id];
    onChange?.(next);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} color="grey.800" sx={{ mb: 0.5 }}>
        Deliver to outlet(s)
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        Select one or more outlets for this order.
      </Typography>

      {loading && !outlets?.length ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[1, 2].map((key) => (
            <Skeleton
              // eslint-disable-next-line react/no-array-index-key
              key={key}
              variant="rectangular"
              height={48}
              sx={{ borderRadius: 1.5 }}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: grey[200],
            bgcolor: grey[50],
            p: 1,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {(!outlets || outlets.length === 0) && (
            <Typography variant="body2" color="text.secondary">
              No outlets found.
            </Typography>
          )}
          <FormGroup>
            {outlets.map((o) => (
              <FormControlLabel
                key={o.id}
                control={
                  <Checkbox
                    size="small"
                    checked={value.includes(o.id)}
                    onChange={() => handleToggle(o.id)}
                    disabled={disabled}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {o.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {o.addressLine1}
                      {o.city ? `, ${o.city}` : ''}
                      {o.state ? `, ${o.state}` : ''}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </Box>
      )}
    </Box>
  );
}

export default OutletSelector;

