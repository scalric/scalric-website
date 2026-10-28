import React from 'react';
import ArtHero from './ArtHero.jsx';

/** Section page hero (Industries); renders the shared art banner. */
export default function PageHero({ art, eyebrow, title, text, children }) {
  return <ArtHero art={art} eyebrow={eyebrow} title={title} text={text}>{children}</ArtHero>;
}
