import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-indigo-100 text-indigo-800 border-indigo-200",
    secondary: "bg-slate-100 text-slate-800 border-slate-200",
    outline: "border-slate-300 text-slate-700 bg-transparent",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export { Badge };
