import React from 'react';

let cache = null;

/** Published roles from the admin-managed API; empty until loaded or if the API is unreachable. */
export function useRoles() {
  const [state, setState] = React.useState({ roles: cache || [], loaded: Boolean(cache) });
  React.useEffect(() => {
    let active = true;
    fetch('/api/roles')
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .catch(() => ({ items: [] }))
      .then((data) => { cache = data.items; if (active) setState({ roles: data.items, loaded: true }); });
    return () => { active = false; };
  }, []);
  return state;
}
