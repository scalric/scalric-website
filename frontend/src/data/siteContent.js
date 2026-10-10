export const capabilities = [
  { number: '01', title: 'SaaS & software', text: 'Digital products designed around the business outcomes that matter.', icon: '◒', href: '/what-we-do#saas' },
  { number: '02', title: 'Artificial intelligence', text: 'AI applied to decisions, services and operations with purpose.', icon: '✳', href: '/what-we-do#ai' },
  { number: '03', title: 'Data & automation', text: 'Turn fragmented processes and information into forward motion.', icon: '⌘', href: '/what-we-do#data-automation' },
  { number: '04', title: 'Consulting', text: 'Connect market understanding, strategy and technology delivery.', icon: '↗', href: '/what-we-do#consulting' },
];

export const topics = [
  'Artificial Intelligence', 'SaaS & Software', 'Data & Analytics', 'Automation', 'Cyber Security',
  'Cloud & Infrastructure', 'Digital Transformation', 'Economy & Growth', 'ESG & Sustainability',
  'Financial Services', 'Healthcare & Life Sciences', 'Manufacturing', 'Retail & Consumer',
  'Public Sector', 'Startups & Emerging Business', 'Workforce & Talent', 'Risk & Regulation',
];

export const insights = [
  {
    slug: 'from-data-to-decisions', category: 'Data & Analytics',
    tags: ['Data & Analytics'], status: 'editorial-preview', publishDate: null,
    title: 'From data to decisions: making information work harder',
    dek: 'A practical perspective on bringing data, people and business priorities into one decision system.',
    author: 'Scalric Editorial', heroImage: null, featured: true, source: null,
    body: [
      { heading: 'A better question to start with', text: 'The value of data is measured in the decisions it helps people make. Begin with the decision, then work backwards to the information, ownership and process it needs.' },
      { heading: 'Connect the operating model', text: 'Technology choices matter, but so do trusted definitions, clear accountability and the routines that turn insight into action.' },
      { heading: 'Build for learning', text: 'A useful data capability improves through use. Start with a focused outcome, observe what changes and expand the approach when it proves its value.' },
    ],
  },
  {
    slug: 'ai-with-purpose', category: 'Artificial Intelligence',
    tags: ['Artificial Intelligence'], status: 'editorial-preview', publishDate: null,
    title: 'AI with purpose: moving from possibility to operating value',
    dek: 'How organizations can frame AI around a meaningful business problem and a responsible path to scale.',
    author: 'Scalric Editorial', heroImage: null, featured: true, source: null,
    body: [
      { heading: 'Start with the work', text: 'A useful AI opportunity starts with a task, decision or service that can be made clearer, faster or more helpful.' },
      { heading: 'Design the conditions', text: 'Data access, human oversight, security and adoption need to be considered alongside model selection.' },
      { heading: 'Scale with evidence', text: 'Small, observable releases help teams learn what works and build confidence before expanding into more consequential use cases.' },
    ],
  },
  {
    slug: 'automation-and-the-customer-journey', category: 'Automation',
    tags: ['Automation'], status: 'editorial-preview', publishDate: null,
    title: 'Automation that makes the whole journey simpler',
    dek: 'A systems view of automation can reduce friction for customers and the teams who support them.',
    author: 'Scalric Editorial', heroImage: null, featured: true, source: null,
    body: [
      { heading: 'Look across the journey', text: 'Automating one step can move effort somewhere else. Map the end-to-end experience before deciding where technology can help.' },
      { heading: 'Keep people in the loop', text: 'Design clear ways to review exceptions and improve the process as conditions change.' },
      { heading: 'Make improvement visible', text: 'Pair workflow measures with the experience they are meant to improve, then adjust the design with the people closest to the work.' },
    ],
  },
];

export const proposedIndustries = [
  { title: 'Financial services', text: 'Explore opportunities across digital services, data and operations.' },
  { title: 'Healthcare & life sciences', text: 'Consider how connected information can support better experiences.' },
  { title: 'Manufacturing', text: 'Examine the role of intelligence and automation in complex operations.' },
  { title: 'Retail & consumer', text: 'Connect customer insight with the systems that serve demand.' },
  { title: 'Public sector', text: 'Design technology around accessible, dependable services.' },
  { title: 'Emerging businesses', text: 'Build the digital foundations that support a changing market.' },
];

export const openRoles = [];

export const pagesForSearch = [
  ['What We Do', '/what-we-do'], ['Industries', '/industries'], ['Insights', '/insights'],
  ['Impact', '/impact'], ['Company', '/company'], ['Careers', '/careers'], ['Contact', '/contact'],
];

/**
 * Proof points. `verified: false` renders a visible "placeholder" tag — figures below come from the PRD's
 * illustrative example (Section 9.4) and must be replaced with confirmed numbers before launch.
 * Turn On Digital's public site publishes no company-level totals, so none are carried over.
 */
export const proofStats = [
  { value: 500, suffix: '+', label: 'Businesses supported', sub: 'Discounted digital and SaaS support', verified: false },
  { value: 100, suffix: '+', label: 'NGOs supported', sub: 'Technology and digital support, pro bono', verified: false },
  { value: 1000, suffix: '+', label: 'Impact target', sub: 'Long-term goal for the initiative', verified: false },
];

/** Engagement dashboard sample data (Showcase). Illustrative only; the page labels it as such. */
export const dashboardKpis = [
  ['Outcomes tracked', '24', 'Six added this quarter'],
  ['Stakeholders aligned', '8', 'Across three workstreams'],
  ['Milestones on plan', '92%', 'Reviewed weekly'],
];
export const dashboardMilestones = [
  ['Discovery', 'Complete', 'ok'],
  ['Strategy', 'In review', 'warn'],
  ['Build', 'In progress', 'ok'],
  ['Launch readiness', 'Scheduled', 'idle'],
];
export const dashboardTrend = [12, 18, 16, 24, 22, 31, 29, 38, 41, 39, 47, 55];
export const dashboardNav = ['Overview', 'Roadmap', 'Outcomes', 'Reports'];

/** Workstream progress (Showcase). Percentages are illustrative. */
export const workstreams = [
  ['Product direction', 82], ['Data foundations', 64], ['AI use-case design', 47], ['Operating model', 33],
];

/** Operating principles carried over from Turn On Digital's "why work with us" content, reworded for Scalric. */
export const workingPrinciples = [
  ['Outcome-first', 'Every engagement is framed around a measurable goal, not generic activity metrics.'],
  ['Full transparency', 'Regular reporting, live visibility and open conversations throughout.'],
  ['Realistic timelines', 'Honest expectations up front, with visible progress along the way.'],
  ['One point of contact', 'A dedicated lead for continuity, consistency and quality.'],
];

/** Delivery process adapted from Turn On Digital's six-step process. */
export const processSteps = [
  ['Discovery', 'Understand the business, context, competition and goals.'],
  ['Audit & research', 'Assess what works today and where the real opportunities are.'],
  ['Custom strategy', 'A prioritised roadmap with realistic timelines and measurable targets.'],
  ['Execution', 'Specialist teams implement with attention to detail.'],
  ['Monitor & optimise', 'Track performance continuously and refine from real data.'],
  ['Report & scale', 'Regular reviews and a clear plan to scale what works.'],
];

/** Sectors previously served under Turn On Digital (to be confirmed for Scalric positioning). */
export const sectorsServed = [
  'Real estate', 'E-commerce', 'Healthcare & clinics', 'Education & coaching', 'B2B & manufacturing',
  'Travel & hospitality', 'Legal & consulting', 'Retail', 'Fitness & wellness', 'Home services',
];
