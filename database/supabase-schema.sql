-- Scalric schema for Supabase (Postgres). Paste into Supabase > SQL Editor and run.
-- Safe to run more than once: tables and indexes use IF NOT EXISTS and the seed skips existing slugs.
-- The Node API connects directly with the database password, so Row Level Security is enabled
-- with no policies: the public Supabase API keys can read and write nothing.

CREATE TABLE IF NOT EXISTS contact_submissions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  inquiry_type text NOT NULL,
  organization text NOT NULL DEFAULT '',
  message text NOT NULL,
  role text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  experience_years text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  resume_name text NOT NULL DEFAULT '',
  resume_file text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS impact_applications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organization text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  organization_type text NOT NULL CHECK (organization_type IN ('business', 'ngo')),
  need text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roles (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  team text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  work_mode text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions (status);
CREATE INDEX IF NOT EXISTS idx_impact_applications_created_at ON impact_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_impact_applications_status ON impact_applications (status);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Starter roles. Edit or delete them from the admin (Open roles).
INSERT INTO roles (slug, title, team, location, work_mode, description, published) VALUES
  ('senior-full-stack-engineer', 'Senior Full-Stack Engineer', 'Engineering', 'India', 'Remote', $body$Design and ship the web products behind Scalric’s SaaS and impact programs.

What you’ll do
• Build and own features end to end across React front ends and Node.js services.
• Shape data models, APIs and testing practices with the wider team.
• Turn rough problem statements into simple, reliable software.

What you bring
• 5+ years building production web applications.
• Strong JavaScript or TypeScript, SQL and API design.
• Care for craft, accessibility and clear communication.$body$, true),
  ('ai-solutions-engineer', 'AI Solutions Engineer', 'Data & AI', 'India', 'Remote', $body$Help clients and NGOs apply AI and automation where it measurably helps.

What you’ll do
• Prototype and productionise LLM, retrieval and automation workflows.
• Work with consultants to scope problems and define success metrics.
• Evaluate quality, cost and risk, and document what you learn.

What you bring
• Hands-on experience with Python and modern AI tooling.
• Comfort explaining trade-offs to non-technical stakeholders.$body$, true),
  ('product-designer', 'Product Designer', 'Design', 'Bengaluru', 'Hybrid', $body$Own the design of clear, accessible experiences across Scalric’s products and site.

What you’ll do
• Run discovery with users, then design flows, prototypes and polished UI.
• Maintain and grow our design system.
• Partner closely with engineers through delivery.

What you bring
• A portfolio showing end-to-end product thinking.
• Fluency in Figma and an eye for typography and detail.$body$, true),
  ('technology-consultant', 'Technology Consultant', 'Consulting', 'Mumbai', 'On-site', $body$Study complex business problems and shape the technology solutions that solve them.

What you’ll do
• Lead discovery workshops and turn findings into clear recommendations.
• Build business cases and roadmaps with client teams.
• Support delivery from first idea to measurable results.

What you bring
• 3+ years in consulting, product or analytics roles.
• Structured thinking and strong written communication.$body$, true),
  ('impact-programme-associate', 'Impact Programme Associate', 'Impact', 'India', 'Remote', $body$Support the NGOs and businesses that join Scalric’s impact programs.

What you’ll do
• Onboard partner organisations and understand their technology needs.
• Coordinate volunteers and delivery teams.
• Track outcomes and share what is working.

What you bring
• Experience in non-profit, programme or community work.
• Organised, empathetic and comfortable with technology.$body$, true)
ON CONFLICT (slug) DO NOTHING;
