import React from 'react';
import PageHero from '../components/PageHero.jsx';
import { ImpactForm } from '../components/Forms.jsx';
import FeedbackCarousel from '../components/FeedbackCarousel.jsx';
import { Link, Arrow, Eyebrow, PageIntro, Reveal, CountUp, TypedText } from '../components/UI.jsx';
import { proofStats } from '../data/siteContent.js';

const measures = [
  { label: 'Businesses supported', sub: 'Discounted digital and SaaS support' },
  { label: 'NGOs supported', sub: 'Pro-bono technology work' },
  { label: 'Technology deployed', sub: 'Practical tools designed around need' },
];

const metricArt = ['/assets/photos/metric-businesses.png', '/assets/photos/metric-ngos.webp', '/assets/photos/metric-tech.webp'];

export default function ImpactPage() {
  return <><PageHero variant="impact" visual={<figure className="wwd-video"><video src="/assets/videos/impact-ai.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Looping animated visual of artificial intelligence technology" /></figure>} eyebrow="THE IMPACT INITIATIVE" title={<>Technology can<TypedText phrases={["open new paths.","reach further.","empower communities.","build what lasts."]}/></>} text="We’re shaping a program to make useful technology more accessible—offering discounted digital and SaaS support to local businesses and pro-bono technology work for NGOs." />
    <main><section className="impact-mission section"><div className="container impact-mission-grid"><Reveal><Eyebrow>OUR MISSION</Eyebrow><h2>Useful technology<br />should reach further.</h2></Reveal><Reveal delay={90}><p>Impact is an ongoing commitment, built around listening to the people closest to a challenge, creating practical technology together and learning from what changes.</p><p>The initiative is being developed with local businesses and NGOs in mind. Program details, eligibility and verified outcomes will be published as they are confirmed.</p></Reveal></div></section>

      <section className="impact-metrics"><div className="container"><div className="impact-metrics-head"><Eyebrow light>MEASURE WHAT MATTERS</Eyebrow><span></span></div><div className="impact-metric-grid">{proofStats.map((item, index) => <Reveal key={item.label} delay={index * 70}><article className="impact-metric"><div className="impact-metric-art"><img src={metricArt[index]} alt="" loading="lazy" decoding="async" /></div><span className="metric-value"><CountUp value={item.value} suffix={item.suffix} immediate duration={2200} /></span><h3>{item.label}</h3><p>{item.sub}</p>{!item.verified && <em className="stat-flag"></em>}</article></Reveal>)}</div><p className="metric-note"></p></div></section>
      <section className="section impact-journey"><div className="container"><div className="section-heading"><div><Eyebrow>AN ONGOING MISSION</Eyebrow><h2>Listen. Build. Learn.</h2></div><p className="section-lead">A thoughtful path from a real need to technology that can keep making a difference.</p></div><div className="journey-grid">{[['01', 'Listen closely', 'Understand the people, goals and constraints behind the challenge.', '/assets/photos/impact-listen.png'], ['02', 'Build together', 'Shape an appropriate technology response with the organization.', '/assets/photos/impact-build.png'], ['03', 'Learn and improve', 'Review what is working and identify what should happen next.', '/assets/photos/impact-learn.png']].map(([num, title, text, image], index) => <Reveal key={num} delay={index * 80}><article className="journey-card"><div className="journey-photo"><img src={image} alt="" loading="lazy" decoding="async" /></div><span>{num}</span><i className="journey-line" /><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div></div></section>
      <section className="impact-stories"><div className="container impact-stories-inner"><div><Eyebrow>STORIES OF PROGRESS</Eyebrow><h2>Real stories.<br />Verified outcomes.</h2><p>Case studies will be shared as partner work and outcomes are approved for publication.</p></div><FeedbackCarousel /></div></section>
      <section className="section get-involved" id="get-involved"><div className="container get-involved-grid"><div><Eyebrow>GET INVOLVED</Eyebrow><h2>Bring us the<br />challenge.</h2><p>Tell us about your business or NGO and the technology support you’re looking for. The program team can follow up as details are confirmed.</p><div className="eligibility-note"><span>↗</span><p>Businesses and NGOs may share a request. Program eligibility and availability are confirmed individually.</p></div></div><div className="impact-form-card"><div className="form-card-head"><span>START HERE</span><span>01 / 01</span></div><ImpactForm /></div></div></section>
      <div className="impact-return"><div className="container"><Link href="/" className="text-link" onClick={() => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'impact_to_home_click' } }))}><Arrow /> Back to Scalric home</Link></div></div></main></>;
}
