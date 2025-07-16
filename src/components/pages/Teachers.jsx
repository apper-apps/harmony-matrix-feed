import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/organisms/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import teacherService from "@/services/api/teacherService";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await teacherService.getAll();
      setTeachers(data);
      setFilteredTeachers(data);
    } catch (err) {
      setError(err.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.email.toLowerCase().includes(query.toLowerCase()) ||
        teacher.specializations.some(spec => spec.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredTeachers(filtered);
    }
  };

  const handleRowClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      try {
        await teacherService.delete(teacherId);
        toast.success("Teacher deleted successfully");
        loadTeachers();
      } catch (err) {
        toast.error("Failed to delete teacher");
      }
    }
  };

  const columns = [
    {
      key: "name",
      label: "Teacher",
      render: (value, teacher) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback={teacher.name.charAt(0)} />
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{teacher.email}</p>
          </div>
        </div>
      )
    },
    {
      key: "specializations",
      label: "Specializations",
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.map((spec, index) => (
            <Badge key={index} variant="primary" size="sm">
              {spec}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge variant={value === "active" ? "success" : "error"}>
          {value}
        </Badge>
      )
    },
    {
      key: "totalStudents",
      label: "Students",
      render: (value) => (
        <div className="text-center">
          <p className="font-medium text-gray-900">{value}</p>
        </div>
      )
    },
    {
      key: "monthlyEarnings",
      label: "Monthly Earnings",
      render: (value) => (
        <div className="text-right">
          <p className="font-medium text-gray-900">${value.toLocaleString()}</p>
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, teacher) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(teacher);
            }}
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTeacher(teacher.Id);
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
    return <Error message="Teachers Error" description={error} onRetry={loadTeachers} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600">Manage teacher profiles and assignments</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search teachers, specializations, or email..."
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

      {/* Teachers Table */}
      <Card>
        {filteredTeachers.length === 0 ? (
          <Empty
            icon="UserCheck"
            title="No teachers found"
            description="Start by adding your first teacher to the system"
            actionLabel="Add Teacher"
            onAction={() => console.log("Add teacher")}
          />
        ) : (
          <DataTable
            data={filteredTeachers}
            columns={columns}
            onRowClick={handleRowClick}
          />
        )}
      </Card>

      {/* Teacher Details Modal */}
      {showModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Teacher Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Teacher Info */}
                <div className="flex items-center gap-4">
                  <Avatar size="xl" fallback={selectedTeacher.name.charAt(0)} />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedTeacher.name}</h4>
                    <p className="text-gray-600">{selectedTeacher.email}</p>
                    <p className="text-sm text-gray-500">{selectedTeacher.phone}</p>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Professional Information</h5>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Experience:</span> {selectedTeacher.experience}</p>
                      <p><span className="font-medium">Hourly Rate:</span> ${selectedTeacher.hourlyRate}</p>
                      <p><span className="font-medium">Commission Rate:</span> {(selectedTeacher.commissionRate * 100)}%</p>
                      <p><span className="font-medium">Joining Date:</span> {selectedTeacher.joiningDate}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Performance</h5>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Total Students:</span> {selectedTeacher.totalStudents}</p>
                      <p><span className="font-medium">Monthly Earnings:</span> ${selectedTeacher.monthlyEarnings.toLocaleString()}</p>
                      <p><span className="font-medium">Status:</span> 
                        <Badge variant={selectedTeacher.status === "active" ? "success" : "error"} className="ml-2">
                          {selectedTeacher.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Specializations</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.specializations.map((spec, index) => (
                      <Badge key={index} variant="primary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Qualifications</h5>
                  <div className="space-y-1">
                    {selectedTeacher.qualifications.map((qual, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <ApperIcon name="Award" className="w-4 h-4 text-primary-600" />
                        <span className="text-sm text-gray-700">{qual}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                {selectedTeacher.bio && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Bio</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedTeacher.bio}</p>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Availability</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(selectedTeacher.availability).map(([day, times]) => (
                      <div key={day} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900 capitalize">{day}</span>
                        <span className="text-sm text-gray-600">{times.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary">
                  Edit Teacher
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;