import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Empty = ({ 
  icon = "Music",
  title = "No data found",
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction,
  className,
  ...props 
}) => {
  return (
    <Card className={cn("text-center p-12", className)} {...props}>
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
            <ApperIcon name={icon} className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center musical-note">
            <ApperIcon name="Music" className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 max-w-md">{description}</p>
        </div>
        
        {onAction && (
          <Button onClick={onAction} variant="primary" size="lg">
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionLabel}
          </Button>
        )}
        
        <div className="flex items-center justify-center space-x-6 text-gray-400">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Music" className="w-4 h-4" />
            <span className="text-sm">Music Education</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Users" className="w-4 h-4" />
            <span className="text-sm">Student Management</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span className="text-sm">Class Scheduling</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Empty;