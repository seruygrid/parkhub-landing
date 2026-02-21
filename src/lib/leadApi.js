import { OWNER_WEBHOOK_URL, RENTER_WEBHOOK_URL, USE_PROXY } from '../config/leads'

function getSearchParams() {
  if (typeof window === 'undefined') return new URLSearchParams()
  try {
    return new URLSearchParams(window.location.search)
  } catch {
    return new URLSearchParams()
  }
}

function buildMetadata() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    const timestamp_iso = new Date().toISOString()
    return {
      page_path: '',
      full_url: '',
      user_agent: '',
      timestamp_iso,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    }
  }

  const search = getSearchParams()
  const timestamp_iso = new Date().toISOString()

  return {
    page_path: window.location.pathname,
    full_url: window.location.href,
    user_agent: navigator.userAgent,
    timestamp_iso,
    utm_source: search.get('utm_source'),
    utm_medium: search.get('utm_medium'),
    utm_campaign: search.get('utm_campaign'),
    utm_content: search.get('utm_content'),
    utm_term: search.get('utm_term'),
  }
}

async function postLead(flow, payload) {
  const directUrl = flow === 'renter' ? RENTER_WEBHOOK_URL : OWNER_WEBHOOK_URL
  const proxyUrl = flow === 'renter' ? '/api/lead/renter' : '/api/lead/owner'

  const url = USE_PROXY ? proxyUrl : directUrl

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    try {
      const text = await res.text()
      if (text) {
        message = text
      }
    } catch {
      // ignore
    }
    throw new Error(message)
  }
}

export async function submitRenterLead(formValues) {
  const metadata = buildMetadata()

  const payload = {
    flow: 'renter',
    name: formValues.name || null,
    district_or_address: formValues.district,
    need_from_date_or_time: formValues.when || null,
    monthly_budget: formValues.budget,
    phone: formValues.phone,
    messengers: formValues.messenger,
    metadata,
  }

  await postLead('renter', payload)
}

export async function submitOwnerLead(formValues) {
  const metadata = buildMetadata()

  const payload = {
    flow: 'owner',
    name: formValues.name || null,
    district_or_zhk: formValues.district,
    parking_type: formValues.type,
    availability: formValues.availability || null,
    monthly_price: formValues.price,
    phone: formValues.phone,
    messengers: formValues.messenger,
    metadata,
  }

  await postLead('owner', payload)
}

