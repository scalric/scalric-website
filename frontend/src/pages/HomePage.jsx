import React from 'react';
import { capabilities, insights, proofStats } from '../data/siteContent.js';
import { Link, Arrow, Eyebrow, Reveal, CountUp, SplitHeading, Parallax } from '../components/UI.jsx';
import { ArtImage, MiniBars } from '../components/Showcase.jsx';
import ServicesTicker from '../components/ServicesTicker.jsx';
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
  return <>
    <section className="why-band" id="why-choose-us"><div className="why-band-inner">
      <Reveal className="why-band-copy">
        <span className="why-band-eyebrow">WHY CHOOSE SCALRIC</span>
        <h2>Technology and strategy, built around your outcome</h2>
        <p>A technology and consulting team that starts with your goal and works back to the right solution.</p>
        <div className="why-band-actions"><Link href="/what-we-do" className="why-btn why-btn-solid">Explore what we do</Link><Link href="/impact" className="why-btn why-btn-outline">Our impact</Link></div>
      </Reveal>
      <Reveal className="why-band-media" delay={80}><img src="/assets/photos/why-team.jpg" alt="Colleagues reviewing data together in a meeting room" loading="lazy" decoding="async" /></Reveal>
    </div></section>
    <section className="impact-stats" aria-labelledby="impact-stats-title"><div className="impact-stats-inner">
      <Reveal><span className="impact-stats-eyebrow" id="impact-stats-title">OUR IMPACT</span></Reveal>
      <div className="impact-stats-grid">{proofStats.map((stat, i) => <Reveal key={stat.label} className="impact-stat" delay={i * 90}>
        <b className="impact-stat-value"><CountUp value={stat.value} suffix={stat.suffix} /></b>
        <span className="impact-stat-label">{stat.label}</span>
        <span className="impact-stat-sub">{stat.sub}</span>
      </Reveal>)}</div>
    </div></section>
  </>;
}

const thinkImages = ['/assets/cards/insight-data-workspace.webp', '/assets/cards/insight-ai-hub.webp', '/assets/cards/insight-automation-interface.webp'];

function InsightsSection() {
  const track = (event, slug) => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event, slug } }));
  return <section className="section think-section" id="insights"><div className="think-grid-lines" aria-hidden="true" /><div className="container">
    <Reveal className="think-head"><span className="think-eyebrow">THINKING AHEAD</span><h2>Ideas for what’s next</h2><Link href="/insights" className="think-all" onClick={() => track('view_all_insights_click')}>View all insights <Arrow diagonal /></Link></Reveal>
    <div className="think-cards">{insights.slice(0, 3).map((item, i) => <Reveal key={item.slug} delay={i * 80}><Link href={`/insights/${item.slug}`} className="think-card" onClick={() => track('insight_card_click', item.slug)}>
      <div className="think-card-media"><img src={thinkImages[i]} alt="" loading="lazy" decoding="async" /></div>
      <div className="think-card-body"><h3>{item.category}</h3><p className="think-card-text">{item.title}</p><span className="think-more">Read more <svg viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M1.5 1.5L6.5 6l-5 4.5" /></svg></span></div>
    </Link></Reveal>)}</div>
  </div></section>;
}




export default function HomePage() { return <><Hero /><ServicesTicker /><main><Capabilities /><InsightsSection /><WorkSteps /><PurposePanel /><ContactBand /></main></>; }
