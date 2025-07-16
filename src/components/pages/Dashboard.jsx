import { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import QuickActions from "@/components/organisms/QuickActions";
import RecentActivity from "@/components/organisms/RecentActivity";
import Calendar from "@/components/organisms/Calendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import studentService from "@/services/api/studentService";
import teacherService from "@/services/api/teacherService";
import classService from "@/services/api/classService";
import eventService from "@/services/api/eventService";
import billingService from "@/services/api/billingService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    revenue: 0
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [students, teachers, classes, eventsData, billing] = await Promise.all([
        studentService.getAll(),
        teacherService.getAll(),
        classService.getAll(),
        eventService.getAll(),
        billingService.getAll()
      ]);

      // Calculate revenue from paid bills
      const revenue = billing
        .filter(bill => bill.status === "paid")
        .reduce((total, bill) => total + bill.amount, 0);

      setStats({
        students: students.length,
        teachers: teachers.length,
        classes: classes.length,
        revenue: revenue
      });

      setEvents(eventsData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message="Dashboard Error" description={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Harmony Hub</h1>
            <p className="text-primary-100">Manage your music center efficiently</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.students}
          icon="Users"
          change="+12% from last month"
          changeType="positive"
        />
        <StatCard
          title="Active Teachers"
          value={stats.teachers}
          icon="UserCheck"
          change="+2 new this month"
          changeType="positive"
        />
        <StatCard
          title="Active Classes"
          value={stats.classes}
          icon="BookOpen"
          change="+1 new class"
          changeType="positive"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon="DollarSign"
          change="+18% from last month"
          changeType="positive"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Calendar */}
        <div className="lg:col-span-2">
          <Calendar 
            events={events}
            onDateSelect={(date) => console.log("Date selected:", date)}
            onEventClick={(event) => console.log("Event clicked:", event)}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        {/* Upcoming Classes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Classes</h3>
          <div className="space-y-4">
            {events.filter(event => event.type === "class").slice(0, 5).map((event) => (
              <div key={event.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{event.date}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;