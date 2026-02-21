export const RENTER_WEBHOOK_URL =
  import.meta.env.VITE_RENTER_WEBHOOK_URL ??
  'https://n8n.stobox4.xyz/webhook-test/29e0df20-dfac-4380-8d4c-46bebb70a1e0'

export const OWNER_WEBHOOK_URL =
  import.meta.env.VITE_OWNER_WEBHOOK_URL ??
  'https://n8n.stobox4.xyz/webhook-test/712969cb-2a6e-4f02-b43e-b6ec3b0e4d3a'

// If you later deploy with serverless functions (e.g. Netlify),
// you can set VITE_USE_LEAD_PROXY=true to make the frontend
// call same-origin endpoints like /api/lead/renter instead
// of talking to n8n directly.
export const USE_PROXY = Boolean(import.meta.env.VITE_USE_LEAD_PROXY)

