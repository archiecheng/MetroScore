# MetroScore MVP Launch Checklist

Work through this list top-to-bottom before sending the product to real users.

---

## Infrastructure

- [ ] **Vercel project created** — import GitHub repo, framework detected as Next.js
- [ ] **Vercel environment variables set** — copy every variable from `.env.example`, fill in production values
- [ ] **`NEXT_PUBLIC_APP_URL` set to production domain** — e.g. `https://metroscore.com`
- [ ] **Production deploy succeeded** — no build errors in Vercel dashboard

## Database

- [ ] **Neon production project created** — separate project from dev
- [ ] **`DATABASE_URL` points to production Neon** — in Vercel env vars
- [ ] **Migration run on production DB** — `npm run prisma:migrate` with prod `DATABASE_URL`
- [ ] **Seed data loaded** — `npm run prisma:seed` with prod `DATABASE_URL`
- [ ] **Prisma Studio sanity check** — 12 cities and 60 metrics visible

## Stripe

- [ ] **Stripe account in live mode** — toggle off test mode in Stripe dashboard
- [ ] **`STRIPE_SECRET_KEY` updated to `sk_live_...`** — in Vercel env vars
- [ ] **Production webhook endpoint created** — `https://yourdomain.com/api/v1/stripe/webhook`
- [ ] **Webhook events selected** — `checkout.session.completed`
- [ ] **`STRIPE_WEBHOOK_SECRET` set to `whsec_...` from live webhook** — in Vercel env vars
- [ ] **Test purchase with real card** — confirm report is generated and email arrives

## Email (Resend)

- [ ] **Domain verified in Resend** — add DNS records to your domain registrar
- [ ] **`REPORT_FROM_EMAIL` uses verified domain** — e.g. `reports@yourdomain.com`
- [ ] **`RESEND_API_KEY` set in Vercel** — production key
- [ ] **Test email delivery** — make a test purchase, check inbox including spam

## Analytics (PostHog)

- [ ] **PostHog project set up** — free tier is fine for launch
- [ ] **`NEXT_PUBLIC_POSTHOG_KEY` set in Vercel**
- [ ] **`NEXT_PUBLIC_POSTHOG_HOST` set in Vercel**
- [ ] **Events verified** — visit the site, check PostHog Activity → Live for `report_accessed`, `city_pair_selected`

## Error Monitoring (Sentry)

- [ ] **Sentry project created** — free tier is fine for launch
- [ ] **`NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN` set in Vercel**
- [ ] **Test error captured** — trigger a known error, verify it appears in Sentry

## End-to-end test (do this last, with live keys)

- [ ] **Landing page loads** — `https://yourdomain.com`
- [ ] **City comparison form works** — select two cities, choose purpose, submit
- [ ] **`/view` sample report renders** — charts, score cards, risk alerts all visible
- [ ] **`/pricing` page loads correctly**
- [ ] **`POST /api/v1/cities` returns 12 cities**
- [ ] **`POST /api/v1/reports` creates a report** — returns `PENDING_PAYMENT`
- [ ] **Checkout flow** — real $19 payment completes
- [ ] **Webhook fires** — Stripe dashboard shows webhook delivered
- [ ] **Report status → DELIVERED** — check Prisma Studio or DB
- [ ] **Email received** — report link in inbox
- [ ] **Report link opens** — `/view?token=...` renders correctly
- [ ] **Print button works** — `Ctrl+P` produces clean PDF

## Final checks

- [ ] **No test API keys in production** — `sk_test_` → `sk_live_`, `whsec_test_` → real webhook secret
- [ ] **`.env` not committed** — verify `.gitignore` includes `.env`
- [ ] **`NEXT_PUBLIC_APP_URL` is `https://` not `http://`** — affects email links
- [ ] **Mobile layout checked** — open on a phone, form and report readable
- [ ] **Disclaimer visible** — present on report page and in emails
