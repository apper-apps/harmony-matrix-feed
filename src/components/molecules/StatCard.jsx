import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "neutral",
  className,
  ...props 
}) => {
  const changeColors = {
    positive: "text-success-600 bg-success-50",
    negative: "text-error-600 bg-error-50",
    neutral: "text-gray-600 bg-gray-50"
  };

  return (
    <Card className={cn("relative overflow-hidden", className)} hover {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          
          {change && (
            <div className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              changeColors[changeType]
            )}>
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                className="w-3 h-3" 
              />
              {change}
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* Subtle background gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>
    </Card>
  );
};

export default StatCard;