'use client';
import React from 'react';
import { Eyebrow, Link, Arrow } from './UI.jsx';

export default function NotFoundPage() {
  return <main className="not-found"><Eyebrow>PAGE NOT FOUND</Eyebrow><h1>That path is still taking shape</h1><p>The page may have moved or may not be available yet.</p><Link href="/" className="button button-green">Back to the homepage <Arrow/></Link></main>;
}
