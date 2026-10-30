import { RoleDetailPage } from '@/views/CompanyCareersPages.jsx';

export const metadata = { title: 'Role — Careers at Scalric' };

export default async function Page({ params }) {
  const { slug } = await params;
  return <RoleDetailPage slug={decodeURIComponent(slug)} />;
}
