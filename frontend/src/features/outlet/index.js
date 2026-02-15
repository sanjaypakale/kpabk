export { default as outletReducer } from './outletSlice';
export {
  fetchOutlets,
  fetchOutletById,
  createOutlet,
  updateOutlet,
  deleteOutlet,
  fetchOutletProducts,
  updateOutletProducts,
  toggleProductAvailability,
  fetchOutletProductById,
  clearError,
  clearSelectedOutlet,
  clearSelectedProduct,
} from './outletSlice';

export { OutletListPage } from './pages/OutletListPage';
export { OutletDetailsPage } from './pages/OutletDetailsPage';
export { CreateOutletPage } from './pages/CreateOutletPage';
export { EditOutletPage } from './pages/EditOutletPage';
export { OutletProductsPage } from './pages/OutletProductsPage';

export { OutletTable } from './components/OutletTable';
export { OutletForm } from './components/OutletForm';
export { OutletProductTable } from './components/OutletProductTable';
export { AvailabilityToggle } from './components/AvailabilityToggle';
export { OutletBreadcrumbs } from './components/OutletBreadcrumbs';
