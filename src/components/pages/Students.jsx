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
import studentService from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase()) ||
        student.parentName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        toast.success("Student deleted successfully");
        loadStudents();
      } catch (err) {
        toast.error("Failed to delete student");
      }
    }
  };

  const getStatusBadge = (enrollments) => {
    if (enrollments.length === 0) return <Badge variant="default">No Enrollments</Badge>;
    const hasActive = enrollments.some(e => e.status === "active");
    return hasActive ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Inactive</Badge>;
  };

  const columns = [
    {
      key: "name",
      label: "Student",
      render: (value, student) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback={student.name.charAt(0)} />
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>
      )
    },
    {
      key: "parentName",
      label: "Parent",
      render: (value, student) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{student.parentPhone}</p>
        </div>
      )
    },
    {
      key: "enrollments",
      label: "Status",
      render: (value) => getStatusBadge(value)
    },
    {
      key: "enrollments",
      label: "Classes",
      render: (value) => (
        <div className="space-y-1">
          {value.length > 0 ? (
            value.map((enrollment, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{enrollment.className}</span>
                <span className="text-gray-500 ml-2">({enrollment.status})</span>
              </div>
            ))
          ) : (
            <span className="text-gray-500">No enrollments</span>
          )}
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, student) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(student);
            }}
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteStudent(student.Id);
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
    return <Error message="Students Error" description={error} onRetry={loadStudents} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage student profiles and enrollments</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search students, parents, or email..."
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

      {/* Students Table */}
      <Card>
        {filteredStudents.length === 0 ? (
          <Empty
            icon="Users"
            title="No students found"
            description="Start by adding your first student to the system"
            actionLabel="Add Student"
            onAction={() => console.log("Add student")}
          />
        ) : (
          <DataTable
            data={filteredStudents}
            columns={columns}
            onRowClick={handleRowClick}
          />
        )}
      </Card>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Student Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Info */}
                <div className="flex items-center gap-4">
                  <Avatar size="xl" fallback={selectedStudent.name.charAt(0)} />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedStudent.name}</h4>
                    <p className="text-gray-600">{selectedStudent.email}</p>
                    <p className="text-sm text-gray-500">{selectedStudent.phone}</p>
                  </div>
                </div>

                {/* Parent Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Parent Information</h5>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedStudent.parentName}</p>
                      <p><span className="font-medium">Email:</span> {selectedStudent.parentEmail}</p>
                      <p><span className="font-medium">Phone:</span> {selectedStudent.parentPhone}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Student Information</h5>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Date of Birth:</span> {selectedStudent.dateOfBirth}</p>
                      <p><span className="font-medium">Address:</span> {selectedStudent.address}</p>
                      <p><span className="font-medium">Emergency Contact:</span> {selectedStudent.emergencyContact}</p>
                    </div>
                  </div>
                </div>

                {/* Enrollments */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Enrollments</h5>
                  <div className="space-y-2">
                    {selectedStudent.enrollments.map((enrollment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{enrollment.className}</p>
                          <p className="text-sm text-gray-500">Started: {enrollment.startDate}</p>
                        </div>
                        <Badge variant={enrollment.status === "active" ? "success" : "warning"}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedStudent.notes && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedStudent.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary">
                  Edit Student
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;