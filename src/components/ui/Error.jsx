import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Error = ({ 
  message = "Something went wrong", 
  description = "We encountered an error while loading your data. Please try again.",
  onRetry,
  className,
  ...props 
}) => {
  return (
    <Card className={cn("text-center p-12", className)} {...props}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-error-500 to-error-600 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{message}</h3>
          <p className="text-gray-600 max-w-md">{description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          <Button variant="outline" onClick={() => window.location.reload()}>
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 mt-4">
          <p>If the problem persists, please contact support.</p>
        </div>
      </div>
    </Card>
  );
};

export default Error;