import { BrowserUseClient } from "browser-use-sdk";
import { z } from "zod";

if (!process.env.BROWSER_USE_API_KEY) {
  throw new Error("BROWSER_USE_API_KEY is not set in environment variables");
}

const client = new BrowserUseClient({
  apiKey: process.env.BROWSER_USE_API_KEY,
});

export interface BrowserTaskResult {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: any;
  error?: string;
  logs?: string[];
}

// Default output schema - structured result array
const DefaultTaskOutput = z.object({
  result: z.array(z.string()),
});

/**
 * Run a browser automation task using Browser Use Cloud
 * @param taskDescription Natural language description of the task
 * @param waitForCompletion Whether to wait for task completion (default: true)
 * @param startUrl Optional starting URL for the browser
 * @returns Task result with status and output
 */
export async function runBrowserTask(
  taskDescription: string,
  waitForCompletion: boolean = true,
  startUrl?: string
): Promise<BrowserTaskResult> {
  try {
    // Create the task using the correct SDK method with structured output
    const task = await client.tasks.createTask({
      task: taskDescription,
      startUrl: startUrl || null,
      schema: DefaultTaskOutput,
    });

    if (!waitForCompletion) {
      return {
        id: task.id || "",
        status: "pending",
      };
    }

    // Poll for completion instead of using task.complete()
    const maxAttempts = 60; // 5 minutes (5 seconds * 60)
    let attempts = 0;

    while (attempts < maxAttempts) {
      const taskStatus = await client.tasks.getTask({ task_id: task.id! });

      if (taskStatus.status === "finished") {
        return {
          id: task.id || "",
          status: "completed",
          result: (taskStatus as any).parsed || (taskStatus as any).output,
          logs: (taskStatus as any).logs || [],
        };
      }

      if (taskStatus.status === "stopped") {
        throw new Error("Task was stopped");
      }

      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    throw new Error("Task completion timeout after 5 minutes");
  } catch (error: any) {
    return {
      id: "",
      status: "failed",
      error: error?.message ?? "Unknown error occurred",
    };
  }
}

/**
 * Get the status of a browser task
 * @param taskId The ID of the task
 * @returns Task status and result
 */
export async function getTaskStatus(taskId: string): Promise<BrowserTaskResult> {
  try {
    // Note: This may need adjustment based on SDK's actual API
    const result = await client.tasks.getTask({ task_id: taskId });

    return {
      id: taskId,
      status: result.status as any,
      result: (result as any).output,
      logs: (result as any).logs || [],
    };
  } catch (error: any) {
    return {
      id: taskId,
      status: "failed",
      error: error?.message ?? "Failed to get task status",
    };
  }
}
