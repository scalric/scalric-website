import { toSearchString } from '@/lib/query.js';
import OpeningsPage from '@/views/OpeningsPage.jsx';

export const metadata = { title: "Open roles — Careers at Scalric", description: "Open roles. Explore Scalric’s technology, consulting, insights and impact." };

export default async function Page({ searchParams }) {
  return <OpeningsPage search={toSearchString(await searchParams)} />;
}
