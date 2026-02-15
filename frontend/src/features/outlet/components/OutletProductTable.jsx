import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Visibility from '@mui/icons-material/Visibility';
import { AvailabilityToggle } from './AvailabilityToggle';

function formatPrice(val) {
  if (val == null) return '—';
  return typeof val === 'number' ? `₹${val.toFixed(2)}` : `₹${Number(val).toFixed(2)}`;
}

/**
 * Rows: outlet product responses (productId, productName, basePrice, outletPrice, isAvailable, etc.).
 * outletId required for toggle and view.
 */
export function OutletProductTable({
  rows,
  loading,
  outletId,
  onToggleAvailability,
  onViewDetails,
}) {
  const columns = [
    { field: 'productName', headerName: 'Product Name', flex: 1, minWidth: 160 },
    {
      field: 'productId',
      headerName: 'SKU',
      width: 280,
      valueGetter: (v) => (v ? String(v) : '—'),
    },
    {
      field: 'outletPrice',
      headerName: 'Price',
      width: 110,
      valueGetter: (_, row) => row.outletPrice ?? row.basePrice,
      valueFormatter: ({ value }) => formatPrice(value),
    },
    {
      field: 'isAvailable',
      headerName: 'Available',
      width: 100,
      renderCell: ({ row }) => (
        <AvailabilityToggle
          outletId={outletId}
          productId={row.productId}
          checked={row.isAvailable}
          onToggle={onToggleAvailability}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Tooltip title="View details">
          <IconButton
            size="small"
            onClick={() => onViewDetails(row.productId)}
            aria-label="View details"
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', minHeight: 400 }}>
      <DataGrid
        getRowId={(row) => row.productId ?? row.id ?? row.productName}
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
          '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
        }}
      />
    </Box>
  );
}

export default OutletProductTable;
