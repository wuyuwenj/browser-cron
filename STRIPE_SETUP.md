# Stripe Subscription Setup Guide

This guide will walk you through setting up Stripe for subscription payments with Free, Pro, and Premium plans.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Your application deployed or running locally

## Step 1: Get Stripe API Keys

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Add it to your `.env` file:
   ```
   STRIPE_SECRET_KEY="sk_test_your_key_here"
   ```

## Step 2: Create Products and Prices

### Create Pro Plan ($9/month)

1. In Stripe Dashboard, go to **Products** → **Add product**
2. Fill in:
   - **Name**: Pro Plan
   - **Description**: For growing businesses
   - **Price**: $9.00
   - **Billing period**: Monthly
   - **Recurring**: Yes
3. Click **Save product**
4. Copy the **Price ID** (starts with `price_`)
5. Add to `.env`:
   ```
   STRIPE_PRO_PRICE_ID="price_your_pro_price_id"
   ```

### Create Premium Plan ($19/month)

1. Repeat the above steps with:
   - **Name**: Premium Plan
   - **Description**: For small teams
   - **Price**: $19.00
2. Copy the **Price ID** and add to `.env`:
   ```
   STRIPE_PREMIUM_PRICE_ID="price_your_premium_price_id"
   ```

## Step 3: Set Up Webhook

### For Local Development (using Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`)
5. Add to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   ```

### For Production

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and add to your production environment variables

## Step 4: Configure App URL

Add your app's URL to `.env`:

**For local development:**
```
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**For production:**
```
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## Step 5: Run Database Migration

Apply the database schema changes:

```bash
npx prisma db push
```

Or if using migrations:
```bash
npx prisma migrate dev
```

## Step 6: Test the Integration

### Test Mode

1. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Requires authentication: `4000 0025 0000 3155`
   - Declined: `4000 0000 0000 9995`
2. Use any future expiry date
3. Use any 3-digit CVC
4. Use any ZIP code

### Testing Webhooks

1. Go to `/pricing` in your app
2. Click **Upgrade Now** on Pro or Premium plan
3. Complete checkout with test card
4. Verify the webhook was received in Stripe CLI or Dashboard
5. Check that the user's plan was updated in your database

## Plan Configuration

The plans are configured in `/src/lib/stripe.ts`:

- **Free**: 2 tasks, 15 runs/month
- **Pro**: 10 tasks, 100 runs/month ($9/month)
- **Premium**: 50 tasks, 300 runs/month ($19/month)

To modify limits, edit the `PLANS` object in that file.

## Troubleshooting

### Webhook signature verification failed

- Make sure `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint secret
- For local dev, ensure Stripe CLI is running with `stripe listen`

### Checkout session not redirecting

- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Check that success/cancel URLs are accessible

### Subscription not updating in database

- Check webhook events are being sent in Stripe Dashboard
- Verify database connection is working
- Check server logs for errors

## Customer Portal

Users can manage their subscriptions (cancel, update payment method) via the Stripe Customer Portal. This is automatically available at:

```
/api/stripe/create-portal-session
```

You can add a "Manage Subscription" button in your dashboard that calls this endpoint.

## Going Live

Before going live:

1. Switch to **live mode** in Stripe Dashboard
2. Get your **live** API keys and price IDs
3. Update environment variables with live keys
4. Create live webhook endpoint
5. Test with real payment methods

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
