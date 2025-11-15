import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runBrowserTask } from "@/lib/browserUse";

// POST /api/tasks/[id]/run - Manually run a task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the task
    const task = await db.task.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Create a task run record
    const taskRun = await db.taskRun.create({
      data: {
        taskId: task.id,
        status: "running",
        startedAt: new Date(),
      },
    });

    // Run the browser task (async)
    runBrowserTask(task.description, true)
      .then(async (result) => {
        await db.taskRun.update({
          where: { id: taskRun.id },
          data: {
            status: result.status === "completed" ? "success" : "failed",
            finishedAt: new Date(),
            outputJson: result.result || null,
            errorMsg: result.error || null,
            logs: result.logs?.join("\n") || null,
          },
        });
      })
      .catch(async (error) => {
        await db.taskRun.update({
          where: { id: taskRun.id },
          data: {
            status: "failed",
            finishedAt: new Date(),
            errorMsg: error?.message ?? "Unknown error",
          },
        });
      });

    return NextResponse.json({
      taskRun,
      message: "Task execution started",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to run task" },
      { status: 500 }
    );
  }
}
