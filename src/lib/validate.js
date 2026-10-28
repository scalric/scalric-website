// Form rules shared by the website (inline errors) and the API (the real enforcement), so both always agree.
// Each validator returns an error message, or '' when the value is acceptable.

export const RESUME_MAX_BYTES = 1024 * 1024;
export const RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'];
export const MAX_EXPERIENCE_ENTRIES = 6;

const text = (value) => (typeof value === 'string' ? value.trim() : '');

export function validateName(value, label = 'Name') {
  const name = text(value);
  if (!name) return `${label} is required.`;
  if (name.length < 2) return `${label} must be at least 2 characters.`;
  if (name.length > 120) return `${label} must be under 120 characters.`;
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u.test(name)) return `${label} can only contain letters, spaces, hyphens and apostrophes.`;
  return '';
}

export function validateEmail(value) {
  const email = text(value);
  if (!email) return 'Email is required.';
  if (email.length > 254) return 'Email must be under 254 characters.';
  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/.test(email)) return 'Enter a valid email address, like name@company.com.';
  return '';
}

export function validatePhone(value) {
  const phone = text(value);
  if (!phone) return 'Contact number is required.';
  if (!/^\+?[0-9\s().-]+$/.test(phone)) return 'Use digits only, with an optional + at the start.';
  const digits = phone.replace(/\D/g, '').length;
  if (digits < 7 || digits > 15) return 'Enter a valid phone number with 7 to 15 digits.';
  return '';
}

export function validateOrganization(value, { required = false } = {}) {
  const organization = text(value);
  if (!organization) return required ? 'Organization is required.' : '';
  if (organization.length < 2) return 'Organization must be at least 2 characters.';
  if (organization.length > 160) return 'Organization must be under 160 characters.';
  return '';
}

export function validateMessage(value, label = 'Message', { min = 10, max = 5000 } = {}) {
  const message = text(value);
  if (!message) return `${label} is required.`;
  if (message.length < min) return `${label} must be at least ${min} characters.`;
  if (message.length > max) return `${label} must be under ${max} characters.`;
  return '';
}

export function validateYears(value) {
  if (value === '' || value === null || value === undefined) return 'Total experience is required. Enter 0 if you are a fresher.';
  const years = Number(value);
  if (!Number.isFinite(years)) return 'Enter experience as a number of years.';
  if (years < 0 || years > 60) return 'Experience must be between 0 and 60 years.';
  return '';
}

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const currentMonth = () => new Date().toISOString().slice(0, 7);

/** One work-history entry: { company, title, from: 'YYYY-MM', to: 'YYYY-MM', current: boolean }. */
export function validateExperienceEntry(entry) {
  if (!entry || typeof entry !== 'object') return 'Invalid experience entry.';
  const company = text(entry.company);
  const title = text(entry.title);
  if (company.length < 2 || company.length > 120) return 'Enter the company name (2 to 120 characters).';
  if (title.length < 2 || title.length > 120) return 'Enter your job title (2 to 120 characters).';
  if (!MONTH.test(entry.from || '')) return 'Choose when you started.';
  if (entry.from > currentMonth()) return 'The start date cannot be in the future.';
  if (!entry.current) {
    if (!MONTH.test(entry.to || '')) return 'Choose when you finished, or tick "I currently work here".';
    if (entry.to < entry.from) return 'The end date cannot be before the start date.';
    if (entry.to > currentMonth()) return 'The end date cannot be in the future.';
  }
  return '';
}

export function validateResumeFile(file) {
  if (!file) return 'Attach your resume (PDF, DOC or DOCX).';
  const extension = String(file.name || '').split('.').pop().toLowerCase();
  if (!RESUME_EXTENSIONS.includes(extension)) return 'Resume must be a PDF, DOC or DOCX file.';
  if (!file.size) return 'That file is empty.';
  if (file.size > RESUME_MAX_BYTES) return `Resume must be smaller than ${RESUME_MAX_BYTES / 1024 / 1024} MB.`;
  return '';
}
