import classesData from "@/services/mockData/classes.json";

class ClassService {
  constructor() {
    this.classes = [...classesData.classes];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.classes]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const classItem = this.classes.find(c => c.Id === parseInt(id));
        if (classItem) {
          resolve({ ...classItem });
        } else {
          reject(new Error("Class not found"));
        }
      }, 200);
    });
  }

  async create(classData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClass = {
          ...classData,
          Id: Math.max(...this.classes.map(c => c.Id)) + 1,
          currentEnrollment: 0,
          status: "active",
          createdAt: new Date().toISOString()
        };
        this.classes.push(newClass);
        resolve({ ...newClass });
      }, 500);
    });
  }

  async update(id, classData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.classes.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          this.classes[index] = { ...this.classes[index], ...classData };
          resolve({ ...this.classes[index] });
        } else {
          reject(new Error("Class not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.classes.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          const deletedClass = this.classes.splice(index, 1)[0];
          resolve({ ...deletedClass });
        } else {
          reject(new Error("Class not found"));
        }
      }, 300);
    });
  }

  async getByTeacher(teacherId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredClasses = this.classes.filter(classItem => 
          classItem.teacherId === parseInt(teacherId)
        );
        resolve([...filteredClasses]);
      }, 250);
    });
  }

  async getByLevel(level) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredClasses = this.classes.filter(classItem => 
          classItem.level.toLowerCase() === level.toLowerCase()
        );
        resolve([...filteredClasses]);
      }, 250);
    });
  }

  async search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredClasses = this.classes.filter(classItem => 
          classItem.name.toLowerCase().includes(query.toLowerCase()) ||
          classItem.teacherName.toLowerCase().includes(query.toLowerCase()) ||
          classItem.level.toLowerCase().includes(query.toLowerCase())
        );
        resolve([...filteredClasses]);
      }, 200);
    });
  }
}

export default new ClassService();