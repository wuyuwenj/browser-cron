"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetSite: "",
    cronSchedule: "",
    userId: "demo-user", // In production, this would come from auth
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cronSchedule: formData.cronSchedule || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      router.push(`/tasks/${data.task.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create New Task</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Task Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="e.g., Download Stripe Invoices"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description (Natural Language) *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 h-32"
              placeholder="e.g., Log into Stripe dashboard, navigate to invoices, download all invoices from the last month as PDF files"
            />
            <p className="text-sm text-gray-500 mt-1">
              Describe what you want the browser to do in plain English
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Target Site *
            </label>
            <input
              type="text"
              required
              value={formData.targetSite}
              onChange={(e) =>
                setFormData({ ...formData, targetSite: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
              placeholder="e.g., stripe, amazon, linkedin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cron Schedule (Optional)
            </label>
            <input
              type="text"
              value={formData.cronSchedule}
              onChange={(e) =>
                setFormData({ ...formData, cronSchedule: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
              placeholder="e.g., 0 9 * * MON (Every Monday at 9am)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty for manual execution only. Examples:
              <br />• <code>0 9 * * *</code> - Daily at 9am
              <br />• <code>0 9 * * MON</code> - Every Monday at 9am
              <br />• <code>0 0 1 * *</code> - First day of every month
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
            <Link
              href="/tasks"
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
