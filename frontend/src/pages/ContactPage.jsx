import React from 'react';
import { ContactForm } from '../components/Forms.jsx';
import { Eyebrow, PageIntro, Reveal } from '../components/UI.jsx';

export default function ContactPage() {
  const intent = new URLSearchParams(window.location.search).get('intent');
  const title = intent === 'careers' ? 'Tell us what you’d bring.' : 'Let’s start with a conversation.';
  return <><PageIntro eyebrow="CONTACT SCALRIC" title={<>{title.split(' ').slice(0, -2).join(' ')}<br/><span className="text-muted">{title.split(' ').slice(-2).join(' ')}</span></>} text="Share the challenge or opportunity on your mind. We’ll use your note to understand where the conversation should begin." />
    <main><section className="section contact-section"><div className="container contact-grid"><Reveal className="contact-aside"><Eyebrow>WHAT ARE YOU THINKING ABOUT?</Eyebrow><h2>One clear<br/>starting point.</h2><p>Choose the reason that best fits. Your message will be routed with that context so the right conversation can begin.</p><div className="contact-intents"><div><span>01</span><b>Business inquiry</b></div><div><span>02</span><b>Partnership</b></div><div><span>03</span><b>Impact program</b></div><div><span>04</span><b>Careers</b></div></div><span className="contact-decoration">S.</span></Reveal><Reveal className="contact-form-card" delay={100}><div className="form-card-head"><span>YOUR MESSAGE</span><span>ALL FIELDS MARKED ARE REQUIRED</span></div><ContactForm/></Reveal></div></section></main></>;
}
