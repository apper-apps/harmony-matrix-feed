import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const QuickActions = ({ className, ...props }) => {
  const actions = [
    { 
      icon: "UserPlus", 
      label: "Add Student", 
      description: "Enroll a new student",
      variant: "primary",
      onClick: () => console.log("Add student")
    },
    { 
      icon: "UserCheck", 
      label: "Add Teacher", 
      description: "Register a new teacher",
      variant: "secondary",
      onClick: () => console.log("Add teacher")
    },
    { 
      icon: "BookOpen", 
      label: "New Class", 
      description: "Create a new class",
      variant: "accent",
      onClick: () => console.log("New class")
    },
    { 
      icon: "Calendar", 
      label: "Schedule", 
      description: "Manage class schedule",
      variant: "success",
      onClick: () => console.log("Schedule")
    }
  ];

  return (
    <Card className={cn("", className)} {...props}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            onClick={action.onClick}
            className="flex items-center gap-3 p-4 h-auto text-left justify-start"
          >
            <div className="flex-shrink-0">
              <ApperIcon name={action.icon} className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{action.label}</p>
              <p className="text-sm opacity-90">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;