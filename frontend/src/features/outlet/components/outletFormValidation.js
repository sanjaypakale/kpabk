const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]*$/;

export function validateOutletForm(values) {
  const err = {};
  if (!values.outletName?.trim()) err.outletName = 'Outlet name is required';
  if (!values.ownerName?.trim()) err.ownerName = 'Owner name is required';
  if (!values.email?.trim()) err.email = 'Email is required';
  else if (!EMAIL_REGEX.test(values.email.trim())) err.email = 'Enter a valid email address';
  if (values.phoneNumber?.trim() && !PHONE_REGEX.test(values.phoneNumber)) err.phoneNumber = 'Enter a valid phone number';
  return err;
}
