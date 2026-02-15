import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createDefaultValues = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'OUTLET',
  outletId: '',
  phone: '',
};

function getEditDefaultValues(user) {
  if (!user) return null;
  const role = user.role != null ? String(user.role) : 'OUTLET';
  const outletId = user.outletId != null && user.outletId !== '' ? String(user.outletId) : '';
  return {
    email: user.email ?? '',
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    role,
    outletId,
    phone: user.phone ?? '',
    enabled: user.enabled ?? true,
  };
}

/**
 * Shared user form for Create and Edit.
 * - Create: email, password, firstName, lastName, role, outletId, phone.
 * - Edit: email (read-only), firstName, lastName, role (read-only), outletId, phone, enabled (Active toggle).
 */
export function UserForm({
  mode = 'create',
  initialValues,
  outlets = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel,
}) {
  const isEdit = mode === 'edit';
  const defaults = isEdit ? getEditDefaultValues(initialValues) : createDefaultValues;
  const [values, setValues] = useState(defaults ?? createDefaultValues);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isEdit && initialValues) {
      setValues(getEditDefaultValues(initialValues));
    } else if (!isEdit) {
      setValues(createDefaultValues);
    }
  }, [isEdit, initialValues]);

  const handleChange = (field) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((prev) => {
      const next = { ...prev, [field]: v };
      if (field === 'role' && v !== 'OUTLET') next.outletId = '';
      return next;
    });
  };

  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const emailValid = values.email?.trim() && EMAIL_REGEX.test(values.email.trim());
  const passwordValid = !values.password || values.password.length >= 6;
  const roleStr = String(values.role ?? 'OUTLET');
  const roleValid = roleStr === 'ADMIN' || roleStr === 'OUTLET';
  const outletStr = values.outletId != null && values.outletId !== '' ? String(values.outletId) : '';
  const outletValid = roleStr !== 'OUTLET' || outletStr !== '';
  const isValid =
    emailValid &&
    (isEdit || (values.password && passwordValid)) &&
    roleValid &&
    outletValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true, role: true, outletId: true });
    if (!isValid) return;
    if (isEdit) {
      onSubmit({
        firstName: values.firstName?.trim() || null,
        lastName: values.lastName?.trim() || null,
        phone: values.phone?.trim() || null,
        role: roleStr,
        outletId:
          roleStr === 'OUTLET' && values.outletId
            ? Number(values.outletId)
            : roleStr === 'OUTLET'
              ? 0
              : null,
        enabled: values.enabled,
      });
    } else {
      onSubmit({
        email: values.email.trim(),
        password: values.password,
        firstName: values.firstName?.trim() || null,
        lastName: values.lastName?.trim() || null,
        role: values.role,
        outletId: values.role === 'OUTLET' && values.outletId ? Number(values.outletId) : null,
        phone: values.phone?.trim() || null,
      });
    }
  };

  const label = submitLabel ?? (isEdit ? 'Save changes' : 'Create user');

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Account / Login */}
      <Typography
        variant="subtitle2"
        color="text.secondary"
        fontWeight={600}
        sx={{ mb: 2, letterSpacing: '0.02em' }}
      >
        Account
      </Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email address"
            type="email"
            required
            fullWidth
            size="small"
            autoComplete="email"
            value={values.email ?? ''}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={touched.email && !emailValid}
            helperText={touched.email && !emailValid ? 'Enter a valid email address' : null}
            disabled={isEdit}
            InputProps={isEdit ? { sx: { bgcolor: 'grey.50' } } : undefined}
          />
        </Grid>
        {!isEdit && (
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              size="small"
              autoComplete="new-password"
              value={values.password ?? ''}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password && !passwordValid}
              helperText={
                touched.password && !passwordValid
                  ? 'Minimum 6 characters'
                  : 'Minimum 6 characters required'
              }
            />
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Profile */}
      <Typography
        variant="subtitle2"
        color="text.secondary"
        fontWeight={600}
        sx={{ mb: 2, letterSpacing: '0.02em' }}
      >
        Profile
      </Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First name"
            fullWidth
            size="small"
            autoComplete="given-name"
            value={values.firstName ?? ''}
            onChange={handleChange('firstName')}
            placeholder="e.g. John"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last name"
            fullWidth
            size="small"
            autoComplete="family-name"
            value={values.lastName ?? ''}
            onChange={handleChange('lastName')}
            placeholder="e.g. Doe"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            fullWidth
            size="small"
            type="tel"
            value={values.phone ?? ''}
            onChange={handleChange('phone')}
            placeholder="e.g. +91 98765 43210"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Role & access */}
      <Typography
        variant="subtitle2"
        color="text.secondary"
        fontWeight={600}
        sx={{ mb: 2, letterSpacing: '0.02em' }}
      >
        Role & access
      </Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" required>
            <InputLabel id="user-form-role-label">Role</InputLabel>
            <Select
              labelId="user-form-role-label"
              label="Role"
              value={roleStr}
              onChange={handleChange('role')}
              variant="outlined"
              MenuProps={{ disableScrollLock: true }}
              displayEmpty={false}
              renderValue={(v) => (v === 'ADMIN' ? 'Admin' : 'Outlet')}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="OUTLET">Outlet</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {roleStr === 'OUTLET' && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="user-form-outlet-label">Outlet</InputLabel>
              <Select
                labelId="user-form-outlet-label"
                label="Outlet"
                value={outletStr}
                onChange={handleChange('outletId')}
                variant="outlined"
                MenuProps={{ disableScrollLock: true }}
                displayEmpty
                renderValue={(v) => {
                  if (!v) return isEdit ? 'No outlet' : 'Select outlet';
                  const o = outlets.find((out) => String(out.id) === String(v));
                  return o ? (o.outletName ?? `Outlet ${o.id}`) : 'Select outlet';
                }}
              >
                <MenuItem value="">{isEdit ? 'No outlet' : 'Select outlet'}</MenuItem>
                {outlets.map((o) => (
                  <MenuItem key={o.id} value={String(o.id)}>
                    {o.outletName ?? `Outlet ${o.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {isEdit && (
          <Grid item xs={12}>
            <Box
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: 1,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={!!values.enabled}
                    onChange={handleChange('enabled')}
                    color="primary"
                    size="medium"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Active
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Inactive users cannot sign in.
                    </Typography>
                  </Box>
                }
                sx={{ m: 0 }}
              />
            </Box>
          </Grid>
        )}
      </Grid>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid || loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? 'Saving…' : label}
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}

export default UserForm;
