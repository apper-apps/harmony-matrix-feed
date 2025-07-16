import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  hover = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300";
  
  const variants = {
    default: "p-6",
    compact: "p-4",
    padded: "p-8",
    none: ""
  };
  
  const hoverClasses = hover ? "hover:shadow-xl hover:transform hover:-translate-y-1 cursor-pointer" : "";
  
  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        hoverClasses,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;