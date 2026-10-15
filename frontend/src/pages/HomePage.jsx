import React from 'react';
import { capabilities, insights, openRoles, proofStats } from '../data/siteContent.js';
import { Link, Arrow, Eyebrow, Reveal, CountUp, SplitHeading, Parallax } from '../components/UI.jsx';
import { ArtImage, Ticker, MiniBars } from '../components/Showcase.jsx';
import ProcessJourney from '../components/ProcessJourney.jsx';

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
      <SplitHeading as="h1" lines={['Engineering', 'the difference.']} accent={1} className="hero-title" startDelay={2} />
      <div className="hero-actions"><Link href="/what-we-do" className="button button-green">Learn more</Link><Link href="/impact" className="button button-outline" onClick={() => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'impact_teaser_click' } }))}>See our impact</Link></div>
    </div>
    <button type="button" className="hero-toggle hero-city-toggle" onClick={toggle} aria-pressed={!playing} aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? '❚❚' : '▶'}</button>
  </section>;
}

function Capabilities() {
  const [saas, ai, data, consulting] = capabilities;
  return <section className="section capabilities-section" id="capabilities"><div className="container">
    <div className="section-heading"><Reveal><Eyebrow>WHAT WE DO</Eyebrow><h2>Big questions.<br /><span className="text-muted">Thoughtful technology.</span></h2></Reveal><Reveal className="section-side" delay={80}><p>We connect the why with the how—bringing business understanding and technology together around a clear outcome.</p><Link href="/what-we-do" className="text-link">Explore our capabilities <Arrow diagonal /></Link></Reveal></div>
    <div className="bento">
      <Reveal className="bento-cell bento-ai"><Link href={ai.href} className="bento-card bento-feature bento-photo"><img className="bento-art" src="/assets/photos/ai-lightbulb.webp" alt="" loading="lazy" decoding="async" /><div className="bento-copy"><span className="card-index">{ai.number}</span><h3>{ai.title}</h3><p>{ai.text}</p><span className="bento-go">Explore <Arrow diagonal /></span></div></Link></Reveal>
      <Reveal className="bento-cell bento-saas" delay={80}><Link href={saas.href} className="bento-card"><div className="bento-copy"><span className="card-index">{saas.number}</span><h3>{saas.title}</h3><p>{saas.text}</p></div><div className="mini-kanban" aria-hidden="true"><div><small>Discover</small><i /><i className="short" /></div><div><small>Build</small><i /><i /></div><div><small>Ship</small><i className="short" /></div></div><span className="bento-go">Explore <Arrow diagonal /></span></Link></Reveal>
      <Reveal className="bento-cell bento-data" delay={60}><Link href={data.href} className="bento-card"><div className="bento-copy"><span className="card-index">{data.number}</span><h3>{data.title}</h3><p>{data.text}</p></div><MiniBars values={[38, 52, 44, 70, 61, 88]} /><span className="bento-go">Explore <Arrow diagonal /></span></Link></Reveal>
      <Reveal className="bento-cell bento-consulting" delay={120}><Link href={consulting.href} className="bento-card bento-feature bento-photo"><img className="bento-art" src="/assets/photos/consulting-office.webp" alt="" loading="lazy" decoding="async" /><div className="bento-copy"><span className="card-index">{consulting.number}</span><h3>{consulting.title}</h3><p>{consulting.text}</p><span className="bento-go">Explore <Arrow diagonal /></span></div></Link></Reveal>
    </div>
  </div></section>;
}

const photoTiles = [
  { src: '/assets/photos/glass-skyscraper.jpg', kicker: 'Complex organisations', title: 'Built for scale and clarity', href: '/what-we-do' },
  { src: '/assets/photos/code-screen.jpg', kicker: 'Software & AI', title: 'Engineered with care', href: '/what-we-do#ai' },
  { src: '/assets/photos/team-whiteboard.jpg', kicker: 'Strategy', title: 'Shaped together, in the room', href: '/company#approach' },
  { src: '/assets/photos/team-charts.jpg', kicker: 'Outcomes', title: 'Progress you can measure', href: '/company#approach' },
];

function PhotoStrip() {
  return <section className="section photo-strip"><div className="container">
    <div className="section-heading"><Reveal><Eyebrow>IN PRACTICE</Eyebrow><h2>Where ideas<br /><span className="text-muted">meet the work.</span></h2></Reveal><Reveal className="section-side" delay={80}><p>Strategy, software and data work come together in the rooms where decisions get made.</p></Reveal></div>
    <div className="photo-strip-grid">{photoTiles.map((tile, i) => <Reveal key={tile.src} delay={i * 80}><Link href={tile.href} className="photo-tile"><img src={tile.src} alt="" loading="lazy" decoding="async" /><div className="photo-tile-copy"><small>{tile.kicker}</small><b>{tile.title}</b><span>Explore <Arrow diagonal /></span></div></Link></Reveal>)}</div>
  </div></section>;
}

