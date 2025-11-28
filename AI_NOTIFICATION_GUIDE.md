# 🤖 AI-Powered Smart Notifications - User Guide

## What's New?

Your browser automation platform now features **AI-Powered Smart Notifications** - an intelligent notification system that uses AI to evaluate complex criteria and decide when to alert you.

Instead of simple text matching, the AI actually understands what it finds during automation and evaluates your conditions intelligently.

## How It Works

### Traditional Approach (Limited)
❌ "Notify if output contains 'Out of Stock'" - just text matching
❌ Can't handle comparisons, dates, or logic
❌ Brittle and inflexible

### AI-Powered Approach (Intelligent) ✨
✅ "Notify me if any plane ticket is under $50"
✅ "Notify if cheapest hotel is less than $100"
✅ "Notify if product is back in stock"
✅ "Notify if appointment available before Friday"

The AI reads the page, understands the context, evaluates your criteria, and decides whether to send a notification!

## Features

### 🎯 Natural Language Criteria

Describe your notification conditions in plain English:

- **Price Monitoring**: "Notify if price drops below $100"
- **Availability**: "Notify if product is back in stock"
- **Dates**: "Notify if appointment available before March 15"
- **Comparisons**: "Notify if the cheapest option is under $50"
- **Complex Logic**: "Notify if there's a flight under $200 with less than 1 stop"

### 🧠 AI Evaluation

The AI:
- ✅ Reads and understands the webpage content
- ✅ Evaluates your criteria based on what it finds
- ✅ Returns `true` if condition is met, `false` otherwise
- ✅ Provides a reason for its decision

### 📧 Enhanced Email Notifications

When the AI triggers a notification, you receive:
- ✅ Clear explanation of why it was triggered
- ✅ Full task results and output
- ✅ Highlighted AI evaluation in the email

## How to Use

### Step 1: Create a Task

1. Go to **Create New Task** (`/tasks/new`)
2. Fill in basic task details:
   - Name: "Flight Price Checker"
   - Description: "Go to Google Flights and check prices from SF to Vancouver in March"
   - URL: "https://www.google.com/travel/flights"

### Step 2: Configure Smart Notifications

Scroll down to **Email Notifications** section:

1. **Enter your email**
2. **Check notification preferences**:
   - ✅ Notify on success (recommended for AI criteria)
   - ✅ Notify on failure (catch errors)

3. **🤖 Enter Smart Notification Criteria**:
   ```
   Notify me if any flight is under $50 for dates in March
   ```

4. **Select frequency**: "Immediately (every run)"

### Step 3: Run the Task

The AI will:
1. Execute your automation task
2. Collect flight prices from the page
3. Evaluate your criteria: "Is any flight under $50?"
4. If **TRUE**: Send you an email with details (e.g., "$49 flight found for March 15")
5. If **FALSE**: No notification sent (or send if "notify on success" is checked)

### Step 4: Receive Smart Notifications

When criteria is met, you'll receive an email with:

```
🤖 AI Notification Trigger:
$49 flight found for March 15 - United Airlines, non-stop

Status: Success ✓
Duration: 23s
Time: 2025-01-26 10:30 AM

[Full results and output...]
```

## Real-World Examples

### Example 1: Price Drop Alert

**Task**: Monitor product price on Amazon

**Description**:
```
Go to https://amazon.com/product/xyz and check the current price
```

**Smart Criteria**:
```
Notify me if the price is below $100
```

**AI Evaluation**:
- Finds price: $89.99
- Criteria: Price < $100? → **TRUE**
- Notification Reason: "Price is $89.99, which is below $100"
- ✅ **Email sent!**

### Example 2: Stock Availability

**Task**: Check if iPhone 15 Pro is in stock

**Description**:
```
Visit Apple Store and check stock for iPhone 15 Pro Max 256GB in Space Black
```

**Smart Criteria**:
```
Notify me if the product is in stock
```

**AI Evaluation**:
- Checks availability status
- Criteria: In stock? → **TRUE**
- Notification Reason: "iPhone 15 Pro Max 256GB Space Black is available for pickup at Apple Union Square"
- ✅ **Email sent!**

### Example 3: Appointment Finder

**Task**: Check for DMV appointments

**Description**:
```
Go to DMV website and check for available driver's license appointments
```

**Smart Criteria**:
```
Notify me if there's an appointment available before March 1st
```

**AI Evaluation**:
- Scans available dates
- Criteria: Date before March 1st? → **TRUE**
- Notification Reason: "Appointment available on February 28th at 2:00 PM"
- ✅ **Email sent!**

### Example 4: Flight Deal Hunter

**Task**: Find cheap flights to Hawaii

**Description**:
```
Search Google Flights for roundtrip flights from SFO to HNL in June
```

**Smart Criteria**:
```
Notify me if any roundtrip flight is under $400 total
```

**AI Evaluation**:
- Finds flights ranging from $450-$650
- Criteria: Any under $400? → **FALSE**
- No notification sent (saves your inbox!)

### Example 5: Hotel Bargain Alert

**Task**: Find affordable hotels in Tokyo

**Description**:
```
Search Booking.com for hotels in Tokyo for May 15-20
```

**Smart Criteria**:
```
Notify me if the cheapest hotel with 4+ stars is less than $150 per night
```

