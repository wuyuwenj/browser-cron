"use client";

import { useState, useEffect } from "react";
import CronParser from "cron-parser";

type ScheduleType = "minutes" | "dayTime" | "monthTime" | "onceAYearTime" | "custom" | "none";

interface CronSchedulePickerProps {
  value: string;
  onChange: (cronExpression: string) => void;
}

export default function CronSchedulePicker({ value, onChange }: CronSchedulePickerProps) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>("none");
  const [minuteInterval, setMinuteInterval] = useState(15);
  const [dayHour, setDayHour] = useState(0);
  const [dayMinute, setDayMinute] = useState(0);
  const [monthDay, setMonthDay] = useState(1);
  const [monthHour, setMonthHour] = useState(0);
  const [monthMinute, setMonthMinute] = useState(0);
  const [yearDay, setYearDay] = useState(1);
  const [yearMonth, setYearMonth] = useState(1);
  const [yearHour, setYearHour] = useState(0);
  const [yearMinute, setYearMinute] = useState(0);
  const [customCron, setCustomCron] = useState("");
  const [nextExecutions, setNextExecutions] = useState<Date[]>([]);

  // Initialize from existing value
  useEffect(() => {
    if (!value) {
      setScheduleType("none");
    } else {
      // Try to detect schedule type from cron expression
      const parts = value.split(" ");
      if (parts.length === 5) {
        // Check for minute intervals
        if (value.match(/^\*\/\d+ \* \* \* \*$/)) {
          const interval = parseInt(value.split("/")[1].split(" ")[0]);
          setScheduleType("minutes");
          setMinuteInterval(interval);
        } else if (value.match(/^\d+ \d+ \* \* \*$/)) {
          // Daily at specific time
          setScheduleType("dayTime");
          setDayMinute(parseInt(parts[0]));
          setDayHour(parseInt(parts[1]));
        } else if (value.match(/^\d+ \d+ \d+ \* \*$/)) {
          // Monthly on specific day and time
          setScheduleType("monthTime");
          setMonthMinute(parseInt(parts[0]));
          setMonthHour(parseInt(parts[1]));
          setMonthDay(parseInt(parts[2]));
        } else if (value.match(/^\d+ \d+ \d+ \d+ \*$/)) {
          // Yearly on specific date and time
          setScheduleType("onceAYearTime");
          setYearMinute(parseInt(parts[0]));
          setYearHour(parseInt(parts[1]));
          setYearDay(parseInt(parts[2]));
          setYearMonth(parseInt(parts[3]));
        } else {
          setScheduleType("custom");
          setCustomCron(value);
        }
      } else {
        setScheduleType("custom");
        setCustomCron(value);
      }
    }
  }, [value]);

  // Generate cron expression based on current settings
  const generateCronExpression = (): string => {
    switch (scheduleType) {
      case "none":
        return "";
      case "minutes":
        return `*/${minuteInterval} * * * *`;
      case "dayTime":
        return `${dayMinute} ${dayHour} * * *`;
      case "monthTime":
        return `${monthMinute} ${monthHour} ${monthDay} * *`;
      case "onceAYearTime":
        return `${yearMinute} ${yearHour} ${yearDay} ${yearMonth} *`;
      case "custom":
        return customCron;
      default:
        return "";
    }
  };

  // Update parent when settings change
  useEffect(() => {
    const cron = generateCronExpression();
    onChange(cron);
    calculateNextExecutions(cron);
  }, [scheduleType, minuteInterval, dayHour, dayMinute, monthDay, monthHour, monthMinute, yearDay, yearMonth, yearHour, yearMinute, customCron]);

  const calculateNextExecutions = (cronExpression: string) => {
    if (!cronExpression) {
      setNextExecutions([]);
      return;
    }

    try {
      const interval = CronParser.parse(cronExpression);
      const executions: Date[] = [];
      for (let i = 0; i < 5; i++) {
        executions.push(interval.next().toDate());
      }
      setNextExecutions(executions);
    } catch (error) {
      setNextExecutions([]);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <fieldset>
        <legend className="text-lg font-semibold mb-4">Execution Schedule</legend>

        <div className="space-y-3">
          {/* No Schedule */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="scheduleType"
              value="none"
              checked={scheduleType === "none"}
              onChange={() => setScheduleType("none")}
              className="mt-1"
            />
            <span>Manual execution only</span>
          </label>

          {/* Every X minutes */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="scheduleType"
              value="minutes"
              checked={scheduleType === "minutes"}
              onChange={() => setScheduleType("minutes")}
              className="mt-1"
            />
            <div className="flex items-center gap-2">
              <span>Every</span>
              <select
                value={minuteInterval}
                onChange={(e) => setMinuteInterval(Number(e.target.value))}
                disabled={scheduleType !== "minutes"}
                className="border rounded px-2 py-1 disabled:opacity-50"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
          </label>

          {/* Every day at HH:MM */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="scheduleType"
              value="dayTime"
              checked={scheduleType === "dayTime"}
              onChange={() => setScheduleType("dayTime")}
              className="mt-1"
            />
            <div className="flex items-center gap-2">
              <span>Every day at</span>
              <select
                value={dayHour}
                onChange={(e) => setDayHour(Number(e.target.value))}
                disabled={scheduleType !== "dayTime"}
                className="border rounded px-2 py-1 disabled:opacity-50"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <span>:</span>
              <select
                value={dayMinute}
                onChange={(e) => setDayMinute(Number(e.target.value))}
                disabled={scheduleType !== "dayTime"}
                className="border rounded px-2 py-1 disabled:opacity-50"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </label>

          {/* Every X day of month at HH:MM */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="scheduleType"
              value="monthTime"
              checked={scheduleType === "monthTime"}
              onChange={() => setScheduleType("monthTime")}
              className="mt-1"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <span>Every</span>
              <select
                value={monthDay}
                onChange={(e) => setMonthDay(Number(e.target.value))}
                disabled={scheduleType !== "monthTime"}
                className="border rounded px-2 py-1 disabled:opacity-50"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}.</option>
                ))}
              </select>
              <span>of the month at</span>
              <select
                value={monthHour}
                onChange={(e) => setMonthHour(Number(e.target.value))}
                disabled={scheduleType !== "monthTime"}
                className="border rounded px-2 py-1 disabled:opacity-50"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <span>:</span>
              <select
                value={monthMinute}
                onChange={(e) => setMonthMinute(Number(e.target.value))}
                disabled={scheduleType !== "monthTime"}
                className="border rounded px-2 py-1 disabled:opacity-50"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </label>

          {/* Every year on DD Month at HH:MM */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="scheduleType"
              value="onceAYearTime"
              checked={scheduleType === "onceAYearTime"}
              onChange={() => setScheduleType("onceAYearTime")}
              className="mt-1"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <span>Every year on</span>
              <select
                value={yearDay}
                onChange={(e) => setYearDay(Number(e.target.value))}
                disabled={scheduleType !== "onceAYearTime"}
                className="border rounded px-2 py-1 disabled:opacity-50"
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}.</option>
                ))}
              </select>
              <select
                value={yearMonth}
                onChange={(e) => setYearMonth(Number(e.target.value))}
                disabled={scheduleType !== "onceAYearTime"}
                className="border rounded px-2 py-1 disabled:opacity-50"
              >
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => (
                  <option key={i + 1} value={i + 1}>{month}</option>
                ))}
              </select>
              <span>at</span>
              <select
                value={yearHour}
                onChange={(e) => setYearHour(Number(e.target.value))}
                disabled={scheduleType !== "onceAYearTime"}
                className="border rounded px-2 py-1 disabled:opacity-50"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <span>:</span>
              <select
                value={yearMinute}
                onChange={(e) => setYearMinute(Number(e.target.value))}
                disabled={scheduleType !== "onceAYearTime"}
                className="border rounded px-2 py-1 disabled:opacity-50"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </label>

          {/* Custom cron */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="scheduleType"
              value="custom"
              checked={scheduleType === "custom"}
              onChange={() => setScheduleType("custom")}
              className="mt-1"
            />
            <span>Custom</span>
          </label>
        </div>

        {scheduleType === "custom" && (
          <div className="mt-4">
            <input
              type="text"
              value={customCron}
              onChange={(e) => setCustomCron(e.target.value)}
              placeholder="0 9 * * MON"
              className="w-full border rounded-lg px-4 py-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a cron expression (e.g., <code>0 9 * * MON</code> for every Monday at 9am)
            </p>
          </div>
        )}
      </fieldset>

      {/* Next executions preview */}
      {scheduleType !== "none" && nextExecutions.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Next Executions</h3>
          <ul className="space-y-2">
            {nextExecutions.map((date, i) => (
              <li key={i} className="text-sm">
                {formatDate(date)}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            Times shown in your local timezone
          </p>
        </div>
      )}

      {/* Display cron expression */}
      {scheduleType !== "none" && generateCronExpression() && (
        <div className="border-t pt-4">
          <label className="block text-sm font-medium mb-2">
            Cron Expression
          </label>
          <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg px-4 py-2 font-mono text-sm">
            {generateCronExpression()}
          </div>
        </div>
      )}
    </div>
  );
}
