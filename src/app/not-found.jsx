import SiteShell from '@/components/SiteShell.jsx';
import NotFoundPage from '@/components/NotFound.jsx';

export const metadata = { title: 'Page not found — Scalric' };

export default function NotFound() {
  return <SiteShell><NotFoundPage /></SiteShell>;
}
