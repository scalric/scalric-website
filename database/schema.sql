CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  inquiry_type VARCHAR(40) NOT NULL,
  organization VARCHAR(160) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS impact_applications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organization VARCHAR(160) NOT NULL,
  contact_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  organization_type VARCHAR(8) NOT NULL CHECK (organization_type IN ('business', 'ngo')),
  need TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_impact_applications_created_at ON impact_applications(created_at DESC);
