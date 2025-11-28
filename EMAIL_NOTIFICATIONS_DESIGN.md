# Email Notification System Design

## Overview

Allow users to receive email notifications when specific criteria are met during task execution.

## Features

### 1. Notification Types

#### A. Task-Level Notifications
- ✅ Task completed successfully
- ❌ Task failed
- ⚠️ Task is taking longer than expected (> 5 minutes)
- 📊 Daily/Weekly summary of all tasks

#### B. Criteria-Based Notifications (Custom Conditions)
Users can set custom conditions to trigger notifications:

**Examples:**
- "Notify me if the text 'Out of Stock' appears on the page"
- "Notify me if the price is below $100"
- "Notify me if any error occurs"
- "Notify me if a specific element is found/not found"

#### C. System Notifications
- 🚨 Approaching task limit (e.g., 8/10 tasks used)
- 🚨 Approaching run limit (e.g., 90/100 runs used this month)
- 💳 Payment failed
- 💳 Subscription expiring soon

### 2. Notification Settings (Per Task)

Users can configure:
- **Notify on success**: Yes/No
- **Notify on failure**: Yes/No
- **Notify on specific conditions**: Custom criteria
- **Email frequency**:
  - Immediately (every run)
  - Daily digest (once per day)
  - Weekly summary (once per week)
  - Only when condition met

### 3. Custom Criteria System

Allow users to define conditions using simple rules:

```typescript
interface NotificationRule {
  id: string;
  type: 'text_contains' | 'text_not_contains' | 'element_exists' | 'element_not_exists' | 'output_contains';
  value: string;
  enabled: boolean;
}
```

**Examples:**
- Type: `text_contains`, Value: "Out of Stock"
- Type: `output_contains`, Value: "error"
- Type: `element_exists`, Value: ".sale-badge"

## Database Schema Updates

```prisma
model Task {
  // ... existing fields
  notificationSettings NotificationSettings?
}

model NotificationSettings {
  id                  String   @id @default(cuid())
  taskId              String   @unique
  task                Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  // Basic notifications
  notifyOnSuccess     Boolean  @default(false)
  notifyOnFailure     Boolean  @default(true)  // Default to true for failures

  // Email settings
  email               String   // Can be different from user's primary email
  frequency           String   @default("immediate") // immediate, daily, weekly

  // Custom rules (stored as JSON)
  customRules         Json?

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([taskId])
}

model User {
  // ... existing fields

  // Global notification preferences
  emailNotifications  Boolean  @default(true)
  usageLimitAlerts    Boolean  @default(true)
  weeklyDigest        Boolean  @default(false)
}

model NotificationLog {
  id          String   @id @default(cuid())
  userId      String
  taskId      String?
  type        String   // task_success, task_failure, usage_limit, payment_failed, etc.
  email       String
  subject     String
  sentAt      DateTime @default(now())
  status      String   // sent, failed, queued
  errorMsg    String?

  @@index([userId])
  @@index([taskId])
  @@index([sentAt])
}
```

## Email Service Implementation

### Setup Resend (Recommended)

```bash
npm install resend
```

**File: `src/lib/email.ts`**

```typescript
import { Resend } from 'resend';
import { db } from './db';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTaskNotification(params: {
  to: string;
  taskName: string;
  status: 'success' | 'failure';
  runId: string;
  output?: any;
  error?: string;
  duration?: number;
}) {
  const { to, taskName, status, runId, output, error, duration } = params;

  const subject = status === 'success'
    ? `✅ Task "${taskName}" completed successfully`
    : `❌ Task "${taskName}" failed`;

  const html = generateTaskEmail({ taskName, status, runId, output, error, duration });

  try {
    const result = await resend.emails.send({
      from: 'BrowserCron <notifications@yourdomain.com>',
      to: to,
      subject: subject,
      html: html,
    });

    // Log notification
    await db.notificationLog.create({
      data: {
        userId: params.userId,
        taskId: params.taskId,
        type: `task_${status}`,
        email: to,
        subject: subject,
        status: 'sent',
      },
    });

    return result;
  } catch (error) {
    console.error('Failed to send email:', error);

    // Log failed notification
    await db.notificationLog.create({
      data: {
        userId: params.userId,
        taskId: params.taskId,
        type: `task_${status}`,
        email: to,
        subject: subject,
        status: 'failed',
        errorMsg: error.message,
      },
    });

    throw error;
  }
}

export async function sendUsageLimitAlert(params: {
  to: string;
  userName: string;
  limitType: 'tasks' | 'runs';
  current: number;
  limit: number;
  plan: string;
}) {
  // Implementation for usage limit alerts
}

export async function sendWeeklyDigest(params: {
  to: string;
  userName: string;
  stats: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    tasks: Array<{ name: string; runs: number; successRate: number }>;
  };
}) {
  // Implementation for weekly digest
}
```

