// Backend origin (no trailing slash). Empty means same-origin /api (Vite proxy in dev).
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const apiUrl = (path) => `${API_BASE}${path}`;

export async function submitForm(path, values) {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'We could not send your request. Please try again.');
  return result;
}
