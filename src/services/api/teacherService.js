import teachersData from "@/services/mockData/teachers.json";

class TeacherService {
  constructor() {
    this.teachers = [...teachersData.teachers];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.teachers]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const teacher = this.teachers.find(t => t.Id === parseInt(id));
        if (teacher) {
          resolve({ ...teacher });
        } else {
          reject(new Error("Teacher not found"));
        }
      }, 200);
    });
  }

  async create(teacherData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTeacher = {
          ...teacherData,
          Id: Math.max(...this.teachers.map(t => t.Id)) + 1,
          status: "active",
          joiningDate: new Date().toISOString().split('T')[0],
          totalStudents: 0,
          monthlyEarnings: 0,
          createdAt: new Date().toISOString()
        };
        this.teachers.push(newTeacher);
        resolve({ ...newTeacher });
      }, 500);
    });
  }

  async update(id, teacherData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.teachers.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          this.teachers[index] = { ...this.teachers[index], ...teacherData };
          resolve({ ...this.teachers[index] });
        } else {
          reject(new Error("Teacher not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.teachers.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          const deletedTeacher = this.teachers.splice(index, 1)[0];
          resolve({ ...deletedTeacher });
        } else {
          reject(new Error("Teacher not found"));
        }
      }, 300);
    });
  }

  async getBySpecialization(specialization) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredTeachers = this.teachers.filter(teacher => 
          teacher.specializations.includes(specialization)
        );
        resolve([...filteredTeachers]);
      }, 250);
    });
  }

  async search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredTeachers = this.teachers.filter(teacher => 
          teacher.name.toLowerCase().includes(query.toLowerCase()) ||
          teacher.email.toLowerCase().includes(query.toLowerCase()) ||
          teacher.specializations.some(spec => spec.toLowerCase().includes(query.toLowerCase()))
        );
        resolve([...filteredTeachers]);
      }, 200);
    });
  }
}

export default new TeacherService();