export function generateTaskEmail(params: {
  taskName: string;
  taskId: string;
  status: 'success' | 'failure';
  runId: string;
  output?: any;
  error?: string;
  duration?: number;
}) {
  const { taskName, taskId, status, runId, output, error, duration } = params;

  const successColor = '#10b981';
  const failureColor = '#ef4444';
  const bgColor = status === 'success' ? successColor : failureColor;

  // Extract AI notification reason if present
  const notificationReason = output?._notificationReason;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f3f4f6;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: ${bgColor};
        color: white;
        padding: 30px 20px;
        border-radius: 8px 8px 0 0;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        background: white;
        padding: 30px 20px;
        border-radius: 0 0 8px 8px;
      }
      .info {
        background: #f9fafb;
        padding: 15px;
        border-radius: 6px;
        margin: 15px 0;
        border-left: 4px solid ${bgColor};
      }
      .info p {
        margin: 8px 0;
      }
      .label {
        font-weight: 600;
        color: #6b7280;
        display: inline-block;
        min-width: 80px;
      }
      .error-box {
        background: #fee2e2;
        border-left: 4px solid #ef4444;
        padding: 15px;
        border-radius: 6px;
        margin: 15px 0;
      }
      .error-box .label {
        color: #991b1b;
      }
      .notification-reason-box {
        background: #dbeafe;
        border-left: 4px solid #3b82f6;
        padding: 15px;
        border-radius: 6px;
        margin: 15px 0;
      }
      .notification-reason-box .label {
        color: #1e40af;
        font-weight: 700;
        font-size: 14px;
      }
      .notification-reason-box p {
        margin-top: 8px;
        color: #1e3a8a;
        font-size: 14px;
      }
      .output-box {
        background: #1f2937;
        color: #f3f4f6;
        padding: 15px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 15px 0;
      }
      .output-box pre {
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .button {
        display: inline-block;
        background: #4f46e5;
        color: white !important;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        margin-top: 20px;
        font-weight: 500;
      }
      .button:hover {
        background: #4338ca;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #6b7280;
        font-size: 14px;
      }
      .footer a {
        color: #4f46e5;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${status === 'success' ? '✅' : '❌'} Task ${status === 'success' ? 'Completed' : 'Failed'}</h1>
      </div>
      <div class="content">
        <p>Your automation task <strong>${taskName}</strong> has ${status === 'success' ? 'completed successfully' : 'failed'}.</p>

        ${notificationReason ? `
          <div class="notification-reason-box">
            <p class="label">🤖 AI Notification Trigger:</p>
            <p>${notificationReason}</p>
          </div>
        ` : ''}

        <div class="info">
          <p><span class="label">Status:</span> ${status === 'success' ? 'Success ✓' : 'Failure ✗'}</p>
          <p><span class="label">Run ID:</span> ${runId}</p>
          ${duration ? `<p><span class="label">Duration:</span> ${Math.round(duration / 1000)}s</p>` : ''}
          <p><span class="label">Time:</span> ${new Date().toLocaleString()}</p>
        </div>

        ${error ? `
          <div class="error-box">
            <p class="label">Error Details:</p>
            <p style="margin-top: 10px;">${error}</p>
          </div>
        ` : ''}

        ${output ? `
          <div class="output-box">
            <pre>${JSON.stringify(output, null, 2)}</pre>
          </div>
        ` : ''}

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}" class="button">View Task Details</a>
      </div>

      <div class="footer">
        <p>You're receiving this because you enabled notifications for this task.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/tasks/${taskId}">Manage notification settings</a></p>
      </div>
    </div>
  </body>
</html>
  `.trim();
}

export function generateUsageLimitAlert(params: {
  userName: string;
  limitType: 'tasks' | 'runs';
  current: number;
  limit: number;
  plan: string;
}) {
  const { userName, limitType, current, limit, plan } = params;
  const percentage = Math.round((current / limit) * 100);

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f3f4f6;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        padding: 30px 20px;
        border-radius: 8px 8px 0 0;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        background: white;
        padding: 30px 20px;
        border-radius: 0 0 8px 8px;
      }
      .progress-bar {
        background: #e5e7eb;
        height: 30px;
        border-radius: 15px;
        overflow: hidden;
        margin: 20px 0;
      }
      .progress-fill {
        background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 14px;
      }
      .info-box {
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
        padding: 15px;
        border-radius: 6px;
        margin: 20px 0;
      }
      .button {
        display: inline-block;
        background: #4f46e5;
        color: white !important;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        margin-top: 20px;
        font-weight: 500;
      }
      .button:hover {
        background: #4338ca;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #6b7280;
        font-size: 14px;
      }
      .footer a {
        color: #4f46e5;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>⚠️ Usage Limit Alert</h1>
      </div>
      <div class="content">
        <p>Hi ${userName},</p>
        <p>You're approaching your ${limitType} limit on the <strong>${plan}</strong> plan.</p>

        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%">
            ${current} / ${limit} (${percentage}%)
          </div>
        </div>

        <div class="info-box">
          <p><strong>Current usage:</strong> ${current} ${limitType}</p>
          <p><strong>Plan limit:</strong> ${limit} ${limitType}</p>
          <p><strong>Remaining:</strong> ${limit - current} ${limitType}</p>
        </div>

        <p>To continue using BrowserCron without interruption, consider upgrading to a higher plan.</p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" class="button">View Plans & Upgrade</a>
      </div>

      <div class="footer">
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View Dashboard</a></p>
      </div>
    </div>
  </body>
</html>
  `.trim();
}

