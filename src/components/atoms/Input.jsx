import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed";
  
  const errorClasses = error ? "border-error-500 focus:border-error-500 focus:ring-error-200" : "";
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          baseClasses,
          errorClasses,
          disabled && "opacity-50",
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-500 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;