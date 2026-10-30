import { toSearchString } from '@/lib/query.js';
import InsightsPage from '@/views/InsightsPage.jsx';

export const metadata = { title: "Insights — Scalric", description: "Insights. Explore Scalric’s technology, consulting, insights and impact." };

export default async function Page({ searchParams }) {
  return <InsightsPage search={toSearchString(await searchParams)} />;
}
