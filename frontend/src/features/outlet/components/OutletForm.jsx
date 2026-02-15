import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s-()]{10,20}$/;

function validateEmail(v) {
  if (!v?.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(v.trim())) return 'Enter a valid email address';
  return null;
}

function validatePhone(v) {
  if (!v?.trim()) return null;
  if (!PHONE_REGEX.test(v.trim())) return 'Enter a valid phone number';
  return null;
}

const defaultValues = {
  outletName: '',
  ownerName: '',
  email: '',
  phoneNumber: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  isActive: true,
};

export function OutletForm({ initialValues, onSubmit, onCancel, loading, submitLabel = 'Save' }) {
  const [values, setValues] = useState(initialValues ?? defaultValues);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setValues(initialValues ?? defaultValues);
  }, [initialValues]);

  const handleChange = (field) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [field]: v }));
  };

  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const emailError = touched.email ? validateEmail(values.email) : null;
  const phoneError = touched.phoneNumber ? validatePhone(values.phoneNumber) : null;
  const nameError = touched.outletName && !values.outletName?.trim() ? 'Outlet name is required' : null;
  const ownerError = touched.ownerName && !values.ownerName?.trim() ? 'Owner name is required' : null;

  const isValid =
    values.outletName?.trim() &&
    values.ownerName?.trim() &&
    !validateEmail(values.email) &&
    !validatePhone(values.phoneNumber);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      outletName: true,
      ownerName: true,
      email: true,
      phoneNumber: true,
    });
    if (!isValid) return;
    onSubmit({
      outletName: values.outletName.trim(),
      ownerName: values.ownerName.trim(),
      email: values.email.trim(),
      phoneNumber: values.phoneNumber?.trim() || null,
      address: values.address?.trim() || null,
      city: values.city?.trim() || null,
      state: values.state?.trim() || null,
      pincode: values.pincode?.trim() || null,
      isActive: !!values.isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 2 }}>
        Basic information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Outlet name"
            variant="outlined"
            size="small"
            value={values.outletName}
            onChange={handleChange('outletName')}
            onBlur={handleBlur('outletName')}
            error={!!nameError}
            helperText={nameError}
            required
            fullWidth
            placeholder="e.g. Downtown Store"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Owner name"
            size="small"
            value={values.ownerName}
            onChange={handleChange('ownerName')}
            onBlur={handleBlur('ownerName')}
            error={!!ownerError}
            helperText={ownerError}
            required
            fullWidth
            placeholder="Full name of owner"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 2 }}>
        Contact details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            type="email"
            size="small"
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={!!emailError}
            helperText={emailError}
            required
            fullWidth
            placeholder="outlet@example.com"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            size="small"
            value={values.phoneNumber}
            onChange={handleChange('phoneNumber')}
            onBlur={handleBlur('phoneNumber')}
            error={!!phoneError}
            helperText={phoneError}
            fullWidth
            placeholder="+91 98765 43210"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 2 }}>
        Address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Street address"
            variant="outlined"
            size="small"
            value={values.address}
            onChange={handleChange('address')}
            fullWidth
            multiline
            minRows={2}
            placeholder="Building, street, landmark"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="City"
            size="small"
            value={values.city}
            onChange={handleChange('city')}
            fullWidth
            placeholder="City"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="State"
            size="small"
            value={values.state}
            onChange={handleChange('state')}
            fullWidth
            placeholder="State"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Pincode"
            size="small"
            value={values.pincode}
            onChange={handleChange('pincode')}
            fullWidth
            placeholder="e.g. 400001"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
            Status
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={!!values.isActive}
                onChange={handleChange('isActive')}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                {values.isActive ? 'Outlet is active' : 'Outlet is inactive'}
              </Typography>
            }
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          {onCancel && (
            <Button
              type="button"
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ minWidth: 160 }}
          >
            {loading ? 'Creating…' : submitLabel}
          </Button>
        </Stack>
      </Box>
    </form>
  );
}

export default OutletForm;
