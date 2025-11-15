import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-indigo-600 text-white hover:bg-indigo-700",
      outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700",
      ghost: "hover:bg-slate-100 text-slate-700",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-11 px-8 text-base",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
