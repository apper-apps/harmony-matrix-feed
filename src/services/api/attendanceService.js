import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData.attendance];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.attendance]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const record = this.attendance.find(a => a.Id === parseInt(id));
        if (record) {
          resolve({ ...record });
        } else {
          reject(new Error("Attendance record not found"));
        }
      }, 200);
    });
  }

  async create(attendanceData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord = {
          ...attendanceData,
          Id: Math.max(...this.attendance.map(a => a.Id)) + 1,
          checkedInAt: attendanceData.status === "present" ? new Date().toISOString() : null
        };
        this.attendance.push(newRecord);
        resolve({ ...newRecord });
      }, 500);
    });
  }

  async update(id, attendanceData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.attendance.findIndex(a => a.Id === parseInt(id));
        if (index !== -1) {
          this.attendance[index] = { ...this.attendance[index], ...attendanceData };
          resolve({ ...this.attendance[index] });
        } else {
          reject(new Error("Attendance record not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.attendance.findIndex(a => a.Id === parseInt(id));
        if (index !== -1) {
          const deletedRecord = this.attendance.splice(index, 1)[0];
          resolve({ ...deletedRecord });
        } else {
          reject(new Error("Attendance record not found"));
        }
      }, 300);
    });
  }

  async getByStudent(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredRecords = this.attendance.filter(record => 
          record.studentId === parseInt(studentId)
        );
        resolve([...filteredRecords]);
      }, 250);
    });
  }

  async getByClass(classId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredRecords = this.attendance.filter(record => 
          record.classId === parseInt(classId)
        );
        resolve([...filteredRecords]);
      }, 250);
    });
  }

  async getByDateRange(startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredRecords = this.attendance.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
        });
        resolve([...filteredRecords]);
      }, 300);
    });
  }

  async markAttendance(enrollmentId, status, notes = "") {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord = {
          Id: Math.max(...this.attendance.map(a => a.Id)) + 1,
          enrollmentId: parseInt(enrollmentId),
          date: new Date().toISOString().split('T')[0],
          status: status,
          checkedInAt: status === "present" ? new Date().toISOString() : null,
          notes: notes
        };
        this.attendance.push(newRecord);
        resolve({ ...newRecord });
      }, 300);
    });
  }
}

export default new AttendanceService();