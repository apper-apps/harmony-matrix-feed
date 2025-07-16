import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required = false, 
  children, 
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;