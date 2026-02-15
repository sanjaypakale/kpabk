/**
 * Prefer displayName/name; if missing, derive a friendly name from email (e.g. admin@test.com → Admin).
 */
export function getDisplayName(user) {
  const name = user?.displayName || user?.name;
  if (name && typeof name === 'string' && name.trim()) return name.trim();
  const email = user?.email;
  if (email && typeof email === 'string') {
    const local = email.split('@')[0];
    if (local) return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
  }
  return 'User';
}

export function getInitials(displayName) {
  if (!displayName || typeof displayName !== 'string') return '?';
  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return displayName.slice(0, 2).toUpperCase();
}
