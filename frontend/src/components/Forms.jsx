import React from 'react';
import { submitForm } from '../lib/api.js';

export function ContactForm({ initialInquiryType = 'business' }) {
  const [status, setStatus] = React.useState({ kind: '', text: '' });
  const [sending, setSending] = React.useState(false);
  async function handleSubmit(event) {
    event.preventDefault(); setSending(true); setStatus({ kind: '', text: '' });
    const element = event.currentTarget;
    const form = new FormData(element);
    const values = Object.fromEntries(form.entries());
    values.consent = form.get('consent') === 'true';
    try {
      const result = await submitForm('/api/contact', values);
      setStatus({ kind: 'success', text: result.message });
      window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'contact_form_submit' } }));
      element.reset();
    } catch (error) { setStatus({ kind: 'error', text: error.message }); }
    finally { setSending(false); }
  }
  return <form className="contact-form" onSubmit={handleSubmit}>
    <div className="form-grid"><label>Your name<input name="name" autoComplete="name" required maxLength="120" placeholder="Name" /></label><label>Work email<input name="email" type="email" autoComplete="email" required maxLength="254" placeholder="you@company.com" /></label>
    <label>Organization <span className="optional">(optional)</span><input name="organization" autoComplete="organization" maxLength="160" placeholder="Company or organization" /></label><label>What are you reaching out about?<select name="inquiryType" defaultValue={['business','partnership','impact','careers','other'].includes(initialInquiryType) ? initialInquiryType : 'business'} required><option value="business">Business inquiry</option><option value="partnership">Partnership</option><option value="impact">Impact program</option><option value="careers">Careers</option><option value="other">Something else</option></select></label>
    <label className="form-wide">Tell us a little about it<textarea name="message" required maxLength="5000" rows="5" placeholder="What would you like to explore together?" /></label></div>
    <label className="consent"><input type="checkbox" name="consent" value="true" required /><span>I agree that Scalric may contact me about this request.</span></label>
    <button className="button button-green form-submit" disabled={sending}>{sending ? 'Sending…' : 'Send your message'} <span aria-hidden="true">↗</span></button>
    <p className={`form-status ${status.kind}`} aria-live="polite">{status.text}</p>
  </form>;
}

export function ImpactForm() {
  const [status, setStatus] = React.useState({ kind: '', text: '' });
  const [sending, setSending] = React.useState(false);
  async function handleSubmit(event) {
    event.preventDefault(); setSending(true); setStatus({ kind: '', text: '' });
    const element = event.currentTarget;
    const form = new FormData(element);
    const values = Object.fromEntries(form.entries());
    values.consent = form.get('consent') === 'true';
    try {
      const result = await submitForm('/api/impact/applications', values);
      setStatus({ kind: 'success', text: result.message });
      element.reset();
    } catch (error) { setStatus({ kind: 'error', text: error.message }); }
    finally { setSending(false); }
  }
  return <form className="contact-form impact-form" onSubmit={handleSubmit}>
    <div className="form-grid"><label>Organization name<input name="organization" required maxLength="160" placeholder="Your organization" /></label><label>Your name<input name="contactName" required maxLength="120" placeholder="Name" /></label><label>Email address<input name="email" type="email" required maxLength="254" placeholder="you@organization.org" /></label><fieldset className="form-type"><legend>Organization type</legend><label><input type="radio" name="organizationType" value="business" required /> Business</label><label><input type="radio" name="organizationType" value="ngo" /> NGO</label></fieldset><label className="form-wide">What technology support would help?<textarea name="need" required maxLength="5000" rows="4" placeholder="Tell us about the challenge you are working on." /></label></div>
    <label className="consent"><input type="checkbox" name="consent" value="true" required /><span>I agree that Scalric may contact me about this request.</span></label>
    <button className="button button-green form-submit" disabled={sending}>{sending ? 'Sending…' : 'Share your need'} <span aria-hidden="true">↗</span></button><p className={`form-status ${status.kind}`} aria-live="polite">{status.text}</p>
  </form>;
}
