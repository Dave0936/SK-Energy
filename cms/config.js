// Fill in projectId to read live from Sanity. Empty = sample data in cms/*.json.
// The dataset must be public (or front a proxy that adds a read token — never put a token here),
// and your site's origin must be added under Sanity → API → CORS origins.
window.SK_CMS_CONFIG = {
  projectId: 'acn2l2rb',
  dataset: 'production',
  apiVersion: '2024-10-01',
  useCdn: true,
};
