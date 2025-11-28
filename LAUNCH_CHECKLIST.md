# Launch Checklist

## ✅ Already Complete
- [x] Database (Supabase PostgreSQL)
- [x] Authentication (Google OAuth)
- [x] Payment system (Stripe)
- [x] Landing page
- [x] Task automation (Browser Use)
- [x] Cron scheduling (GitHub Actions)
- [x] Pricing plans (Free/Pro/Premium)
- [x] Basic UI/UX

## 🚀 Pre-Launch Requirements

### 1. Deployment Platform
- [ ] **Deploy to Vercel** (recommended)
  - Free for starters
  - Auto-deploys from GitHub
  - Easy environment variable management
  - [Deploy Link](https://vercel.com/new)

### 2. Domain & Branding
- [ ] **Buy a domain** (e.g., browsercron.com)
  - Namecheap, Google Domains, or Vercel Domains
  - Cost: ~$10-15/year
- [ ] **Connect domain to Vercel**
- [ ] **Update `NEXT_PUBLIC_APP_URL`** in production env vars
- [ ] **Update branding** (logo, favicon, meta tags)

### 3. Stripe Production Setup
- [ ] **Switch to Live Mode** in Stripe Dashboard
- [ ] **Get live API keys**
  - `STRIPE_SECRET_KEY` (live)
  - `STRIPE_PRO_PRICE_ID` (live)
  - `STRIPE_PREMIUM_PRICE_ID` (live)
- [ ] **Create production webhook**
  - URL: `https://yourdomain.com/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
  - Get `STRIPE_WEBHOOK_SECRET` (live)
- [ ] **Test live payment** with real card

### 4. Email Service Setup (REQUIRED for notifications)
**Recommended: Resend** (5,000 emails/month free)

- [ ] Sign up at [resend.com](https://resend.com)
- [ ] Get API key
- [ ] Verify domain (for custom email address)
- [ ] Install: `npm install resend`
- [ ] Add to `.env`: `RESEND_API_KEY="re_xxx"`

**Alternative options:**
- SendGrid (100 emails/day free)
- AWS SES (very cheap, complex setup)
- Postmark (100 emails/month free)

### 5. Monitoring & Error Tracking
- [ ] **Sentry** (recommended - free tier available)
  - Sign up at [sentry.io](https://sentry.io)
  - Install: `npm install @sentry/nextjs`
  - Track errors in production
  - Cost: Free for 5k errors/month
- [ ] **Vercel Analytics** (built-in, free)
- [ ] **Uptime monitoring** (UptimeRobot, free)

### 6. Legal & Compliance
- [ ] **Privacy Policy** (required for GDPR/CCPA)
  - Use generator: [termly.io](https://termly.io) or [getterms.io](https://getterms.io)
- [ ] **Terms of Service**
- [ ] **Refund Policy** (Stripe requires this)
- [ ] Add links to footer

### 7. Security
- [ ] **Rate limiting** (prevent API abuse)
  - Install: `npm install @upstash/ratelimit @upstash/redis`
  - Free tier: Upstash Redis
- [ ] **Input validation** (already using Zod ✓)
- [ ] **Environment variables** secured (never commit `.env`)
- [ ] **HTTPS** only (Vercel handles this ✓)

### 8. GitHub Actions Setup
- [ ] Add **GitHub Secrets** in your repo:
  - `VERCEL_URL`: Your production URL
  - `CRON_SECRET`: Same as in `.env`
- [ ] Test workflow manually in Actions tab
- [ ] Verify tasks run every 10 minutes

### 9. Testing
- [ ] **Full user flow test**:
  - [ ] Sign up with Google
  - [ ] Create task
  - [ ] Run task manually
  - [ ] Upgrade to Pro (test payment)
  - [ ] Verify plan upgrade works
  - [ ] Create scheduled task
  - [ ] Wait for GitHub Actions to run it
  - [ ] Cancel subscription (verify downgrade)
- [ ] **Test all edge cases**:
  - [ ] Payment failure
  - [ ] Task run failure
  - [ ] Invalid cron expression
  - [ ] Rate limits
- [ ] **Mobile responsiveness**
- [ ] **Cross-browser testing** (Chrome, Safari, Firefox)

### 10. Analytics & Marketing
- [ ] **Google Analytics** or **Plausible** (privacy-friendly)
- [ ] **SEO optimization**:
  - [ ] Meta descriptions
  - [ ] Open Graph images
  - [ ] Sitemap.xml
  - [ ] robots.txt
- [ ] **Social media accounts** (Twitter, LinkedIn)
- [ ] **Product Hunt launch** (optional)

### 11. Support & Documentation
- [ ] **Help/FAQ page**
- [ ] **Support email** or **Intercom chat**
- [ ] **Status page** (optional - statuspage.io)
- [ ] **Changelog** (keep users informed)

### 12. Production Environment Variables

Update these in **Vercel Dashboard** → Project → Settings → Environment Variables:

```bash
# Database
DATABASE_URL="postgresql://production-connection-string"

# Auth
AUTH_SECRET="generate-new-secret-for-production"
GOOGLE_CLIENT_ID="production-google-client-id"
GOOGLE_CLIENT_SECRET="production-google-client-secret"

# Stripe (LIVE MODE)
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
STRIPE_PRO_PRICE_ID="price_xxx"
STRIPE_PREMIUM_PRICE_ID="price_xxx"

# Browser Use
BROWSER_USE_API_KEY="your-api-key"

# Cron
CRON_SECRET="your-secret"

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# Email (NEW - for notifications)
RESEND_API_KEY="re_xxx"
```

## 💰 Estimated Monthly Costs (starting)

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| **Vercel** | ✓ Generous free tier | $20/mo (Pro) |
| **Supabase** | ✓ 500MB DB, 2GB transfer | $25/mo (Pro) |
| **Stripe** | ✓ Free (2.9% + 30¢ per transaction) | - |
| **Resend** | ✓ 5,000 emails/month | $20/mo (50k emails) |
| **Domain** | - | $10-15/year |
| **Sentry** | ✓ 5k errors/month | $26/mo (Team) |
| **Browser Use API** | Check pricing | Varies |
| **GitHub Actions** | ✓ 2,000 min/month | - |
| **Total** | **~$1-2/month** (domain only) | **~$50-100/month** (scaled) |

## 🎯 Launch Day Checklist

- [ ] Final production test (full user flow)
- [ ] Monitor error logs (Sentry)
- [ ] Monitor server logs (Vercel)
- [ ] Test webhooks (Stripe)
- [ ] Verify emails sending (Resend)
- [ ] Check analytics tracking
- [ ] Announce on social media
- [ ] Post on Product Hunt (optional)
- [ ] Monitor customer support channels

## 📈 Post-Launch (Week 1)

- [ ] Monitor user signups
- [ ] Track conversion rate (Free → Paid)
- [ ] Check for errors/bugs
- [ ] Gather user feedback
- [ ] Optimize based on analytics
- [ ] Fix critical issues immediately
- [ ] Plan feature updates based on feedback

## 🔄 Ongoing Maintenance

- [ ] **Weekly**: Check error logs, monitor uptime
- [ ] **Monthly**: Review analytics, update dependencies
- [ ] **Quarterly**: Security audit, performance optimization
- [ ] **As needed**: Customer support, bug fixes, feature updates

## Next Steps

1. **This week**: Deploy to Vercel, set up domain, switch Stripe to live mode
2. **Before launch**: Add email notifications, legal pages, monitoring
3. **Launch week**: Full testing, soft launch to friends, then public launch
4. **After launch**: Monitor, iterate, market

Good luck! 🚀
