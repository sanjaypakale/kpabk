import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { grey } from '@mui/material/colors';

const PRODUCT_TYPES = [
  { value: 'VEG', label: 'Veg' },
  { value: 'NON_VEG', label: 'Non-Veg' },
  { value: 'BEVERAGE', label: 'Beverage' },
  { value: 'SNACKS', label: 'Snacks' },
  { value: 'DESSERT', label: 'Dessert' },
  { value: 'OTHER', label: 'Other' },
];

const UNITS = [
  { value: 'PAC', label: 'Packets' },
  { value: 'KGS', label: 'Kg' },
  { value: 'SET', label: 'Set' },
  { value: 'PCS', label: 'Pieces' },
  { value: 'OTHER', label: 'Other' },
];

const PRICE_MIN = 0;
const PRICE_MAX = 5000;

/**
 * Sticky filter sidebar: Category, Price Range (slider), Product Type, Unit.
 * Used as sidebar content on desktop and inside a Drawer on mobile.
 */
export function FilterSidebar({
  categories = [],
  filters,
  onFiltersChange,
  loading = false,
}) {
  const { categoryId, priceRange, productType, unit } = filters;
  const [minPrice, maxPrice] = priceRange ?? [PRICE_MIN, PRICE_MAX];

  const handleCategoryChange = (e) => {
    onFiltersChange({ ...filters, categoryId: e.target.value || undefined });
  };

  const handlePriceChange = (_, value) => {
    onFiltersChange({ ...filters, priceRange: value });
  };

  const handleProductTypeChange = (e) => {
    onFiltersChange({ ...filters, productType: e.target.value || undefined });
  };

  const handleUnitChange = (e) => {
    onFiltersChange({ ...filters, unit: e.target.value || undefined });
  };

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="subtitle2" color="grey.700" fontWeight={600} sx={{ mb: 2 }}>
        Filters
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }} disabled={loading}>
        <InputLabel id="filter-category">Category</InputLabel>
        <Select
          labelId="filter-category"
          label="Category"
          value={categoryId || ''}
          onChange={handleCategoryChange}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="caption" color="grey.600" sx={{ display: 'block', mb: 1 }}>
        Price range
      </Typography>
      <Box sx={{ px: 1, mb: 2 }}>
        <Slider
          value={[minPrice, maxPrice]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `₹${v}`}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          disabled={loading}
          sx={{ color: 'primary.main' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" color="grey.500">₹{minPrice}</Typography>
          <Typography variant="caption" color="grey.500">₹{maxPrice}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <FormControl fullWidth size="small" sx={{ mb: 2 }} disabled={loading}>
        <InputLabel id="filter-type">Product type</InputLabel>
        <Select
          labelId="filter-type"
          label="Product type"
          value={productType || ''}
          onChange={handleProductTypeChange}
        >
          <MenuItem value="">All</MenuItem>
          {PRODUCT_TYPES.map((t) => (
            <MenuItem key={t.value} value={t.value}>
              {t.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" disabled={loading}>
        <InputLabel id="filter-unit">Unit</InputLabel>
        <Select
          labelId="filter-unit"
          label="Unit"
          value={unit || ''}
          onChange={handleUnitChange}
        >
          <MenuItem value="">All</MenuItem>
          {UNITS.map((u) => (
            <MenuItem key={u.value} value={u.value}>
              {u.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default FilterSidebar;
