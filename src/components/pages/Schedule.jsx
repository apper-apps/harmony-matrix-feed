import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Calendar from "@/components/organisms/Calendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import eventService from "@/services/api/eventService";

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar");
  const [weekEvents, setWeekEvents] = useState([]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await eventService.getAll();
      setEvents(data);
      
      // Filter events for current week
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      const weeklyEvents = data.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= weekStart && eventDate <= weekEnd;
      });
      setWeekEvents(weeklyEvents);
    } catch (err) {
      setError(err.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event) => {
    console.log("Event clicked:", event);
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "class":
        return "BookOpen";
      case "trial":
        return "UserPlus";
      case "event":
        return "Calendar";
      default:
        return "Clock";
    }
  };

  const getEventTypeBadge = (type) => {
    const variants = {
      "class": "primary",
      "trial": "secondary",
      "event": "accent"
    };
    return <Badge variant={variants[type] || "default"}>{type}</Badge>;
  };

  const generateWeekDays = () => {
    const weekStart = startOfWeek(selectedDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  };

  const getEventsForDay = (day) => {
    return weekEvents.filter(event => 
      format(new Date(event.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message="Schedule Error" description={error} onRetry={loadEvents} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600">Manage class schedules and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === "calendar" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            Calendar
          </Button>
          <Button 
            variant={viewMode === "week" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
            Week
          </Button>
          <Button variant="secondary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar 
              events={events}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
            />
          </div>
          
          <div className="space-y-4">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                {getEventsForDay(new Date()).map((event) => (
                  <div key={event.Id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <ApperIcon name={getEventTypeIcon(event.type)} className="w-4 h-4 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.time}</p>
                    </div>
                    {getEventTypeBadge(event.type)}
                  </div>
                ))}
                {getEventsForDay(new Date()).length === 0 && (
                  <Empty
                    icon="Calendar"
                    title="No events today"
                    description="Your schedule is clear for today"
                  />
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Events</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Classes</span>
                  <span className="font-medium">{events.filter(e => e.type === "class").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trials</span>
                  <span className="font-medium">{events.filter(e => e.type === "trial").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Special Events</span>
                  <span className="font-medium">{events.filter(e => e.type === "event").length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === "week" && (
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Week of {format(startOfWeek(selectedDate), "MMMM d, yyyy")}
            </h3>
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {generateWeekDays().map((day) => (
              <div key={day.toISOString()} className="space-y-2">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{format(day, "EEE")}</p>
                  <p className="text-xs text-gray-600">{format(day, "MMM d")}</p>
                </div>
                
                <div className="space-y-1">
                  {getEventsForDay(day).map((event) => (
                    <div 
                      key={event.Id} 
                      className="p-2 bg-primary-50 rounded border-l-4 border-primary-500 cursor-pointer hover:bg-primary-100"
                      onClick={() => handleEventClick(event)}
                    >
                      <p className="text-xs font-medium text-gray-900 truncate">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {weekEvents.length === 0 && (
            <Empty
              icon="Calendar"
              title="No events this week"
              description="Your weekly schedule is empty"
              actionLabel="Add Event"
              onAction={() => console.log("Add event")}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default Schedule;