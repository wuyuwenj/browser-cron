"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface TaskRun {
  id: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  errorMsg: string | null;
  logs: string | null;
}

interface Task {
  id: string;
  name: string;
  description: string;
  targetSite: string;
  cronSchedule: string | null;
  isActive: boolean;
  createdAt: string;
  runs: TaskRun[];
}

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchTask = () => {
    fetch(`/api/tasks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTask(data.task);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch task:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleRunTask = async () => {
    setRunning(true);
    try {
      const response = await fetch(`/api/tasks/${id}/run`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to run task");
      }

      // Refresh task data to show new run
      setTimeout(fetchTask, 1000);
    } catch (error) {
      console.error("Failed to run task:", error);
    } finally {
      setRunning(false);
    }
  };

  const handleToggleActive = async () => {
    if (!task) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !task.isActive,
        }),
      });

      if (response.ok) {
        fetchTask();
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <p>Task not found</p>
          <Link href="/tasks" className="text-blue-600 hover:underline">
            ← Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/tasks" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Tasks
          </Link>

          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold">{task.name}</h1>
            <div className="flex gap-2">
              <button
                onClick={handleToggleActive}
                className={`px-4 py-2 rounded-lg transition ${
                  task.isActive
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {task.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={handleRunTask}
                disabled={running}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {running ? "Running..." : "Run Now"}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-3">
            <div>
              <span className="font-semibold">Description:</span>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
            </div>
            <div className="flex gap-6">
              <div>
                <span className="font-semibold">Target Site:</span> {task.targetSite}
              </div>
              {task.cronSchedule && (
                <div>
                  <span className="font-semibold">Schedule:</span> {task.cronSchedule}
                </div>
              )}
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    task.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Run History</h2>
          {task.runs.length === 0 ? (
            <div className="border rounded-lg p-6 text-center text-gray-500">
              No runs yet. Click "Run Now" to execute this task.
            </div>
          ) : (
            <div className="space-y-3">
              {task.runs.map((run) => (
                <div key={run.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          run.status === "success"
                            ? "bg-green-100 text-green-800"
                            : run.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : run.status === "running"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {run.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(run.startedAt).toLocaleString()}
                      </span>
                      {run.finishedAt && (
                        <span className="text-sm text-gray-500">
                          (
                          {Math.round(
                            (new Date(run.finishedAt).getTime() -
                              new Date(run.startedAt).getTime()) /
                              1000
                          )}
                          s)
                        </span>
                      )}
                    </div>
                  </div>

                  {run.errorMsg && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                      <p className="text-sm text-red-800">{run.errorMsg}</p>
                    </div>
                  )}

                  {run.logs && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600 hover:underline">
                        View Logs
                      </summary>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded mt-2 text-xs overflow-x-auto">
                        {run.logs}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
