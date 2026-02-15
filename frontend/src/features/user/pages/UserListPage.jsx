import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Search from '@mui/icons-material/Search';
import Add from '@mui/icons-material/Add';
import { UserBreadcrumbs } from '../components/UserBreadcrumbs';
import { UserTable } from '../components/UserTable';
import { fetchUsers, clearError } from '../userSlice';

const ROLE_FILTER_ALL = '';

export function UserListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, listPagination, loading, error } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState(ROLE_FILTER_ALL);

  const load = (params = {}) => {
    dispatch(
      fetchUsers({
        page: params.page ?? listPagination.page,
        size: params.size ?? listPagination.size,
        role: roleFilter || undefined,
      })
    );
  };

  useEffect(() => {
    load({ page: 0 });
  }, [roleFilter]);

  const handlePaginationChange = (p) => load(p);

  const filteredRows = searchQuery.trim()
    ? users.filter(
        (u) =>
          (u.displayName && u.displayName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (u.firstName && u.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (u.lastName && u.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : users;

  const handleView = (id) => navigate(`/admin/users/${id}`);
  const handleEdit = (id) => navigate(`/admin/users/${id}/edit`);
  const handleCreate = () => navigate('/admin/users/new');

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={3}>
        <UserBreadcrumbs currentLabel="All users" />

        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md="auto">
            <Typography variant="h5" component="h1" fontWeight={600}>
              Users
            </Typography>
          </Grid>
          <Grid item xs={12} md="auto">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
                gap: 2,
              }}
            >
              <TextField
                size="small"
                placeholder="Search by name or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: { xs: '100%', md: 260 },
                  minWidth: 0,
                  flexShrink: 0,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'grey.50',
                    '& fieldset': {
                      borderColor: 'grey.300',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: 'grey.400',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '1.5px',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: 'grey.500' }}>
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="user-role-filter-label">Role</InputLabel>
                <Select
                  labelId="user-role-filter-label"
                  id="user-role-filter"
                  value={roleFilter}
                  label="Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                  sx={{
                    bgcolor: 'grey.50',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
                  }}
                >
                  <MenuItem value={ROLE_FILTER_ALL}>All</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="OUTLET">Outlet</MenuItem>
                </Select>
              </FormControl>
              <Button
                startIcon={<Add />}
                onClick={handleCreate}
                variant="contained"
                size="medium"
                sx={{
                  flexShrink: 0,
                  alignSelf: { xs: 'flex-start', md: 'center' },
                  px: 2,
                  py: 1,
                  minWidth: 0,
                  width: 'auto',
                }}
              >
                Create User
              </Button>
            </Box>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        <Paper
          variant="outlined"
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ overflowX: 'auto' }}>
            {loading && users.length === 0 ? (
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 0 }} />
            ) : (
              <UserTable
                rows={filteredRows}
                loading={loading}
                pagination={
                  searchQuery.trim()
                    ? { ...listPagination, totalElements: filteredRows.length }
                    : listPagination
                }
                onPaginationChange={handlePaginationChange}
                onView={handleView}
                onEdit={handleEdit}
              />
            )}
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}

export default UserListPage;