function InsightsSection() { return <section className="section insights-home" id="insights"><div className="container"><div className="section-heading"><Reveal><Eyebrow>THINKING AHEAD</Eyebrow><h2>Ideas for what’s next.</h2></Reveal><Reveal className="section-side" delay={80}><p>Early perspectives on the questions shaping technology, business and transformation.</p><Link href="/insights" className="text-link" onClick={() => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'view_all_insights_click' } }))}>View all insights <Arrow diagonal /></Link></Reveal></div><div className="insight-cards">{insights.slice(0, 3).map((item, i) => <Reveal key={item.slug} delay={i * 80}><article className="insight-card"><Link href={`/insights/${item.slug}`} className="insight-visual" aria-label={item.title}><img className="art-img" src={item.heroImage} alt="" loading="lazy" decoding="async" /><span className="card-arrow"><Arrow diagonal /></span></Link><div className="insight-card-copy"><span className="topic-pill">{item.category}</span><span className="draft-badge"></span><h3><Link href={`/insights/${item.slug}`} onClick={() => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'insight_card_click', slug: item.slug } }))}>{item.title}</Link></h3><p>{item.dek}</p><Link href={`/insights/${item.slug}`} className="text-link">Read more <Arrow diagonal /></Link></div></article></Reveal>)}</div></div></section>; }

function ProcessTimeline() {
  return <section className="section process-home"><div className="container">
    <div className="section-heading"><Reveal><Eyebrow>HOW WE WORK</Eyebrow><h2>From question<br /><span className="text-muted">to measurable outcome.</span></h2></Reveal><Reveal className="section-side" delay={80}><p>Six stages, one shared goal: understand the problem, agree what matters, and build a product that delivers the outcome you set out to achieve.</p></Reveal></div>
    <ProcessJourney />
  </div></section>;
}

function ImpactTeaser() { return <section className="impact-teaser impact-stage" id="impact"><img className="impact-stage-bg" src="/assets/photos/tech-network.jpg" alt="" loading="lazy" decoding="async" /><div className="impact-stage-glow" aria-hidden="true" /><div className="container impact-stage-inner"><Reveal className="impact-stage-copy"><Eyebrow light>TECHNOLOGY WITH PURPOSE</Eyebrow><h2>Progress should<br /><span>reach further.</span></h2><p>An initiative bringing discounted digital support to local businesses and pro-bono technology work to NGOs.</p><Link href="/impact" className="button button-green" onClick={() => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'impact_teaser_click' } }))}>Explore the Impact initiative <Arrow diagonal /></Link></Reveal><div className="stat-stack">{proofStats.map((stat, i) => <Reveal key={stat.label} delay={i * 110}><div className="stat-tile"><strong className="stat-number"><CountUp value={stat.value} suffix={stat.suffix} /></strong><div><b>{stat.label}</b><span>{stat.sub}</span>{!stat.verified && <em className="stat-flag"></em>}</div></div></Reveal>)}</div></div></section>; }

function CareersTeaser() { const roles = openRoles.slice(0, 2); return <section className="section careers-teaser"><div className="container careers-teaser-inner"><Reveal className="careers-intro"><Eyebrow>BUILD WHAT MATTERS</Eyebrow><h2>Good work starts<br />with good questions.</h2><p>Join people who bring curiosity, craft and care to problems worth solving.</p><Link href="/careers" className="text-link">Explore careers <Arrow diagonal /></Link></Reveal><Reveal className="careers-list" delay={90}><div className="careers-list-head"><span>OPEN ROLES</span><span>{roles.length ? `${roles.length} opportunities` : 'Growing with intention'}</span></div>{roles.length ? roles.map(role => <Link key={role.slug} href={`/careers/${role.slug}`} className="role-preview"><span><b>{role.title}</b><small>{role.team} · {role.location}</small></span><Arrow diagonal /></Link>) : <div className="role-empty"><span className="role-pulse" /><div><b>Our next opportunity is taking shape.</b><p>We’re growing with intention. Check back for roles, or tell us what you’d bring.</p></div></div>}<Link href="/careers" className="careers-list-link">View open roles <Arrow diagonal /></Link></Reveal></div></section>; }

function ClosingBand() { return <section className="closing-band"><div className="container closing-band-inner"><Reveal><Eyebrow light>START A CONVERSATION</Eyebrow><h2>What could we<br />make possible?</h2></Reveal><Reveal delay={90}><p>Bring us the challenge you’re working through. We’ll bring curiosity and a clear point of view.</p><Link href="/contact" className="button button-light">Talk to us <Arrow diagonal /></Link></Reveal></div></section>; }

const tickerItems = ['SaaS & software', 'Artificial intelligence', 'Data & automation', 'Consulting', 'Financial services', 'Healthcare & life sciences', 'Manufacturing', 'Impact initiative'];

export default function HomePage() { return <><Hero /><Ticker items={tickerItems} /><main><Capabilities /><PhotoStrip /><InsightsSection /><ProcessTimeline /><ImpactTeaser /><CareersTeaser /><ClosingBand /></main></>; }
