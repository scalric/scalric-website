import React from 'react';
import { sampleRoles } from '../data/sampleRoles.js';

let cache = null;

// Shown when the API is unreachable (static hosting), so the openings page still lists the starter roles.
const fallbackRoles = sampleRoles.map(([slug, title, team, location, workMode, description]) => ({ slug, title, team, location, workMode, description }));

/** Published roles from the admin-managed API; starter roles if the API is unreachable. */
export function useRoles() {
  const [state, setState] = React.useState({ roles: cache || [], loaded: Boolean(cache) });
  React.useEffect(() => {
    let active = true;
    fetch('/api/roles')
      .then((response) => (response.ok ? response.json() : { items: fallbackRoles }))
      .catch(() => ({ items: fallbackRoles }))
      .then((data) => { cache = data.items; if (active) setState({ roles: data.items, loaded: true }); });
    return () => { active = false; };
  }, []);
  return state;
}
