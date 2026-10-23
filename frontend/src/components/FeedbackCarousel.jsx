import React from 'react';

/** Sample feedback for layout only. Companies, people and quotes are fictitious; replace before launch. */
export const sampleFeedback = [
  { company: 'Brightline Retail', initials: 'BR', tone: '#0645E5', name: 'Priya Nair', role: 'Operations Lead', quote: 'They helped us see where stock was getting stuck between stores, with a clear plan we could follow every step' },
  { company: 'Harbor Clinic Network', initials: 'HC', tone: '#0b3aa8', name: 'Dr Samuel Osei', role: 'Clinical Director', quote: 'The team listened before suggesting anything, and the tools they built fit how our clinics already work' },
  { company: 'Greenfield Foods Co-op', initials: 'GF', tone: '#0a2d85', name: 'Marta Ilić', role: 'Founder', quote: 'We are a small team with big plans, and Scalric kept the scope realistic and checked in every week' },
  { company: 'Civic Pathways Trust', initials: 'CP', tone: '#0645E5', name: 'Arjun Mehta', role: 'Programme Manager', quote: 'Our volunteers now track outcomes without spreadsheets, which has saved hours every month across our programmes' },
  { company: 'Northstar Studio', initials: 'NS', tone: '#0645E5', name: 'Lena Brandt', role: 'Chief Executive', quote: 'They challenged our assumptions in a useful way, so we launched a smaller first version and learned quickly' },
  { company: 'Kestrel Logistics', initials: 'KL', tone: '#0645E5', name: 'Daniel Ortiz', role: 'Chief Technology Officer', quote: 'Clear milestones and plain-English updates, so we always knew what was done, what was next, and why' },
];

/** Horizontal, snap-scrolling feedback cards: three visible at a time, with arrow controls. */
export default function FeedbackCarousel() {
  const trackRef = React.useRef(null);
  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.fb-card');
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth / 3;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return <div className="fb-wrap">
    <div className="fb-head">
      <span className="fb-sample">Sample feedback · replace before launch</span>
      <div className="fb-controls">
        <button type="button" className="fb-btn" onClick={() => scrollByCard(-1)} aria-label="Previous feedback">←</button>
        <button type="button" className="fb-btn" onClick={() => scrollByCard(1)} aria-label="Next feedback">→</button>
      </div>
    </div>
    <div className="fb-track" ref={trackRef} role="region" aria-label="Client feedback" tabIndex={0}>
      {sampleFeedback.map((item) => <article key={item.company} className="fb-card">
        <div className="fb-top">
          <span className="fb-logo" style={{ background: item.tone }} aria-hidden="true">{item.initials}</span>
          <div>
            <b>{item.company}</b>
            <span className="fb-stars" aria-label="Five stars">★★★★★</span>
          </div>
        </div>
        <p className="fb-quote">“{item.quote}”</p>
        <div className="fb-person"><b>{item.name}</b><span>{item.role}</span></div>
      </article>)}
    </div>
  </div>;
}
