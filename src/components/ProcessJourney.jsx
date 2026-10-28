import React from 'react';
import { journeySteps } from '../data/siteContent.js';
import { Reveal } from './UI.jsx';

/**
 * "How we work" as a journey: a gradient spine (green to blue) runs down the page, and each stage
 * sits on alternating sides with a numbered node. Static content, no tabs or autoplay.
 */
export default function ProcessJourney() {
  return <ol className="journey" aria-label="Our delivery journey">
    {journeySteps.map((step, i) => <li key={step.title} className="journey-step">
      <span className="journey-node" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      <Reveal delay={60} className="journey-card-wrap">
        <article className="journey-card">
          <span className="journey-kicker">{step.kicker}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
          <ul>{step.points.map((point) => <li key={point}>{point}</li>)}</ul>
        </article>
      </Reveal>
    </li>)}
  </ol>;
}
