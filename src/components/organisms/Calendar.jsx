import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const Calendar = ({ 
  events = [], 
  onDateSelect,
  onEventClick,
  className,
  ...props 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  return (
    <Card className={cn("", className)} {...props}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(-1)}
            className="p-2"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(1)}
            className="p-2"
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {daysInMonth.map((date) => {
          const dayEvents = getEventsForDate(date);
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={cn(
                "p-2 text-sm h-16 flex flex-col items-center justify-start rounded-lg transition-all duration-200 hover:bg-gray-50",
                isTodayDate && "bg-primary-50 text-primary-600 font-semibold",
                isSelected && "bg-primary-500 text-white hover:bg-primary-600",
                !isSameMonth(date, currentDate) && "text-gray-400"
              )}
            >
              <span className="mb-1">{format(date, "d")}</span>
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {dayEvents.slice(0, 2).map((event, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        event.type === "class" && "bg-primary-500",
                        event.type === "trial" && "bg-secondary-500",
                        event.type === "event" && "bg-accent-500"
                      )}
                    />
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-xs text-gray-500">+{dayEvents.length - 2}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Events for selected date */}
      {selectedDate && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Events for {format(selectedDate, "MMMM d, yyyy")}
          </h4>
          <div className="space-y-2">
            {getEventsForDate(selectedDate).map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick && onEventClick(event)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    event.type === "class" && "bg-primary-500",
                    event.type === "trial" && "bg-secondary-500",
                    event.type === "event" && "bg-accent-500"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                </div>
              </button>
            ))}
            {getEventsForDate(selectedDate).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No events scheduled for this date
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default Calendar;