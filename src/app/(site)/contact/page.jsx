import { toSearchString } from '@/lib/query.js';
import ContactPage from '@/views/ContactPage.jsx';

export const metadata = { title: "Contact — Scalric", description: "Contact. Explore Scalric’s technology, consulting, insights and impact." };

export default async function Page({ searchParams }) {
  return <ContactPage search={toSearchString(await searchParams)} />;
}
