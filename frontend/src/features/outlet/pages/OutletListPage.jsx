import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Search from '@mui/icons-material/Search';
import Refresh from '@mui/icons-material/Refresh';
import Add from '@mui/icons-material/Add';
import { OutletBreadcrumbs } from '../components/OutletBreadcrumbs';
import { OutletTable } from '../components/OutletTable';
import { fetchOutlets, deleteOutlet, clearError } from '../outletSlice';

export function OutletListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { outlets, listPagination, loading, error } = useSelector((state) => state.outlet);

  const [searchName, setSearchName] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const load = (params = {}) => {
    dispatch(
      fetchOutlets({
        page: params.page ?? listPagination.page,
        size: params.size ?? listPagination.size,
        isActive: params.isActive,
      })
    );
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (error) setSnackOpen(true);
  }, [error]);

  const handlePaginationChange = (p) => load(p);

  const filteredRows = searchName.trim()
    ? outlets.filter(
        (o) =>
          o.outletName?.toLowerCase().includes(searchName.toLowerCase()) ||
          o.ownerName?.toLowerCase().includes(searchName.toLowerCase()) ||
          o.email?.toLowerCase().includes(searchName.toLowerCase())
      )
    : outlets;

  const handleView = (id) => navigate(`/admin/outlets/${id}`);
  const handleEdit = (id) => navigate(`/admin/outlets/${id}/edit`);
  const handleCreate = () => navigate('/admin/outlets/new');

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const result = await dispatch(deleteOutlet(deleteId));
    setDeleteConfirmOpen(false);
    setDeleteId(null);
    if (deleteOutlet.fulfilled.match(result)) setSnackOpen(true);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
    dispatch(clearError());
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Stack spacing={3}>
        <OutletBreadcrumbs currentLabel="All outlets" />

        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} md="auto">
            <Typography variant="h5" component="h1" fontWeight={600}>
              Outlets
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
                placeholder="Search by name, owner, or email…"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                sx={{
                  width: { xs: '100%', md: 280 },
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
                Create Outlet
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
            {loading && outlets.length === 0 ? (
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 0 }} />
            ) : (
              <OutletTable
                rows={filteredRows}
                loading={loading}
                pagination={
                  searchName.trim()
                    ? { ...listPagination, totalElements: filteredRows.length }
                    : listPagination
                }
                onPaginationChange={handlePaginationChange}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            )}
          </Box>
        </Paper>
      </Stack>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete outlet?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Are you sure you want to delete this outlet?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        message={error || 'Outlet deleted'}
      />
    </Box>
  );
}

export default OutletListPage;
