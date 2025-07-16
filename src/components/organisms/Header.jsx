import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ className, ...props }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, message: "New student enrollment: Sarah Johnson", time: "5 min ago", type: "info" },
    { id: 2, message: "Class schedule updated for Piano Beginner", time: "1 hour ago", type: "warning" },
    { id: 3, message: "Payment received from Mike Chen", time: "2 hours ago", type: "success" }
  ];

  return (
    <header className={cn("bg-white border-b border-gray-200 px-6 py-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 relative"
            >
              <ApperIcon name="Bell" className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
            </Button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <Avatar size="sm" fallback="JD" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-500" />
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left">
                    <ApperIcon name="User" className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900">Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left">
                    <ApperIcon name="Settings" className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900">Settings</span>
                  </button>
                  <hr className="my-2" />
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left">
                    <ApperIcon name="LogOut" className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;