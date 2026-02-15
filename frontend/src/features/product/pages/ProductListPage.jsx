import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Search from '@mui/icons-material/Search';
import Clear from '@mui/icons-material/Clear';
import FilterList from '@mui/icons-material/FilterList';
import { fetchProductsApi, fetchCategoriesApi } from '../productService';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { addToCart } from '../../cart';

const PAGE_SIZE = 20;
const PRICE_MIN = 0;
const PRICE_MAX = 5000;

const defaultFilters = {
  searchQuery: '',
  categoryId: undefined,
  priceRange: [PRICE_MIN, PRICE_MAX],
  productType: undefined,
  unit: undefined,
};

const SEARCH_DEBOUNCE_MS = 320;

/**
 * Product Listing Page: sticky sidebar (desktop) / filter drawer (mobile), responsive grid, infinite scroll.
 */
export function ProductListPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [addingProductId, setAddingProductId] = useState(null);

  const sentinelRef = useRef(null);
  const filtersRef = useRef(filters);
  const searchDebounceRef = useRef(null);

  filtersRef.current = filters;

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const list = await fetchCategoriesApi();
      setCategories(list);
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const fetchPage = useCallback(async (pageNum, append = false) => {
    const f = filtersRef.current;
    const [minPrice, maxPrice] = f.priceRange ?? [PRICE_MIN, PRICE_MAX];
    const params = {
      page: pageNum,
      size: PAGE_SIZE,
      sortBy: 'name',
      sortDir: 'asc',
      name: f.searchQuery?.trim() || undefined,
      categoryId: f.categoryId,
      productType: f.productType,
      unit: f.unit,
      minPrice: minPrice > PRICE_MIN ? minPrice : undefined,
      maxPrice: maxPrice < PRICE_MAX ? maxPrice : undefined,
      isActive: true,
    };
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const result = await fetchProductsApi(params);
      const content = result?.content ?? [];
      const total = result?.totalPages ?? 0;
      setTotalPages(total);
      if (append) {
        setProducts((prev) => [...prev, ...content]);
      } else {
        setProducts(content);
      }
    } catch {
      if (!append) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(0);
    fetchPage(0, false);
  }, [filters.searchQuery, filters.categoryId, filters.productType, filters.unit, filters.priceRange?.join(',')]);

  useEffect(() => {
    setSearchInput(filters.searchQuery ?? '');
  }, [filters.searchQuery]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery: value }));
      searchDebounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
  }, []);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    if (nextPage >= totalPages || loadingMore || loading) return;
    setPage(nextPage);
    fetchPage(nextPage, true);
  }, [page, totalPages, loadingMore, loading, fetchPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) loadMore();
      },
      { rootMargin: '200px', threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleAddToCart = useCallback(
    async (product) => {
      if (!product?.id) return;
      setAddingProductId(product.id);
      const result = await dispatch(
        addToCart({ productId: product.id, quantity: 1 })
      );
      setAddingProductId(null);
      if (addToCart.fulfilled.match(result)) {
        setSnackbar({ open: true, message: 'Added to cart', severity: 'success' });
      } else {
        setSnackbar({
          open: true,
          message: result.payload || 'Failed to add to cart',
          severity: 'error',
        });
      }
    },
    [dispatch]
  );

  const handleSnackbarClose = useCallback((_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const sidebarContent = (
    <FilterSidebar
      categories={categories}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      loading={categoriesLoading}
    />
  );

  return (
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: 'background.default',
        pb: 4,
      }}
    >
      <Box sx={{ px: { xs: 2, md: 3 }, pt: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            <Typography variant="h5" component="h1" fontWeight={600} color="grey.900">
              Products
            </Typography>
            {!isDesktop && (
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDrawerOpen(true)}
                sx={{ textTransform: 'none', flexShrink: 0 }}
              >
                Filter
              </Button>
            )}
          </Box>
          <Box
            sx={{
              width: { xs: '100%', sm: 320 },
              maxWidth: { sm: 400 },
              ml: { xs: 0, sm: 'auto' },
            }}
          >
            <OutlinedInput
              fullWidth
              size="small"
              placeholder="Search by name, description or unit…"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleSearchClear();
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ color: 'grey.500', mr: 0 }}>
                  <Search sx={{ fontSize: 22 }} />
                </InputAdornment>
              }
              endAdornment={
                searchInput ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleSearchClear}
                      aria-label="Clear search"
                      sx={{ color: 'grey.500', '&:hover': { color: 'grey.700' } }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'grey.300',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'grey.400',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderWidth: 1.5,
                  borderColor: 'primary.main',
                },
                '& input': {
                  py: 1.25,
                  fontSize: '0.9375rem',
                  '&::placeholder': { opacity: 0.8 },
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', px: { xs: 2, md: 3 } }}>
        {isDesktop && (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              position: 'sticky',
              top: 80,
              alignSelf: 'flex-start',
              pr: 3,
            }}
          >
            {sidebarContent}
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
          }}
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Box key={i}>
                <Skeleton variant="rounded" sx={{ aspectRatio: '1/1', width: '100%' }} />
                <Skeleton width="80%" height={22} sx={{ mt: 1.5 }} />
                <Skeleton width="100%" height={36} sx={{ mt: 0.5 }} />
                <Skeleton width="45%" height={26} sx={{ mt: 1.5 }} />
              </Box>
            ))
          ) : (
            <>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAddingToCart={addingProductId === product.id}
                />
              ))}

              {loadingMore &&
                Array.from({ length: 4 }).map((_, i) => (
                  <Box key={`skeleton-${i}`}>
                    <Skeleton variant="rounded" sx={{ aspectRatio: '1/1', width: '100%' }} />
                    <Skeleton width="80%" height={22} sx={{ mt: 1.5 }} />
                    <Skeleton width="100%" height={36} />
                    <Skeleton width="45%" height={26} sx={{ mt: 1.5 }} />
                  </Box>
                ))}

              <Box ref={sentinelRef} sx={{ gridColumn: '1 / -1', height: 24, mt: 0 }} />
            </>
          )}
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={filterDrawerOpen && !isDesktop}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, p: 2 } }}
      >
        {sidebarContent}
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductListPage;
