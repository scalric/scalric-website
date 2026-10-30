/** Turns a Next.js `searchParams` object (values may be arrays) into a query string a client page can parse with URLSearchParams. */
export function toSearchString(searchParams = {}) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => [].concat(value).forEach((item) => params.append(key, item)));
  return params.toString();
}
