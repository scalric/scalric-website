import Analytics from '@/components/Analytics.jsx';
import '@/styles/styles.css';
import '@/styles/premium.css';
import '@/styles/theme.css';
import '@/styles/impact.css';
import '@/styles/ngo.css';
import '@/styles/cta.css';
import '@/banners-fit.css';
import '@/industries-target.css';
import '@/costly-mistakes.css';
import '@/success-stories.css';
import '@/admin/admin.css';

const description = 'Scalric studies complex problems and builds technology and consulting solutions for measurable business and social impact.';

export const metadata = {
  title: 'Scalric — Engineering the Difference',
  description,
  icons: { icon: [{ url: '/assets/favicon-64.png', sizes: '64x64', type: 'image/png' }, { url: '/assets/favicon-192.png', sizes: '192x192', type: 'image/png' }], apple: '/assets/favicon-192.png' },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffffff' };

export default function RootLayout({ children }) {
  return <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    </head>
    <body><Analytics />{children}</body>
  </html>;
}