### Email Templates

**File: `src/lib/email-templates.ts`**

```typescript
export function generateTaskEmail(params: {
  taskName: string;
  status: 'success' | 'failure';
  runId: string;
  output?: any;
  error?: string;
  duration?: number;
}) {
  const { taskName, status, runId, output, error, duration } = params;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${status === 'success' ? '#10b981' : '#ef4444'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .info { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
          .label { font-weight: 600; color: #6b7280; }
          .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${status === 'success' ? '✅' : '❌'} Task ${status === 'success' ? 'Completed' : 'Failed'}</h1>
          </div>
          <div class="content">
            <p>Your task <strong>${taskName}</strong> has ${status === 'success' ? 'completed successfully' : 'failed'}.</p>

            <div class="info">
              <p><span class="label">Status:</span> ${status === 'success' ? 'Success' : 'Failure'}</p>
              <p><span class="label">Run ID:</span> ${runId}</p>
              ${duration ? `<p><span class="label">Duration:</span> ${Math.round(duration / 1000)}s</p>` : ''}
            </div>

            ${error ? `
              <div class="info" style="background: #fee2e2; border-left: 4px solid #ef4444;">
                <p class="label">Error:</p>
                <p>${error}</p>
              </div>
            ` : ''}

            ${output ? `
              <div class="info">
                <p class="label">Output:</p>
                <pre style="background: #1f2937; color: #f3f4f6; padding: 12px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(output, null, 2)}</pre>
              </div>
            ` : ''}

            <a href="${process.env.NEXT_PUBLIC_APP_URL}/tasks/${params.taskId}" class="button">View Task Details</a>
          </div>

          <div class="footer">
            <p>You're receiving this because you enabled notifications for this task.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/tasks/${params.taskId}">Manage notification settings</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

## UI Components

### Notification Settings Toggle (in Task Form)

**File: `src/components/NotificationSettings.tsx`**

```typescript
'use client';

import { useState } from 'react';

interface NotificationRule {
  id: string;
  type: 'text_contains' | 'text_not_contains' | 'element_exists' | 'element_not_exists' | 'output_contains';
  value: string;
  enabled: boolean;
}

interface NotificationSettingsProps {
  taskId?: string;
  initialSettings?: {
    notifyOnSuccess: boolean;
    notifyOnFailure: boolean;
    email: string;
    frequency: 'immediate' | 'daily' | 'weekly';
    customRules: NotificationRule[];
  };
  onChange: (settings: any) => void;
}

