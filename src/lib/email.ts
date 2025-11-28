import { Resend } from 'resend';
import { db } from './db';
import { generateTaskEmail, generateUsageLimitAlert, generateWeeklyDigest } from './email-templates';

// Initialize Resend only if API key is available
let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('RESEND_API_KEY not set - email notifications will be disabled');
}

interface TaskNotificationParams {
  to: string;
  taskName: string;
  taskId: string;
  status: 'success' | 'failure';
  runId: string;
  userId: string;
  output?: any;
  error?: string;
  duration?: number;
}

export async function sendTaskNotification(params: TaskNotificationParams) {
  if (!resend) {
    console.warn('Resend not initialized - skipping email notification');
    return null;
  }

  const { to, taskName, taskId, status, runId, output, error, duration, userId } = params;

  const subject = status === 'success'
    ? `✅ Task "${taskName}" completed successfully`
    : `❌ Task "${taskName}" failed`;

  const html = generateTaskEmail({ taskName, taskId, status, runId, output, error, duration });

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'BrowserCron <notifications@resend.dev>',
      to: to,
      subject: subject,
      html: html,
    });

    // Log successful notification
    await db.notificationLog.create({
      data: {
        userId,
        taskId,
        type: `task_${status}`,
        email: to,
        subject: subject,
        status: 'sent',
      },
    });

    return result;
  } catch (error: any) {
    console.error('Failed to send email:', error);

    // Log failed notification
    await db.notificationLog.create({
      data: {
        userId,
        taskId,
        type: `task_${status}`,
        email: to,
        subject: subject,
        status: 'failed',
        errorMsg: error.message || 'Unknown error',
      },
    });

    throw error;
  }
}

interface UsageLimitAlertParams {
  to: string;
  userName: string;
  userId: string;
  limitType: 'tasks' | 'runs';
  current: number;
  limit: number;
  plan: string;
}

export async function sendUsageLimitAlert(params: UsageLimitAlertParams) {
  if (!resend) {
    console.warn('Resend not initialized - skipping usage limit alert');
    return null;
  }

  const { to, userName, userId, limitType, current, limit, plan } = params;

  const subject = `⚠️ You're approaching your ${limitType} limit (${current}/${limit})`;

  const html = generateUsageLimitAlert({ userName, limitType, current, limit, plan });

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'BrowserCron <notifications@resend.dev>',
      to: to,
      subject: subject,
      html: html,
    });

    // Log notification
    await db.notificationLog.create({
      data: {
        userId,
        type: `usage_limit_${limitType}`,
        email: to,
        subject: subject,
        status: 'sent',
      },
    });

    return result;
  } catch (error: any) {
    console.error('Failed to send usage limit alert:', error);

    await db.notificationLog.create({
      data: {
        userId,
        type: `usage_limit_${limitType}`,
        email: to,
        subject: subject,
        status: 'failed',
        errorMsg: error.message || 'Unknown error',
      },
    });

    throw error;
  }
}

interface WeeklyDigestParams {
  to: string;
  userName: string;
  userId: string;
  stats: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    tasks: Array<{ name: string; runs: number; successRate: number }>;
  };
}

export async function sendWeeklyDigest(params: WeeklyDigestParams) {
  if (!resend) {
    console.warn('Resend not initialized - skipping weekly digest');
    return null;
  }

  const { to, userName, userId, stats } = params;

  const subject = `📊 Your Weekly BrowserCron Summary`;

  const html = generateWeeklyDigest({ userName, stats });

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'BrowserCron <notifications@resend.dev>',
      to: to,
      subject: subject,
      html: html,
    });

    // Log notification
    await db.notificationLog.create({
      data: {
        userId,
        type: 'weekly_digest',
        email: to,
        subject: subject,
        status: 'sent',
      },
    });

    return result;
  } catch (error: any) {
    console.error('Failed to send weekly digest:', error);

    await db.notificationLog.create({
      data: {
        userId,
        type: 'weekly_digest',
        email: to,
        subject: subject,
        status: 'failed',
        errorMsg: error.message || 'Unknown error',
      },
    });

    throw error;
  }
}

// Helper function to check custom notification rules
export function checkCustomRules(customRules: any, output: any): boolean {
  if (!customRules || !Array.isArray(customRules)) {
    return false;
  }

  for (const rule of customRules) {
    if (!rule.enabled) continue;

    const outputString = JSON.stringify(output).toLowerCase();
    const value = rule.value.toLowerCase();

    switch (rule.type) {
      case 'text_contains':
        if (outputString.includes(value)) return true;
        break;
      case 'text_not_contains':
        if (!outputString.includes(value)) return true;
        break;
      case 'output_contains':
        if (outputString.includes(value)) return true;
        break;
      // Additional rule types can be added here
      default:
        break;
    }
  }

  return false;
}
