import studentsData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.students = [...studentsData.students];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.students]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const student = this.students.find(s => s.Id === parseInt(id));
        if (student) {
          resolve({ ...student });
        } else {
          reject(new Error("Student not found"));
        }
      }, 200);
    });
  }

  async create(studentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStudent = {
          ...studentData,
          Id: Math.max(...this.students.map(s => s.Id)) + 1,
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };
        this.students.push(newStudent);
        resolve({ ...newStudent });
      }, 500);
    });
  }

  async update(id, studentData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.students.findIndex(s => s.Id === parseInt(id));
        if (index !== -1) {
          this.students[index] = { ...this.students[index], ...studentData };
          resolve({ ...this.students[index] });
        } else {
          reject(new Error("Student not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.students.findIndex(s => s.Id === parseInt(id));
        if (index !== -1) {
          const deletedStudent = this.students.splice(index, 1)[0];
          resolve({ ...deletedStudent });
        } else {
          reject(new Error("Student not found"));
        }
      }, 300);
    });
  }

  async getByEnrollmentStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredStudents = this.students.filter(student => 
          student.enrollments.some(enrollment => enrollment.status === status)
        );
        resolve([...filteredStudents]);
      }, 250);
    });
  }

  async search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredStudents = this.students.filter(student => 
          student.name.toLowerCase().includes(query.toLowerCase()) ||
          student.email.toLowerCase().includes(query.toLowerCase()) ||
          student.parentName.toLowerCase().includes(query.toLowerCase())
        );
        resolve([...filteredStudents]);
      }, 200);
    });
  }
}

export default new StudentService();