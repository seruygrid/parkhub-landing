export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: 'Method Not Allowed',
    }
  }

  const url = process.env.RENTER_WEBHOOK_URL

  if (!url) {
    return {
      statusCode: 500,
      body: 'Missing RENTER_WEBHOOK_URL environment variable',
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: event.body || '{}',
    })

    const text = await response.text()

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: text || '',
    }
  } catch (error) {
    console.error('Error forwarding renter lead', error)
    return {
      statusCode: 500,
      body: 'Error forwarding renter lead',
    }
  }
}

