import { useState, useEffect } from "react";
import { format, subDays, subMonths } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import studentService from "@/services/api/studentService";
import teacherService from "@/services/api/teacherService";
import attendanceService from "@/services/api/attendanceService";
import billingService from "@/services/api/billingService";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState("overview");
  const [dateRange, setDateRange] = useState("30");
  const [reportData, setReportData] = useState({
    students: [],
    teachers: [],
    attendance: [],
    billing: []
  });

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [students, teachers, attendance, billing] = await Promise.all([
        studentService.getAll(),
        teacherService.getAll(),
        attendanceService.getAll(),
        billingService.getAll()
      ]);

      setReportData({
        students,
        teachers,
        attendance,
        billing
      });
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const getFilteredData = () => {
    const days = parseInt(dateRange);
    const cutoffDate = subDays(new Date(), days);
    
    return {
      ...reportData,
      attendance: reportData.attendance.filter(record => 
        new Date(record.date) >= cutoffDate
      ),
      billing: reportData.billing.filter(bill => 
        new Date(bill.createdAt) >= cutoffDate
      )
    };
  };

  const generateOverviewReport = () => {
    const data = getFilteredData();
    
    const totalStudents = data.students.length;
    const activeStudents = data.students.filter(s => 
      s.enrollments.some(e => e.status === "active")
    ).length;
    
    const totalTeachers = data.teachers.length;
    const activeTeachers = data.teachers.filter(t => t.status === "active").length;
    
    const totalRevenue = data.billing
      .filter(b => b.status === "paid")
      .reduce((sum, b) => sum + b.amount, 0);
    
    const attendanceRate = data.attendance.length > 0 
      ? (data.attendance.filter(a => a.status === "present").length / data.attendance.length) * 100
      : 0;

    return {
      totalStudents,
      activeStudents,
      totalTeachers,
      activeTeachers,
      totalRevenue,
      attendanceRate: Math.round(attendanceRate)
    };
  };

  const generateAttendanceReport = () => {
    const data = getFilteredData();
    
    const totalSessions = data.attendance.length;
    const presentSessions = data.attendance.filter(a => a.status === "present").length;
    const absentSessions = data.attendance.filter(a => a.status === "absent").length;
    const lateSessions = data.attendance.filter(a => a.status === "late").length;
    
    const attendanceRate = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0;
    
    return {
      totalSessions,
      presentSessions,
      absentSessions,
      lateSessions,
      attendanceRate: Math.round(attendanceRate)
    };
  };

  const generateFinancialReport = () => {
    const data = getFilteredData();
    
    const totalInvoices = data.billing.length;
    const paidInvoices = data.billing.filter(b => b.status === "paid").length;
    const unpaidInvoices = data.billing.filter(b => b.status === "unpaid").length;
    const overdueInvoices = data.billing.filter(b => 
      b.status === "unpaid" && new Date(b.dueDate) < new Date()
    ).length;
    
    const totalRevenue = data.billing
      .filter(b => b.status === "paid")
      .reduce((sum, b) => sum + b.amount, 0);
    
    const pendingRevenue = data.billing
      .filter(b => b.status === "unpaid")
      .reduce((sum, b) => sum + b.amount, 0);
    
    return {
      totalInvoices,
      paidInvoices,
      unpaidInvoices,
      overdueInvoices,
      totalRevenue,
      pendingRevenue
    };
  };

  const generateStudentReport = () => {
    const data = getFilteredData();
    
    const totalStudents = data.students.length;
    const activeEnrollments = data.students.reduce((sum, s) => 
      sum + s.enrollments.filter(e => e.status === "active").length, 0
    );
    
    const enrollmentsByClass = {};
    data.students.forEach(student => {
      student.enrollments.forEach(enrollment => {
        if (enrollment.status === "active") {
          enrollmentsByClass[enrollment.className] = 
            (enrollmentsByClass[enrollment.className] || 0) + 1;
        }
      });
    });
    
    return {
      totalStudents,
      activeEnrollments,
      enrollmentsByClass
    };
  };

  const renderOverviewReport = () => {
    const report = generateOverviewReport();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{report.totalStudents}</p>
              <p className="text-sm text-success-600">{report.activeStudents} active</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{report.totalTeachers}</p>
              <p className="text-sm text-success-600">{report.activeTeachers} active</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${report.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Last {dateRange} days</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{report.attendanceRate}%</p>
              <p className="text-sm text-gray-500">Last {dateRange} days</p>
            </div>
            <div className="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-info-600" />
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderAttendanceReport = () => {
    const report = generateAttendanceReport();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="compact">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{report.totalSessions}</p>
            </div>
          </Card>
          
          <Card variant="compact">
            <div className="text-center">
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-success-600">{report.presentSessions}</p>
            </div>
          </Card>
          
          <Card variant="compact">
            <div className="text-center">
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-error-600">{report.absentSessions}</p>
            </div>
          </Card>
          
          <Card variant="compact">
            <div className="text-center">
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-warning-600">{report.lateSessions}</p>
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Attendance Rate</span>
              <span className="font-semibold text-gray-900">{report.attendanceRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-success-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${report.attendanceRate}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderFinancialReport = () => {
    const report = generateFinancialReport();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="compact">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{report.totalInvoices}</p>
            </div>
          </Card>
          
          <Card variant="compact">
            <div className="text-center">
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-success-600">{report.paidInvoices}</p>
            </div>
          </Card>
          
          <Card variant="compact">
            <div className="text-center">
              <p className="text-sm text-gray-600">Unpaid</p>
              <p className="text-2xl font-bold text-warning-600">{report.unpaidInvoices}</p>
            </div>
          </Card>
          
          <Card variant="compact">
            <div className="text-center">
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-error-600">{report.overdueInvoices}</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="font-semibold text-success-600">${report.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Revenue</span>
                <span className="font-semibold text-warning-600">${report.pendingRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium text-gray-900">Total Expected</span>
                <span className="font-semibold text-gray-900">${(report.totalRevenue + report.pendingRevenue).toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Rate</span>
                <span className="font-semibold text-gray-900">
                  {report.totalInvoices > 0 ? Math.round((report.paidInvoices / report.totalInvoices) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-success-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${report.totalInvoices > 0 ? (report.paidInvoices / report.totalInvoices) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderStudentReport = () => {
    const report = generateStudentReport();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Students</span>
                <span className="font-semibold text-gray-900">{report.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Enrollments</span>
                <span className="font-semibold text-primary-600">{report.activeEnrollments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Classes per Student</span>
                <span className="font-semibold text-gray-900">
                  {report.totalStudents > 0 ? (report.activeEnrollments / report.totalStudents).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Popularity</h3>
            <div className="space-y-2">
              {Object.entries(report.enrollmentsByClass)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([className, count]) => (
                  <div key={className} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{className}</span>
                    <span className="font-medium text-gray-900">{count} students</span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (reportType) {
      case "overview":
        return renderOverviewReport();
      case "attendance":
        return renderAttendanceReport();
      case "financial":
        return renderFinancialReport();
      case "student":
        return renderStudentReport();
      default:
        return renderOverviewReport();
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message="Reports Error" description={error} onRetry={loadReportData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analytics and insights for your music center</p>
        </div>
        <Button variant="secondary">
          <ApperIcon name="Download" className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Report Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="attendance">Attendance</option>
              <option value="financial">Financial</option>
              <option value="student">Student</option>
            </Select>
          </div>
          <div className="flex-1">
            <Select
              label="Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default Reports;