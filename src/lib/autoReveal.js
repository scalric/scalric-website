const TARGETS = [
  '.section-heading', '.eyebrow-block', '.capability-grid > *', '.principles-grid > *', '.process-track', '.principle-row',
  '.hiring-steps > *', '.faq-list > *', '.insight-cards > *', '.why-grid', '.why-list', '.company-manifesto .container > *',
  '.company-nav-links', '.topic-chips', '.insights-results-head', '.career-art', '.career-culture-inner > div', '.industries-callout > *',
  '.sector-chips li', '.roles-list > *',
].join(',');

/**
 * Fades and lifts page blocks into place as they scroll into view. Only blocks that start below the fold are
 * hidden first, so nothing flashes on load, and blocks already wrapped by <Reveal> are left alone.
 * Returns a cleanup function.
 */
export function autoReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const items = [...document.querySelectorAll(`main ${TARGETS}`)].filter((el) => !el.closest('.reveal, .ah') && !el.classList.contains('reveal'));
  const fold = window.innerHeight * 0.92;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('rv-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => {
    if (el.getBoundingClientRect().top < fold) return;
    const index = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--rv-d', `${Math.min(index, 6) * 70}ms`);
    el.classList.add('rv');
    observer.observe(el);
  });
  return () => observer.disconnect();
}
