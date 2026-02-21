# ParkHub Landing

Landing pages for a parking marketplace in Lviv, Ukraine.

## Pages

1. **Seekers** (`/`) — For people looking for monthly parking in Sykhiv district
2. **Owners** (`/owners`) — For parking spot owners who want to rent out their space

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

Output in `dist/`

## Lead capture configuration

Webhook URLs for n8n are configured via environment variables (recommended):

```bash
VITE_RENTER_WEBHOOK_URL="https://n8n.stobox4.xyz/webhook-test/29e0df20-dfac-4380-8d4c-46bebb70a1e0"
VITE_OWNER_WEBHOOK_URL="https://n8n.stobox4.xyz/webhook-test/712969cb-2a6e-4f02-b43e-b6ec3b0e4d3a"
```

If these are not set, the defaults above are used.

Each form submission sends:
- Renter flow: optional name, district/address, optional \"need from\" date/time, monthly budget, phone, messenger (Viber / Telegram).
- Owner flow: optional name, district / ЖК, parking type, availability (24/7 or schedule), monthly price, phone, messenger.
- Metadata: `page_path`, `full_url`, `user_agent`, `timestamp_iso`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.

### Optional proxy mode (Netlify)

If CORS blocks direct calls to the n8n domain and you deploy on Netlify, you can enable a same-origin proxy:

1. Ensure these environment variables are set in Netlify:
   - `RENTER_WEBHOOK_URL`
   - `OWNER_WEBHOOK_URL`
2. The repository already contains:
   - `netlify/functions/lead-renter.js`
   - `netlify/functions/lead-owner.js`
   - `netlify.toml` with redirects from `/api/lead/renter` and `/api/lead/owner`.
3. In the frontend, set:

```bash
VITE_USE_LEAD_PROXY=true
```

When `VITE_USE_LEAD_PROXY` is `true`, the app will call the same-origin endpoints `/api/lead/renter` and `/api/lead/owner`, which forward the request body to the configured n8n webhooks.

### Manual testing

1. Start the dev server:

   ```bash
   npm run dev
   ```

2. Renter flow:
   - Open `http://localhost:5173/`.
   - Click the hero CTA to scroll to the form.
   - Try submitting with missing required fields to see validation errors.
   - Submit a valid form and verify in n8n that the renter webhook receives payload + metadata.

3. Owner flow:
   - Open `http://localhost:5173/owners`.
   - Repeat the same steps to test validation and successful submissions for owners.

