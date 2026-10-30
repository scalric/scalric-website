import { InsightArticlePage } from '@/views/InsightsPage.jsx';
import { insights } from '@/data/siteContent.js';

export function generateStaticParams() {
  return insights.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = insights.find((item) => item.slug === slug);
  return { title: article ? `${article.title} — Scalric` : 'Insight — Scalric' };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <InsightArticlePage slug={decodeURIComponent(slug)} />;
}
