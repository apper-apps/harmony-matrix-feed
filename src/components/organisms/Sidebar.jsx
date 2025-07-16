import { useState } from "react";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import NavLink from "@/components/molecules/NavLink";
import { cn } from "@/utils/cn";

const Sidebar = ({ className, ...props }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/students", icon: "Users", label: "Students" },
    { to: "/teachers", icon: "UserCheck", label: "Teachers" },
    { to: "/classes", icon: "BookOpen", label: "Classes" },
    { to: "/schedule", icon: "Calendar", label: "Schedule" },
    { to: "/attendance", icon: "CheckCircle", label: "Attendance" },
    { to: "/billing", icon: "CreditCard", label: "Billing" },
    { to: "/reports", icon: "BarChart3", label: "Reports" },
    { to: "/settings", icon: "Settings", label: "Settings" }
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={cn(
      "hidden lg:block w-64 bg-white border-r border-gray-200 h-full",
      className
    )}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Music" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Harmony Hub</h1>
            <p className="text-xs text-gray-500">Music Center</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              icon={item.icon}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Music" className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold gradient-text">Harmony Hub</h1>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-64 bg-white h-full shadow-xl transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Music" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold gradient-text">Harmony Hub</h1>
                    <p className="text-xs text-gray-500">Music Center</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;