import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const StatusBadge = ({ status, className, ...props }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case "active":
      case "enrolled":
      case "present":
      case "approved":
      case "completed":
        return { variant: "success", text: status };
      case "inactive":
      case "suspended":
      case "cancelled":
        return { variant: "error", text: status };
      case "pending":
      case "waiting":
      case "requested":
        return { variant: "warning", text: status };
      case "absent":
      case "late":
        return { variant: "error", text: status };
      case "paid":
        return { variant: "success", text: status };
      case "unpaid":
      case "overdue":
        return { variant: "error", text: status };
      case "partial":
        return { variant: "warning", text: status };
      default:
        return { variant: "default", text: status || "Unknown" };
    }
  };

  const { variant, text } = getStatusConfig(status);

  return (
    <Badge 
      variant={variant} 
      className={cn("capitalize", className)}
      {...props}
    >
      {text}
    </Badge>
  );
};

export default StatusBadge;