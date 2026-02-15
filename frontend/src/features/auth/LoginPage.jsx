import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { loginUser, clearError } from './authSlice';
import * as authService from './authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_REGISTER_PASSWORD_LENGTH = 8;

function validateEmail(email) {
  if (!email?.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Enter a valid email address';
  return null;
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}

function validateRegisterPassword(password) {
  if (!password) return 'Password is required';
  if (password.length < MIN_REGISTER_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_REGISTER_PASSWORD_LENGTH} characters`;
  }
  return null;
}

const initialRegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function getRegisterErrors(values, touched) {
  const err = {};
  if (touched.firstName) {
    if (!values.firstName?.trim()) err.firstName = 'First name is required';
  }
  if (touched.lastName) {
    if (!values.lastName?.trim()) err.lastName = 'Last name is required';
  }
  if (touched.email) {
    const e = validateEmail(values.email);
    if (e) err.email = e;
  }
  if (touched.password) {
    const p = validateRegisterPassword(values.password);
    if (p) err.password = p;
  }
  if (touched.confirmPassword) {
    if (!values.confirmPassword) err.confirmPassword = 'Confirm password is required';
    else if (values.password !== values.confirmPassword) err.confirmPassword = 'Passwords do not match';
  }
  return err;
}

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [registerTouched, setRegisterTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccessSnack, setRegisterSuccessSnack] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const registerErrors = getRegisterErrors(registerForm, registerTouched);
  const registerValid =
    registerForm.firstName?.trim() &&
    registerForm.lastName?.trim() &&
    !validateEmail(registerForm.email) &&
    !validateRegisterPassword(registerForm.password) &&
    registerForm.password === registerForm.confirmPassword;

  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;
  const isValid = !validateEmail(email) && !validatePassword(password);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;
    dispatch(loginUser({ email: email.trim(), password })).then((result) => {
      if (loginUser.fulfilled.match(result)) navigate('/dashboard', { replace: true });
    });
  };

  const openRegisterDialog = () => {
    setRegisterDialogOpen(true);
    setRegisterForm(initialRegisterForm);
    setRegisterTouched({
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
    setRegisterError(null);
  };

  const closeRegisterDialog = () => {
    if (!registerLoading) setRegisterDialogOpen(false);
  };

  const setRegisterField = (field) => (e) => {
    setRegisterForm((prev) => ({ ...prev, [field]: e.target.value }));
    setRegisterError(null);
  };

  const setRegisterBlur = (field) => () => {
    setRegisterTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const allTouched = {
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    };
    setRegisterTouched(allTouched);
    if (!registerValid) return;
    setRegisterLoading(true);
    setRegisterError(null);
    try {
      await authService.register({
        firstName: registerForm.firstName.trim(),
        lastName: registerForm.lastName.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
      });
      setRegisterDialogOpen(false);
      setRegisterSuccessSnack(true);
    } catch (err) {
      setRegisterError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 3,
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={0} sx={{ overflow: 'visible' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/" sx={{ display: 'inline-block' }}>
                  <Box
                    component="img"
                    src="/kpabk_logo.png"
                    alt="Kande Pohe - Company logo"
                    sx={{
                      maxWidth: 200,
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      mx: 'auto',
                    }}
                  />
                </Link>
                <Typography variant="h4" component="h1" color="primary" fontWeight={600} sx={{ mt: 2 }}>
                  KPABK Connect
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Sign in to continue
                </Typography>
              </Box>

              <form onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  {error && (
                    <Alert severity="error" onClose={() => dispatch(clearError())}>
                      {error}
                    </Alert>
                  )}

                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    error={!!emailError}
                    helperText={emailError}
                    autoComplete="email"
                    autoFocus
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    error={!!passwordError}
                    helperText={passwordError}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((s) => !s)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!isValid || loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ py: 1.5 }}
                  >
                    {loading ? 'Signing in…' : 'Sign in'}
                  </Button>

                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pt: 1 }}>
                    Don&apos;t have an account?{' '}
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      onClick={openRegisterDialog}
                      sx={{ cursor: 'pointer' }}
                    >
                      Register
                    </Link>
                  </Typography>
                </Stack>
              </form>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={registerDialogOpen} onClose={closeRegisterDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create account</DialogTitle>
        <form onSubmit={handleRegisterSubmit} noValidate>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 0 }}>
              {registerError && (
                <Alert severity="error" onClose={() => setRegisterError(null)}>
                  {registerError}
                </Alert>
              )}
              <TextField
                label="First name"
                value={registerForm.firstName}
                onChange={setRegisterField('firstName')}
                onBlur={setRegisterBlur('firstName')}
                error={!!registerErrors.firstName}
                helperText={registerErrors.firstName}
                autoComplete="given-name"
                required
                fullWidth
              />
              <TextField
                label="Last name"
                value={registerForm.lastName}
                onChange={setRegisterField('lastName')}
                onBlur={setRegisterBlur('lastName')}
                error={!!registerErrors.lastName}
                helperText={registerErrors.lastName}
                autoComplete="family-name"
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={registerForm.email}
                onChange={setRegisterField('email')}
                onBlur={setRegisterBlur('email')}
                error={!!registerErrors.email}
                helperText={registerErrors.email}
                autoComplete="email"
                required
                fullWidth
              />
              <TextField
                label="Password"
                type={showRegisterPassword ? 'text' : 'password'}
                value={registerForm.password}
                onChange={setRegisterField('password')}
                onBlur={setRegisterBlur('password')}
                error={!!registerErrors.password}
                helperText={registerErrors.password || `At least ${MIN_REGISTER_PASSWORD_LENGTH} characters`}
                autoComplete="new-password"
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowRegisterPassword((s) => !s)}
                        edge="end"
                      >
                        {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm password"
                type={showRegisterPassword ? 'text' : 'password'}
                value={registerForm.confirmPassword}
                onChange={setRegisterField('confirmPassword')}
                onBlur={setRegisterBlur('confirmPassword')}
                error={!!registerErrors.confirmPassword}
                helperText={registerErrors.confirmPassword}
                autoComplete="new-password"
                required
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeRegisterDialog} disabled={registerLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!registerValid || registerLoading}
              startIcon={registerLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {registerLoading ? 'Registering…' : 'Register'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={registerSuccessSnack}
        autoHideDuration={6000}
        onClose={() => setRegisterSuccessSnack(false)}
        message="Registration successful. You can sign in now."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}

export default LoginPage;
