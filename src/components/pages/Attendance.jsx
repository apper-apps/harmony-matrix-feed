import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/organisms/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import attendanceService from "@/services/api/attendanceService";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markAttendanceData, setMarkAttendanceData] = useState({
    studentName: "",
    className: "",
    status: "present",
    notes: ""
  });

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await attendanceService.getAll();
      setAttendance(data);
      setFilteredAttendance(data);
    } catch (err) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredAttendance(attendance);
    } else {
      const filtered = attendance.filter(record =>
        record.studentName.toLowerCase().includes(query.toLowerCase()) ||
        record.className.toLowerCase().includes(query.toLowerCase()) ||
        record.teacherName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAttendance(filtered);
    }
  };

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleMarkAttendance = async () => {
    try {
      await attendanceService.markAttendance(1, markAttendanceData.status, markAttendanceData.notes);
      toast.success("Attendance marked successfully");
      setShowMarkModal(false);
      setMarkAttendanceData({
        studentName: "",
        className: "",
        status: "present",
        notes: ""
      });
      loadAttendance();
    } catch (err) {
      toast.error("Failed to mark attendance");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      "present": "success",
      "absent": "error",
      "late": "warning"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const columns = [
    {
      key: "studentName",
      label: "Student",
      render: (value, record) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{record.className}</p>
        </div>
      )
    },
    {
      key: "teacherName",
      label: "Teacher",
      render: (value) => (
        <div className="flex items-center gap-2">
          <ApperIcon name="User" className="w-4 h-4 text-gray-500" />
          <span className="text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: "date",
      label: "Date",
      render: (value) => format(new Date(value), "MMM d, yyyy")
    },
    {
      key: "status",
      label: "Status",
      render: (value) => getStatusBadge(value)
    },
    {
      key: "checkedInAt",
      label: "Check-in Time",
      render: (value) => value ? format(new Date(value), "h:mm a") : "-"
    },
    {
      key: "notes",
      label: "Notes",
      render: (value) => value || "-"
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(record);
            }}
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Edit attendance:", record);
            }}
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message="Attendance Error" description={error} onRetry={loadAttendance} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track student attendance and performance</p>
        </div>
        <Button variant="primary" onClick={() => setShowMarkModal(true)}>
          <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search students, classes, or teachers..."
              onSearch={handleSearch}
              value={searchQuery}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Filter by Date
            </Button>
            <Button variant="outline" size="sm">
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="compact">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{attendance.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card variant="compact">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-success-600">
                {attendance.filter(r => r.status === "present").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card variant="compact">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-error-600">
                {attendance.filter(r => r.status === "absent").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="XCircle" className="w-6 h-6 text-error-600" />
            </div>
          </div>
        </Card>

        <Card variant="compact">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-warning-600">
                {attendance.filter(r => r.status === "late").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        {filteredAttendance.length === 0 ? (
          <Empty
            icon="CheckCircle"
            title="No attendance records found"
            description="Start tracking attendance for your classes"
            actionLabel="Mark Attendance"
            onAction={() => setShowMarkModal(true)}
          />
        ) : (
          <DataTable
            data={filteredAttendance}
            columns={columns}
            onRowClick={handleRowClick}
          />
        )}
      </Card>

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Mark Attendance</h3>
                <button
                  onClick={() => setShowMarkModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Student Name"
                  value={markAttendanceData.studentName}
                  onChange={(e) => setMarkAttendanceData({...markAttendanceData, studentName: e.target.value})}
                  placeholder="Enter student name"
                />

                <Input
                  label="Class Name"
                  value={markAttendanceData.className}
                  onChange={(e) => setMarkAttendanceData({...markAttendanceData, className: e.target.value})}
                  placeholder="Enter class name"
                />

                <Select
                  label="Status"
                  value={markAttendanceData.status}
                  onChange={(e) => setMarkAttendanceData({...markAttendanceData, status: e.target.value})}
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </Select>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={markAttendanceData.notes}
                    onChange={(e) => setMarkAttendanceData({...markAttendanceData, notes: e.target.value})}
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                    placeholder="Optional notes..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowMarkModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleMarkAttendance}>
                  Mark Attendance
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Details Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Attendance Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Student:</span>
                  <span className="text-gray-900">{selectedRecord.studentName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Class:</span>
                  <span className="text-gray-900">{selectedRecord.className}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Teacher:</span>
                  <span className="text-gray-900">{selectedRecord.teacherName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <span className="text-gray-900">{format(new Date(selectedRecord.date), "MMMM d, yyyy")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  {getStatusBadge(selectedRecord.status)}
                </div>

                {selectedRecord.checkedInAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Check-in Time:</span>
                    <span className="text-gray-900">{format(new Date(selectedRecord.checkedInAt), "h:mm a")}</span>
                  </div>
                )}

                {selectedRecord.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Notes:</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary">
                  Edit Record
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;