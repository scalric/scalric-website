import React from 'react';
import ArtHero from './ArtHero.jsx';

/** Page hero used by Company, Careers and Insights; renders the shared art banner. */
export default function SplitHero({ art, title, text, children }) {
  return <ArtHero art={art} title={title} text={text}>{children}</ArtHero>;
}
