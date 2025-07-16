import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/organisms/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import classService from "@/services/api/classService";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await classService.getAll();
      setClasses(data);
      setFilteredClasses(data);
    } catch (err) {
      setError(err.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredClasses(classes);
    } else {
      const filtered = classes.filter(classItem =>
        classItem.name.toLowerCase().includes(query.toLowerCase()) ||
        classItem.teacherName.toLowerCase().includes(query.toLowerCase()) ||
        classItem.level.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredClasses(filtered);
    }
  };

  const handleRowClick = (classItem) => {
    setSelectedClass(classItem);
    setShowModal(true);
  };

  const handleDeleteClass = async (classId) => {
    if (confirm("Are you sure you want to delete this class?")) {
      try {
        await classService.delete(classId);
        toast.success("Class deleted successfully");
        loadClasses();
      } catch (err) {
        toast.error("Failed to delete class");
      }
    }
  };

  const getLevelBadge = (level) => {
    const variants = {
      "Beginner": "success",
      "Intermediate": "warning",
      "Advanced": "error",
      "All Levels": "primary"
    };
    return <Badge variant={variants[level] || "default"}>{level}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      "active": "success",
      "pending": "warning",
      "cancelled": "error"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const columns = [
    {
      key: "name",
      label: "Class",
      render: (value, classItem) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{classItem.roomName}</p>
        </div>
      )
    },
    {
      key: "teacherName",
      label: "Teacher",
      render: (value) => (
        <div className="flex items-center gap-2">
          <ApperIcon name="User" className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: "schedule",
      label: "Schedule",
      render: (value) => (
        <div>
          <p className="font-medium text-gray-900">{value.dayOfWeek}</p>
          <p className="text-sm text-gray-500">{value.startTime} - {value.endTime}</p>
        </div>
      )
    },
    {
      key: "level",
      label: "Level",
      render: (value) => getLevelBadge(value)
    },
    {
      key: "currentEnrollment",
      label: "Enrollment",
      render: (value, classItem) => (
        <div className="text-center">
          <p className="font-medium text-gray-900">{value}/{classItem.capacity}</p>
          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-primary-600 h-2 rounded-full" 
              style={{ width: `${(value / classItem.capacity) * 100}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      key: "price",
      label: "Price",
      render: (value) => (
        <div className="text-right">
          <p className="font-medium text-gray-900">${value}</p>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (value) => getStatusBadge(value)
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, classItem) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(classItem);
            }}
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClass(classItem.Id);
            }}
            className="text-error-600 hover:text-error-700"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message="Classes Error" description={error} onRetry={loadClasses} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600">Manage class schedules and enrollments</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search classes, teachers, or levels..."
              onSearch={handleSearch}
              value={searchQuery}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Classes Table */}
      <Card>
        {filteredClasses.length === 0 ? (
          <Empty
            icon="BookOpen"
            title="No classes found"
            description="Start by creating your first class"
            actionLabel="Add Class"
            onAction={() => console.log("Add class")}
          />
        ) : (
          <DataTable
            data={filteredClasses}
            columns={columns}
            onRowClick={handleRowClick}
          />
        )}
      </Card>

      {/* Class Details Modal */}
      {showModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Class Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Class Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">{selectedClass.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Basic Information</h5>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Teacher:</span> {selectedClass.teacherName}</p>
                        <p><span className="font-medium">Room:</span> {selectedClass.roomName}</p>
                        <p><span className="font-medium">Level:</span> {getLevelBadge(selectedClass.level)}</p>
                        <p><span className="font-medium">Status:</span> {getStatusBadge(selectedClass.status)}</p>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Schedule & Pricing</h5>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Day:</span> {selectedClass.schedule.dayOfWeek}</p>
                        <p><span className="font-medium">Time:</span> {selectedClass.schedule.startTime} - {selectedClass.schedule.endTime}</p>
                        <p><span className="font-medium">Duration:</span> {selectedClass.schedule.duration} minutes</p>
                        <p><span className="font-medium">Price:</span> ${selectedClass.price}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollment Info */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Enrollment</h5>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Current Enrollment</span>
                      <span className="font-medium">{selectedClass.currentEnrollment} / {selectedClass.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${(selectedClass.currentEnrollment / selectedClass.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedClass.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Requirements</h5>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedClass.requirements}</p>
                </div>

                {/* Duration */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Class Duration</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Start Date:</span> {selectedClass.startDate}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">End Date:</span> {selectedClass.endDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary">
                  Edit Class
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;