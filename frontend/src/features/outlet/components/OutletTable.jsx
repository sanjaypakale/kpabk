import { useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import MoreVert from '@mui/icons-material/MoreVert';
import Visibility from '@mui/icons-material/Visibility';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Soft status chip: low-opacity background, bold text (Stripe/Shopify style). */
function StatusChip({ value }) {
  const isActive = !!value;
  return (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        ...(isActive
          ? {
              bgcolor: 'rgba(46, 125, 50, 0.1)',
              color: 'success.main',
            }
          : {
              bgcolor: 'rgba(158, 158, 158, 0.12)',
              color: 'text.secondary',
            }),
      }}
    />
  );
}

/** Mobile card for a single outlet row. */
function OutletMobileCard({ row, onOpenMenu }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: '#f0f0f0',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        '&:last-of-type': { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <CardContent sx={{ py: 2, px: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {row.outletName ?? '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {row.ownerName ?? '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
              {row.email ?? '—'}
            </Typography>
            <Box sx={{ mt: 1.5 }}>
              <StatusChip value={row.isActive} />
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => onOpenMenu(e, row.id)}
            aria-label="Actions"
            sx={{ color: 'grey.600', flexShrink: 0 }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Outlets list: DataGrid on desktop (with responsive hidden columns), Card list on mobile.
 * Actions grouped in a single three-dot Menu.
 */
export function OutletTable({ rows, loading, pagination, onPaginationChange, onView, onEdit, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const page = pagination?.page ?? 0;
  const pageSize = pagination?.size ?? 20;
  const totalRows = pagination?.totalElements ?? 0;

  const handleMenuOpen = (e, id) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleAction = (action) => {
    if (menuRowId != null) {
      action(menuRowId);
      handleMenuClose();
    }
  };

  const columns = useMemo(
    () => [
      {
        field: 'outletName',
        headerName: 'Name',
        flex: 1,
        minWidth: 140,
        renderCell: ({ value }) => (
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
            {value ?? '—'}
          </Box>
        ),
      },
      {
        field: 'ownerName',
        headerName: 'Owner',
        flex: 1,
        minWidth: 120,
        renderCell: ({ value }) => (
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
            {value ?? '—'}
          </Box>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 160,
        renderCell: ({ value }) => (
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
            {value ?? '—'}
          </Box>
        ),
      },
      {
        field: 'phoneNumber',
        headerName: 'Phone',
        width: 130,
        valueGetter: (v) => v ?? '—',
      },
      {
        field: 'isActive',
        headerName: 'Status',
        width: 100,
        renderCell: ({ value }) => <StatusChip value={value} />,
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        width: 120,
        valueGetter: (value) => formatDate(value),
      },
      {
        field: 'actions',
        headerName: '',
        width: 56,
        sortable: false,
        filterable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ row }) => (
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, row.id)}
            aria-label="Actions"
            sx={{
              color: 'grey.600',
              '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [handleMenuOpen]
  );

  const columnVisibilityModel = useMemo(
    () => (isMobile ? { phoneNumber: false, createdAt: false } : {}),
    [isMobile]
  );

  const actionsMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      slotProps={{ paper: { elevation: 8, sx: { minWidth: 160 } } }}
    >
      <MenuItem onClick={() => handleAction(onView)}>
        <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
        <ListItemText>View</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleAction(onEdit)}>
        <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => handleAction(onDelete)}
        sx={{
          color: 'grey.700',
          '&:hover': { bgcolor: 'error.light', color: 'error.dark' },
        }}
      >
        <ListItemIcon sx={{ color: 'inherit' }}><Delete fontSize="small" /></ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );

  if (isMobile) {
    return (
      <Box sx={{ width: '100%' }}>
        {loading ? (
          <Box sx={{ p: 2 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={120} sx={{ mb: 1, borderRadius: 1 }} />
            ))}
          </Box>
        ) : (
          <Stack spacing={0} sx={{ borderTop: '1px solid #f0f0f0' }}>
            {rows.map((row) => (
              <OutletMobileCard key={row.id} row={row} onOpenMenu={handleMenuOpen} />
            ))}
          </Stack>
        )}
        {totalRows > rows.length && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            Showing {rows.length} of {totalRows}
          </Typography>
        )}
        {actionsMenu}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: 400 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        loading={loading}
        pageSizeOptions={[10, 20, 50]}
        paginationMode="server"
        rowCount={totalRows}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          onPaginationChange?.({ page: model.page, size: model.pageSize });
        }}
        disableRowSelectionOnClick
        autoHeight
        getRowHeight={() => 56}
        sx={{
          border: 'none',
          fontFamily: 'Inter, Roboto, sans-serif',
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
          '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'grey.50',
            borderBottom: '1px solid #e0e0e0',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'text.secondary',
          },
          '& .MuiDataGrid-row': {
            '&:hover': { bgcolor: 'action.hover' },
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f0f0f0',
          },
        }}
      />
      {actionsMenu}
    </Box>
  );
}

export default OutletTable;
