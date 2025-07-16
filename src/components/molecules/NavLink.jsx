import { NavLink as RouterNavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavLink = ({ 
  to, 
  icon, 
  children, 
  className,
  ...props 
}) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 group",
        isActive ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg" : "text-gray-600 hover:text-gray-900",
        className
      )}
      {...props}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          className="w-5 h-5 transition-all duration-200 group-hover:scale-110" 
        />
      )}
      <span>{children}</span>
    </RouterNavLink>
  );
};

export default NavLink;