import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg",
    success: "bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg",
    warning: "bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg",
    error: "bg-gradient-to-r from-error-500 to-error-600 text-white shadow-lg",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg",
    outline: "border-2 border-gray-200 text-gray-700 bg-white",
    ghost: "text-gray-600 hover:bg-gray-50"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <span
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;