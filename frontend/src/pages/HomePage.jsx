import React from 'react';
import { capabilities, insights, proofStats } from '../data/siteContent.js';
import { Link, Arrow, Eyebrow, Reveal, CountUp, SplitHeading, Parallax } from '../components/UI.jsx';
import { ArtImage, MiniBars } from '../components/Showcase.jsx';
import WorkSteps from '../components/WorkSteps.jsx';
import ContactBand from '../components/ContactBand.jsx';
import PurposePanel from '../components/PurposePanel.jsx';

function Hero() {
  const videoRef = React.useRef(null);
  const [mobile, setMobile] = React.useState(false);
  const [enabled, setEnabled] = React.useState(true);
  const [playing, setPlaying] = React.useState(true);
  React.useEffect(() => {
    setMobile(window.matchMedia('(max-width: 680px)').matches);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData) { setEnabled(false); setPlaying(false); }
  }, []);
  const toggle = () => {
    if (!enabled) { setEnabled(true); setPlaying(true); return; }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play().catch(() => { }); setPlaying(true); } else { video.pause(); setPlaying(false); }
  };
  return <section className="home-hero hero-city" id="top" aria-labelledby="hero-title">
    {enabled && <video ref={videoRef} className="hero-city-video" src={mobile ? '/media/hero-home-mobile.mp4' : '/media/hero-home.mp4'} autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} key={mobile ? 'm' : 'd'} poster={mobile ? '/assets/hero-home-poster-mobile.jpg' : '/assets/hero-home-poster.jpg'} onCanPlay={(event) => { const video = event.currentTarget; video.muted = true; if (video.paused && playing) video.play().catch(() => setPlaying(false)); }} />}
    <div className="hero-city-shade" aria-hidden="true" />
    <div className="container hero-content">
      <Eyebrow>TECHNOLOGY · CONSULTING · INNOVATION</Eyebrow>
      <SplitHeading as="h1" lines={['Engineering', 'the difference']} accent={1} className="hero-title" startDelay={2} />
      <div className="hero-actions"><Link href="/what-we-do" className="button button-green">Learn more</Link><Link href="/impact" className="button button-outline" onClick={() => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'impact_teaser_click' } }))}>See our impact</Link></div>
    </div>
    <button type="button" className="hero-toggle hero-city-toggle" onClick={toggle} aria-pressed={!playing} aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? '❚❚' : '▶'}</button>
  </section>;
}

function Capabilities() {
  const [businesses, ngos] = proofStats;
  return <section className="section why-section" id="why-choose-us"><div className="container">
    <div className="why-grid">
      <Reveal className="why-hero">
        <img className="why-hero-bg" src="/assets/photos/why-wave-bg.png" alt="" loading="lazy" decoding="async" />
        <span className="why-pill">Why choose Scalric</span>
        <h2>Technology and strategy,<br />built around your outcome</h2>
        <Link href="/what-we-do" className="why-link">Explore what we do <Arrow diagonal /></Link>
      </Reveal>
      <Reveal className="why-photo" delay={60}><img src="/assets/photos/consulting-office.webp" alt="" loading="lazy" decoding="async" /></Reveal>
      <Reveal className="why-stat" delay={100}><small>{businesses.label}</small><div><span className="why-plus" aria-hidden="true">+</span><b><CountUp value={businesses.value} suffix="" prefix="+" /></b></div></Reveal>
      <Reveal className="why-note" delay={140}><div><b><CountUp value={ngos.value} suffix={ngos.suffix} /></b><small>{ngos.label}</small></div><p>We connect the why with the how, bringing business understanding and technology together around a clear outcome.</p></Reveal>
    </div>
  </div></section>;
}

const thinkImages = ['/assets/cards/think-1.png', '/assets/cards/think-teal-fins.png', '/assets/cards/think-blue-stripes.png'];

function InsightsSection() {
  const track = (event, slug) => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event, slug } }));
  return <section className="section think-section" id="insights"><div className="think-grid-lines" aria-hidden="true" /><div className="container">
    <Reveal className="think-head"><span className="think-eyebrow">THINKING AHEAD</span><h2>Ideas for what’s next</h2><Link href="/insights" className="think-all" onClick={() => track('view_all_insights_click')}>View all insights <Arrow diagonal /></Link></Reveal>
    <div className="think-cards">{insights.slice(0, 3).map((item, i) => <Reveal key={item.slug} delay={i * 80}><Link href={`/insights/${item.slug}`} className="think-card" onClick={() => track('insight_card_click', item.slug)}>
      <div className="think-card-body"><small>{item.category}</small><h3>{item.title}</h3><span className="think-plus" aria-hidden="true">+</span></div>
      <img src={thinkImages[i]} alt="" loading="lazy" decoding="async" />
    </Link></Reveal>)}</div>
  </div></section>;
}



export default function HomePage() { return <><Hero /><main><Capabilities /><InsightsSection /><WorkSteps /><PurposePanel /><ContactBand /></main></>; }
