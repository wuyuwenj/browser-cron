# 🚀 AI-Powered Smart Notifications - Quick Start

## What Was Implemented

✅ **AI-powered notification criteria evaluation**
✅ **Natural language condition descriptions**
✅ **Intelligent email notifications with AI reasoning**
✅ **Full UI integration in task creation form**
✅ **Database schema updates**
✅ **Enhanced email templates**

## Files Modified

1. **Database Schema** (`prisma/schema.prisma`)
   - Added `notificationCriteria` field to `NotificationSettings`

2. **UI Component** (`src/components/NotificationSettings.tsx`)
   - Added "🤖 Smart Notification Criteria" textarea
   - Updated interface to include `notificationCriteria`
   - Added helpful examples and tooltips

3. **API Route** (`src/app/api/tasks/route.ts`)
   - Updated validation schema to accept `notificationCriteria`
   - Modified task creation to save AI criteria

4. **Browser Use Integration** (`src/lib/browserUse.ts`)
   - Added `notificationCriteria` parameter to `runBrowserTask()`
   - Created new output schema: `TaskOutputWithNotification`
   - Injected AI evaluation prompt when criteria is provided

5. **Task Execution** (`src/app/api/tasks/[id]/run/route.ts`)
   - Passed `notificationCriteria` to Browser Use
   - Added AI evaluation logic (`shouldNotify` check)
   - Included AI reasoning in notification emails

6. **Email Template** (`src/lib/email-templates.ts`)
   - Added notification reason callout box
   - Styled AI evaluation section
   - Extracted and displayed `_notificationReason`

## How to Test

### Quick Test (5 minutes)

1. **Apply Database Migration**
   ```bash
   npx prisma db push
   npm run dev
   ```

2. **Create a Test Task**
   - Go to http://localhost:3000/tasks/new
   - Fill in:
     - Name: "Test AI Notification"
     - Description: "Visit Google and find the word 'Search'"
     - URL: "https://google.com"

3. **Configure Smart Notifications**
   - Scroll to "Email Notifications"
   - Enter your email
   - Check "✅ Notify on success"
   - In "🤖 Smart Notification Criteria" enter:
     ```
     Notify me if the page contains the word "Search"
     ```

4. **Create & Run Task**
   - Click "Create Task"
   - Click "Run Now"
   - Wait for completion (~20-30 seconds)

5. **Check Your Email**
   - You should receive an email with:
     ```
     🤖 AI Notification Trigger:
     The page contains the word "Search" multiple times
     ```

### Real-World Test - Flight Prices

1. **Create Task**:
   - Name: "Cheap Flights to Vancouver"
   - Description: "Go to Google Flights and search for flights from San Francisco to Vancouver in March"
   - URL: "https://www.google.com/travel/flights"

2. **Smart Criteria**:
   ```
   Notify me if any flight is under $50
   ```

3. **Run Task**:
   - AI will search flights
   - Evaluate if any are under $50
   - Send email ONLY if condition is true
   - Email will include: "No flights under $50 found" or "$49 flight found for March 15"

### Real-World Test - Amazon Price

1. **Create Task**:
   - Name: "Monitor Laptop Price"
   - Description: "Check the price of the MacBook Air on Amazon"
   - URL: "https://amazon.com" (or specific product URL)

2. **Smart Criteria**:
   ```
   Notify me if the price is below $900
   ```

3. **Expected Result**:
   - AI finds current price
   - Compares to $900
   - Sends email only if condition met
   - Includes reasoning: "Price is $849, which is below $900"

## Example Criteria to Try

### Price Monitoring
```
Notify if price is below $100
Notify if there's a discount of 20% or more
Notify if cheapest option is under $50
```

### Availability
```
Notify if product is in stock
Notify if inventory shows "Available"
Notify if shipping shows "In stock"
```

### Date/Time
```
Notify if appointment available before March 15
Notify if event is scheduled on a weekend
Notify if delivery is within 2 days
```

### Comparison
```
Notify if Option A is cheaper than Option B
Notify if highest rated item is also cheapest
Notify if 4+ star hotel is under $150/night
```

## Architecture

```
User Creates Task
     ↓
Sets AI Criteria: "Notify if price < $50"
     ↓
Task Runs → Browser Use
     ↓
AI Prompt Enhanced:
  Original Task +
  "Evaluate: Is price < $50?"
     ↓
AI Returns:
  {
    result: [...],
    shouldNotify: true/false,
    notificationReason: "Price is $45"
  }
     ↓
If shouldNotify === true
     ↓
Send Email with Reasoning
```

## Email Preview

When AI criteria is met:

```
Subject: ✅ Task "Flight Checker" completed successfully

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task Completed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your automation task "Flight Checker" has completed successfully.

┌─────────────────────────────┐
│ 🤖 AI Notification Trigger: │
│                             │
│ $49 flight found for        │
│ March 15 - United Airlines  │
└─────────────────────────────┘

Status: Success ✓
Run ID: abc123
Duration: 23s
Time: 2025-01-26 10:30 AM

Output:
{
  "result": [
    "Flight 1: $299",
    "Flight 2: $49",
    "Flight 3: $189"
  ]
}

[View Task Details →]
```

## Debugging

### Check AI Response

After running a task, check the task run details to see AI evaluation:

```json
{
  "result": ["...task results..."],
  "shouldNotify": true,
  "notificationReason": "$45 found on March 15"
}
```

### Verify Notification Sent

Check `NotificationLog` table in Prisma Studio:

```bash
npx prisma studio
```

Look for:
- `status: 'sent'` - Success!
- `status: 'failed'` - Check `errorMsg` column

### Common Issues

**Issue**: AI always returns `false`
- **Fix**: Make criteria more specific and measurable

**Issue**: Email not received
- **Fix**: Verify `RESEND_API_KEY` is set and valid

**Issue**: `shouldNotify` not in output
- **Fix**: Verify `notificationCriteria` is passed to `runBrowserTask()`

## Environment Variables Required

```bash
# Email service
RESEND_API_KEY="re_xxxxx"
RESEND_FROM_EMAIL="BrowserCron <notifications@yourdomain.com>"

# Browser automation
BROWSER_USE_API_KEY="bu_xxxxx"

# App URL for email links
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Next Steps

1. ✅ Test with simple criteria first
2. ✅ Experiment with different conditions
3. ✅ Schedule tasks with AI criteria
4. ✅ Monitor notification logs
5. ✅ Iterate on criteria based on results

## Tips

💡 **Start Simple**: Test with "Notify if page contains [word]"
💡 **Be Specific**: Use numbers, dates, thresholds
💡 **Test Manually**: Run task manually before scheduling
💡 **Check Output**: Verify AI understands your criteria
💡 **Iterate**: Refine criteria based on AI's reasoning

## Support

- Full Guide: `AI_NOTIFICATION_GUIDE.md`
- Setup: `NOTIFICATION_SETUP.md`
- Design Docs: `EMAIL_NOTIFICATIONS_DESIGN.md`

---

**You're ready to use AI-Powered Smart Notifications!** 🎉

Start with a simple test, then build up to complex real-world monitoring. The AI will handle the intelligent evaluation for you!
