import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ 
  className, 
  size = "md", 
  src,
  alt,
  fallback,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-medium overflow-hidden";
  
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    "2xl": "w-20 h-20 text-xl"
  };
  
  return (
    <div
      className={cn(
        baseClasses,
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;