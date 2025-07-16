import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const RecentActivity = ({ className, ...props }) => {
  const activities = [
    {
      id: 1,
      type: "enrollment",
      message: "Sarah Johnson enrolled in Piano Beginner class",
      time: "5 minutes ago",
      icon: "UserPlus",
      color: "text-success-600"
    },
    {
      id: 2,
      type: "payment",
      message: "Payment received from Mike Chen - $150",
      time: "1 hour ago",
      icon: "CreditCard",
      color: "text-primary-600"
    },
    {
      id: 3,
      type: "class",
      message: "Guitar Advanced class schedule updated",
      time: "2 hours ago",
      icon: "Calendar",
      color: "text-warning-600"
    },
    {
      id: 4,
      type: "attendance",
      message: "Attendance marked for Violin Intermediate",
      time: "3 hours ago",
      icon: "CheckCircle",
      color: "text-success-600"
    },
    {
      id: 5,
      type: "teacher",
      message: "New teacher Maria Garcia added to system",
      time: "1 day ago",
      icon: "UserCheck",
      color: "text-accent-600"
    }
  ];

  return (
    <Card className={cn("", className)} {...props}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-600">Latest updates and changes</p>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              activity.color,
              "bg-opacity-10"
            )}>
              <ApperIcon name={activity.icon} className={cn("w-4 h-4", activity.color)} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All Activity
        </button>
      </div>
    </Card>
  );
};

export default RecentActivity;