**AI Evaluation**:
- Filters 4+ star hotels
- Finds cheapest: $139/night
- Criteria: $139 < $150? → **TRUE**
- Notification Reason: "Found Hotel Gracery Shinjuku at $139/night with 4.3 stars"
- ✅ **Email sent!**

## Advanced Use Cases

### Multiple Conditions

```
Notify me if there's a flight under $300 with less than 1 stop and departure after 10am
```

The AI evaluates all conditions together!

### Date Ranges

```
Notify if appointment available between March 15-30
```

```
Notify if event tickets available for shows in April
```

### Comparative Analysis

```
Notify if Option A is cheaper than Option B by more than $50
```

```
Notify if the highest rated item is also the cheapest
```

### Text Pattern Matching

```
Notify if the description contains "free shipping"
```

```
Notify if product name includes "renewed" or "refurbished"
```

## Tips for Best Results

### ✅ Do's

1. **Be Specific**: "Notify if price under $50" is better than "Notify if cheap"
2. **Include Context**: "Notify if any flight in March is under $50" vs just "Notify if under $50"
3. **Use Clear Thresholds**: "$100", "before Friday", "4+ stars" are clear
4. **Test First**: Run manually before scheduling to verify AI understands

### ❌ Don'ts

1. **Avoid Vagueness**: "Notify if good deal" - AI needs measurable criteria
2. **Don't Overcomplicate**: Keep criteria clear and focused
3. **Avoid Impossible Criteria**: "Notify if price is $0" (unrealistic)

## How AI Evaluates Criteria

Behind the scenes:

1. **Task Execution**: AI browses the page and collects data
2. **Criteria Injection**: Your criteria is added to the AI prompt
3. **AI Analysis**:
   ```
   IMPORTANT NOTIFICATION EVALUATION:
   After completing the task above, evaluate this notification condition:
   "Notify me if any flight is under $50"

   Based on what you found, determine if this condition is TRUE or FALSE.
   - Set shouldNotify to true if the condition is met
   - Set shouldNotify to false if not met
   - In notificationReason, explain why
   ```
4. **Structured Response**:
   ```json
   {
     "result": ["Flight 1: $299", "Flight 2: $45", "Flight 3: $189"],
     "shouldNotify": true,
     "notificationReason": "$45 flight found on March 15 - Alaska Airlines"
   }
   ```
5. **Email Sent**: Only if `shouldNotify: true`

## Fallback to Basic Notifications

You can still use basic notifications alongside AI criteria:

- ✅ Notify on success
- ❌ Notify on failure
- 🤖 Smart Notification Criteria

All three work together - email is sent if ANY condition is met!

## Database Schema

For developers, the new field added:

```prisma
model NotificationSettings {
  // ... existing fields
  notificationCriteria String? @db.Text // Natural language AI criteria
}
```

## Migration

If you have existing tasks, you can:

1. Edit the task
2. Add Smart Notification Criteria
3. Save - AI evaluation will start on next run!

## Setup Requirements

1. ✅ Resend API key configured (`RESEND_API_KEY`)
2. ✅ Browser Use API key configured (`BROWSER_USE_API_KEY`)
3. ✅ Database migration applied (`npx prisma db push`)
4. ✅ Email notifications enabled in user settings

## Troubleshooting

### AI Not Triggering Notification

1. **Check criteria clarity**: Is it measurable and specific?
2. **Run manually**: See AI's evaluation in task output
3. **Check logs**: Look for `shouldNotify` and `notificationReason` in results
4. **Verify email settings**: Is email configured and "notify on success" checked?

### Email Not Received

1. **Check spam folder**
2. **Verify Resend API key** is set
3. **Check NotificationLog table** in database for errors
4. **Ensure user emailNotifications** is true

### AI Misunderstanding Criteria

1. **Rephrase more clearly**: "under $50" vs "cheap"
2. **Add context**: "flight under $50" vs just "$50"
3. **Use examples in description**: Help AI understand the page structure
4. **Test manually first**: See what data AI collects

## Examples Library

Save these for quick starts:

```
# Price Monitoring
Notify if price is below $X

# Stock Alerts
Notify if product is in stock
Notify if inventory shows more than X units

# Date-Based
Notify if appointment available before [date]
Notify if event is scheduled between [date1] and [date2]

# Comparison
Notify if Option A is cheaper than Option B
Notify if cheapest option is under $X

# Availability
Notify if seats available in rows 1-10
Notify if tickets available for section X

# Quality Checks
Notify if rating is 4 stars or higher
Notify if reviews mention "excellent" or "outstanding"
```

## Future Enhancements

Coming soon:
- Historical trend analysis ("Notify if price dropped by 20% from last week")
- Multi-page aggregation ("Check all 3 sites and notify if any has it under $50")
- Screenshot comparison ("Notify if homepage looks different")
- Sentiment analysis ("Notify if reviews turned mostly negative")

## Support

Questions? Check:
- Full documentation: `NOTIFICATION_SETUP.md`
- Email design guide: `EMAIL_NOTIFICATIONS_DESIGN.md`
- Browser Use docs: https://docs.cloud.browser-use.com

---

**Start using AI-Powered Smart Notifications today and never miss a deal, appointment, or opportunity!** 🚀✨
