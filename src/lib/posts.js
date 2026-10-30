import React from 'react';
import { apiUrl } from './api.js';

let cache = null;
let pending = null; // one request shared by every component that mounts before it answers

/** Turns an API post into the shape the static `insights` use, plus `extra` (lead, sections, takeaways) and `related` for the article page. */
const fromApi = (post) => ({
  slug: post.slug, category: post.category, tags: post.tags?.length ? post.tags : [post.category], title: post.title, dek: post.dek, author: post.author,
  heroImage: post.heroImage, featured: post.featured, publishDate: post.publishDate, related: post.related,
  body: post.sections.map(({ heading, paragraphs }) => ({ heading, text: paragraphs.join(' ') })),
  extra: { lead: post.lead, sections: post.sections.map(({ heading, paragraphs }) => [heading, ...paragraphs]), takeaways: post.takeaways },
});

/** Published posts from the admin-managed API. `loaded` turns true once the API has answered or failed; until then, and if it fails, the list is empty. */
export function useInsights() {
  const [state, setState] = React.useState({ insights: cache || [], loaded: Boolean(cache) });
  React.useEffect(() => {
    let active = true;
    pending ||= fetch(apiUrl('/api/posts'))
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('bad response'))))
      .then((data) => { cache = data.items.map(fromApi); return cache; })
      .catch(() => [])
      .finally(() => { pending = null; });
    pending.then((items) => { if (active) setState({ insights: items, loaded: true }); });
    return () => { active = false; };
  }, []);
  return state;
}
