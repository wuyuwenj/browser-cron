# Email Notification System - Setup & Testing Guide

## 🎉 Implementation Complete!

The email notification system has been fully implemented. Users can now receive email alerts when their automation tasks complete, fail, or meet custom criteria.

## What's Been Added

### 1. Database Schema
- ✅ `NotificationSettings` model - stores per-task notification preferences
- ✅ `NotificationLog` model - tracks all sent emails
- ✅ User notification preferences - global email settings

### 2. Email Infrastructure
- ✅ Resend integration (`src/lib/email.ts`)
- ✅ HTML email templates (`src/lib/email-templates.ts`)
  - Task success/failure emails
  - Usage limit alerts
  - Weekly digest emails

### 3. UI Components
- ✅ `NotificationSettings` component (`src/components/NotificationSettings.tsx`)
- ✅ Integrated into task creation form (`src/app/tasks/new/page.tsx`)

### 4. API Integration
- ✅ Task creation with notification settings (`src/app/api/tasks/route.ts`)
- ✅ Email sending after task execution (`src/app/api/tasks/[id]/run/route.ts`)

## Setup Instructions

### Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Create a free account (5,000 emails/month free)
3. Get your API key from the dashboard

### Step 2: Update Environment Variables

Add to your `.env` file:

```bash
# Email Notifications (Required for email features)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="BrowserCron <notifications@yourdomain.com>"
```

**Note:** For development, you can use the default Resend email `notifications@resend.dev`. For production, verify your own domain.

### Step 3: Apply Database Migrations

Run this command to update your database schema:

```bash
npx prisma db push
```

Or if you want to create a migration:

```bash
npx prisma migrate dev --name add_email_notifications
```

### Step 4: Restart Your Dev Server

```bash
npm run dev
```

## Testing the Notification System

### Test 1: Basic Task Notification

1. **Create a new task** at `/tasks/new`
2. Fill in basic task details:
   - Name: "Test Notification"
   - Description: "Visit google.com and take a screenshot"
   - URL: "https://google.com"
3. **Scroll down to "Email Notifications"** section
4. Configure notifications:
   - ✅ Check "Notify on success"
   - ✅ Check "Notify on failure"
   - Enter your email address
   - Select "Immediately (every run)"
5. **Create the task**
6. **Run the task manually**
7. **Check your email** - you should receive a notification!

### Test 2: Custom Rules

1. **Create another task**
2. In the notification settings:
   - Click "Add custom notification rules"
   - Select "Output contains"
   - Enter a keyword (e.g., "Google")
3. **Run the task**
4. **Check email** - you should receive a notification if the output contains "Google"

### Test 3: Usage Limit Alerts (Manual Test)

Currently, usage limit alerts are sent when you approach your plan limits. To test manually, you can:

1. Create many tasks (approaching your limit)
2. The system will send an alert at 80% usage

### Test 4: Check Notification Logs

You can verify notifications were sent by checking the database:

```bash
npx prisma studio
```

Then navigate to the `NotificationLog` table to see all sent/failed emails.

## Features

### Per-Task Notifications

Each task can have its own notification settings:

- ✅ **Notify on success** - Get email when task completes successfully
- ✅ **Notify on failure** - Get email when task fails (recommended)
- 📧 **Custom email** - Send to different email than account email
- ⏰ **Frequency options**:
  - Immediate (every run)
  - Daily digest (once per day)
  - Weekly summary (once per week)

### Custom Notification Rules

Set conditions to trigger notifications:

- **Output contains** - Notify if output contains specific text
- **Output doesn't contain** - Notify if output is missing text
- **Result contains** - Notify based on task results

**Examples:**
- "Notify me if 'Out of Stock' appears"
- "Notify me if price is below $100"
- "Notify me if 'error' is in the output"

### Global User Preferences

Users can control all notifications globally (future enhancement):
- Email notifications on/off
- Usage limit alerts on/off
- Weekly digest on/off

## Email Templates

### 1. Task Completion Email

Sent when a task succeeds or fails:

**Includes:**
- ✅/❌ Success/Failure status
- Task name and run ID
- Execution duration
- Output/results (formatted JSON)
- Error details (if failed)
- Link to view task details

### 2. Usage Limit Alert

Sent when approaching plan limits:

**Includes:**
- Progress bar showing usage
- Current vs. limit numbers
- Remaining quota
- Upgrade link

### 3. Weekly Digest (Not Yet Implemented)

Will send weekly summary of all task activity.

## Notification Logic

Emails are sent when:

1. **Immediate frequency** selected AND one of:
   - Task succeeds AND "Notify on success" enabled
   - Task fails AND "Notify on failure" enabled
   - Custom rule condition met

2. **User has email notifications enabled** globally

3. **Resend is configured** (RESEND_API_KEY set)

## Troubleshooting

### Emails Not Sending

1. **Check Resend API key is set**
   ```bash
   echo $RESEND_API_KEY
   ```

2. **Check server logs** for errors
   - Look for "Failed to send email:" messages

3. **Verify email address** is valid
   - Resend validates email format

4. **Check NotificationLog table**
   ```bash
   npx prisma studio
   ```
   - Look for `status: 'failed'` entries
   - Check `errorMsg` column

### Common Issues

**Issue:** "RESEND_API_KEY not set" warning

**Solution:** Add `RESEND_API_KEY` to your `.env` file

---

**Issue:** Emails not being sent even with valid config

**Solution:** Check that:
- User has `emailNotifications: true` in database
- Task has notification settings created
- Frequency is set to "immediate"

---

**Issue:** Invalid email format error

**Solution:** Use proper email format: `Name <email@domain.com>` or just `email@domain.com`

## Production Checklist

Before going live:

- [ ] Sign up for Resend paid plan (if needed for volume)
- [ ] Verify your domain in Resend dashboard
- [ ] Update `RESEND_FROM_EMAIL` with verified domain
- [ ] Set up DKIM/SPF/DMARC records for deliverability
- [ ] Test emails in Gmail, Outlook, and other clients
- [ ] Set up email monitoring/alerts
- [ ] Review and adjust rate limits

## Future Enhancements

Potential additions:

1. **Daily/Weekly Digests**
   - Implement cron job to send periodic summaries
   - Aggregate multiple task results

2. **SMS Notifications** (via Twilio)
   - Critical failure alerts via text

3. **Slack/Discord Webhooks**
   - Integration with team chat apps

4. **Rich Email Analytics**
   - Track open rates, clicks
   - A/B test subject lines

5. **Email Templates Customization**
   - Allow users to customize email design
   - Brand colors and logos

6. **More Notification Conditions**
   - Element exists/doesn't exist
   - Page title matches
   - Screenshot diff detection
   - Performance thresholds

## Cost Estimate

**Resend Pricing:**
- **Free tier:** 5,000 emails/month, 100 emails/day
- **Paid tier:** $20/month for 50,000 emails

**Typical usage:**
- 100 users × 10 runs/month = 1,000 emails/month
- **You'll likely stay in free tier for a while!**

## Support

For issues or questions:
- [Resend Docs](https://resend.com/docs)
- [Email Best Practices](https://resend.com/docs/send-with-resend/best-practices)

---

## Summary

✅ **Email notifications are ready to use!**

**To activate:**
1. Add `RESEND_API_KEY` to `.env`
2. Run `npx prisma db push`
3. Restart server
4. Create a task with notifications enabled
5. Run the task and check your email!

Enjoy automated email notifications for your browser tasks! 🚀📧