export function NotificationSettings({ taskId, initialSettings, onChange }: NotificationSettingsProps) {
  const [settings, setSettings] = useState(initialSettings || {
    notifyOnSuccess: false,
    notifyOnFailure: true,
    email: '',
    frequency: 'immediate',
    customRules: [],
  });

  const [showCustomRules, setShowCustomRules] = useState(false);

  const updateSettings = (updates: Partial<typeof settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onChange(newSettings);
  };

  const addCustomRule = () => {
    const newRule: NotificationRule = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text_contains',
      value: '',
      enabled: true,
    };
    updateSettings({ customRules: [...settings.customRules, newRule] });
  };

  const updateCustomRule = (ruleId: string, updates: Partial<NotificationRule>) => {
    const updatedRules = settings.customRules.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    updateSettings({ customRules: updatedRules });
  };

  const removeCustomRule = (ruleId: string) => {
    const updatedRules = settings.customRules.filter(rule => rule.id !== ruleId);
    updateSettings({ customRules: updatedRules });
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-white">
      <h3 className="font-medium text-lg">Email Notifications</h3>

      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium mb-1">Notification Email</label>
        <input
          type="email"
          value={settings.email}
          onChange={(e) => updateSettings({ email: e.target.value })}
          placeholder="your@email.com"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Basic Toggles */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.notifyOnSuccess}
            onChange={(e) => updateSettings({ notifyOnSuccess: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Notify on success</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.notifyOnFailure}
            onChange={(e) => updateSettings({ notifyOnFailure: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Notify on failure</span>
        </label>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium mb-1">Frequency</label>
        <select
          value={settings.frequency}
          onChange={(e) => updateSettings({ frequency: e.target.value as any })}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="immediate">Immediately (every run)</option>
          <option value="daily">Daily digest</option>
          <option value="weekly">Weekly summary</option>
        </select>
      </div>

      {/* Custom Rules */}
      <div>
        <button
          type="button"
          onClick={() => setShowCustomRules(!showCustomRules)}
          className="text-sm text-indigo-600 hover:underline"
        >
          {showCustomRules ? 'Hide' : 'Add'} custom notification rules
        </button>

        {showCustomRules && (
          <div className="mt-3 space-y-3">
            {settings.customRules.map((rule) => (
              <div key={rule.id} className="flex gap-2 items-start p-3 border rounded-md bg-slate-50">
                <select
                  value={rule.type}
                  onChange={(e) => updateCustomRule(rule.id, { type: e.target.value as any })}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="text_contains">Text contains</option>
                  <option value="text_not_contains">Text doesn't contain</option>
                  <option value="output_contains">Output contains</option>
                  <option value="element_exists">Element exists</option>
                  <option value="element_not_exists">Element doesn't exist</option>
                </select>

                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) => updateCustomRule(rule.id, { value: e.target.value })}
                  placeholder="Value to check"
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />

                <button
                  type="button"
                  onClick={() => removeCustomRule(rule.id)}
                  className="text-red-600 hover:text-red-700 text-sm px-2"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addCustomRule}
              className="text-sm text-indigo-600 hover:underline"
            >
              + Add rule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Integration Points

### 1. Task Creation/Update
- Add NotificationSettings component to task form
- Save notification settings when task is created/updated

### 2. Task Execution (in `/api/tasks/[id]/run/route.ts`)
```typescript
// After task completes
const notificationSettings = await db.notificationSettings.findUnique({
  where: { taskId: task.id },
});

if (notificationSettings) {
  const shouldNotify =
    (status === 'success' && notificationSettings.notifyOnSuccess) ||
    (status === 'failed' && notificationSettings.notifyOnFailure) ||
    checkCustomRules(notificationSettings.customRules, output);

  if (shouldNotify && notificationSettings.frequency === 'immediate') {
    await sendTaskNotification({
      to: notificationSettings.email,
      taskName: task.name,
      status,
      runId: taskRun.id,
      output,
      error,
      duration,
      userId: task.userId,
      taskId: task.id,
    });
  }
}
```

### 3. Usage Limit Checks (in `/api/tasks/route.ts`)
```typescript
const { allowed, current, limit } = await checkTaskLimit(userId);

// Send alert when approaching limit (e.g., 80%)
if (current >= limit * 0.8 && user.usageLimitAlerts) {
  await sendUsageLimitAlert({
    to: user.email,
    userName: user.name,
    limitType: 'tasks',
    current,
    limit,
    plan: user.plan,
  });
}
```

### 4. Weekly Digest (Cron Job)
Create new route: `/api/send-weekly-digests`
- Run every Monday at 9am
- Gather stats for users with `weeklyDigest: true`
- Send summary email

## Implementation Phases

### Phase 1: Basic Notifications (Week 1)
- [ ] Set up Resend
- [ ] Create email templates
- [ ] Add NotificationSettings model to schema
- [ ] Implement sendTaskNotification()
- [ ] Integrate with task execution
- [ ] Add toggle in task form UI

### Phase 2: Custom Rules (Week 2)
- [ ] Build custom rules UI
- [ ] Implement rule evaluation logic
- [ ] Test with various conditions

### Phase 3: Digests & System Alerts (Week 3)
- [ ] Weekly digest email
- [ ] Usage limit alerts
- [ ] Payment failure alerts
- [ ] Notification history page

## Testing Checklist

- [ ] Send test email on task success
- [ ] Send test email on task failure
- [ ] Test custom rule: text contains
- [ ] Test custom rule: output contains
- [ ] Test daily digest (manually trigger)
- [ ] Test usage limit alert
- [ ] Verify unsubscribe works
- [ ] Test email deliverability (Gmail, Outlook)

## Cost Estimate

**Resend Pricing:**
- Free: 5,000 emails/month, 100 emails/day
- Paid: $20/mo for 50,000 emails

**Typical usage:**
- 100 users × 10 tasks/month = 1,000 emails/month (well within free tier)

## Next Steps

1. Sign up for Resend
2. Verify your domain
3. Run database migration for notification tables
4. Implement basic email sending
5. Add UI to task form
6. Test with real tasks
7. Launch! 🚀