export function generateWeeklyDigest(params: {
  userName: string;
  stats: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    tasks: Array<{ name: string; runs: number; successRate: number }>;
  };
}) {
  const { userName, stats } = params;
  const successRate = stats.totalRuns > 0
    ? Math.round((stats.successfulRuns / stats.totalRuns) * 100)
    : 0;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f3f4f6;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        color: white;
        padding: 30px 20px;
        border-radius: 8px 8px 0 0;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        background: white;
        padding: 30px 20px;
        border-radius: 0 0 8px 8px;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin: 20px 0;
      }
      .stat-card {
        background: #f9fafb;
        padding: 15px;
        border-radius: 6px;
        text-align: center;
      }
      .stat-value {
        font-size: 32px;
        font-weight: 700;
        color: #4f46e5;
      }
      .stat-label {
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        margin-top: 5px;
      }
      .task-list {
        margin: 20px 0;
      }
      .task-item {
        background: #f9fafb;
        padding: 15px;
        border-radius: 6px;
        margin: 10px 0;
        border-left: 4px solid #4f46e5;
      }
      .task-name {
        font-weight: 600;
        margin-bottom: 5px;
      }
      .task-stats {
        font-size: 14px;
        color: #6b7280;
      }
      .button {
        display: inline-block;
        background: #4f46e5;
        color: white !important;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        margin-top: 20px;
        font-weight: 500;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #6b7280;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📊 Your Weekly Summary</h1>
      </div>
      <div class="content">
        <p>Hi ${userName},</p>
        <p>Here's a summary of your automation tasks from the past week:</p>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.totalRuns}</div>
            <div class="stat-label">Total Runs</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #10b981;">${stats.successfulRuns}</div>
            <div class="stat-label">Successful</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #ef4444;">${stats.failedRuns}</div>
            <div class="stat-label">Failed</div>
          </div>
        </div>

        <p><strong>Overall Success Rate:</strong> ${successRate}%</p>

        ${stats.tasks.length > 0 ? `
          <h3>Top Tasks</h3>
          <div class="task-list">
            ${stats.tasks.slice(0, 5).map(task => `
              <div class="task-item">
                <div class="task-name">${task.name}</div>
                <div class="task-stats">${task.runs} runs • ${task.successRate}% success rate</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Dashboard</a>
      </div>

      <div class="footer">
        <p>You're receiving this weekly digest because you enabled it in your settings.</p>
      </div>
    </div>
  </body>
</html>
  `.trim();
}
