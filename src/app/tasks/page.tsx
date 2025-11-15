"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Task {
  id: string;
  name: string;
  description: string;
  targetSite: string;
  cronSchedule: string | null;
  isActive: boolean;
  createdAt: string;
  runs: Array<{
    id: string;
    status: string;
    startedAt: string;
  }>;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">All Tasks</h1>
          <Link
            href="/tasks/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create New Task
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No tasks yet. Create your first automation task!
            </p>
            <Link
              href="/tasks/new"
              className="text-blue-600 hover:underline"
            >
              Create Task
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="block border rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-semibold">{task.name}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      task.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {task.description}
                </p>

                <div className="flex gap-4 text-sm text-gray-500">
                  <span>🎯 {task.targetSite}</span>
                  {task.cronSchedule && <span>⏰ {task.cronSchedule}</span>}
                  {task.runs.length > 0 && (
                    <span>
                      Last run:{" "}
                      {task.runs[0].status === "success" ? "✅" : "❌"}{" "}
                      {new Date(task.runs[0].startedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
