import replacementsData from "@/services/mockData/replacements.json";

class ReplacementService {
  constructor() {
    this.replacements = [...replacementsData.replacements];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.replacements]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const replacement = this.replacements.find(r => r.Id === parseInt(id));
        if (replacement) {
          resolve({ ...replacement });
        } else {
          reject(new Error("Replacement request not found"));
        }
      }, 200);
    });
  }

  async create(replacementData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReplacement = {
          ...replacementData,
          Id: Math.max(...this.replacements.map(r => r.Id)) + 1,
          status: "pending",
          requestDate: new Date().toISOString(),
          approvedDate: null,
          approvedBy: null
        };
        this.replacements.push(newReplacement);
        resolve({ ...newReplacement });
      }, 500);
    });
  }

  async update(id, replacementData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.replacements.findIndex(r => r.Id === parseInt(id));
        if (index !== -1) {
          this.replacements[index] = { ...this.replacements[index], ...replacementData };
          resolve({ ...this.replacements[index] });
        } else {
          reject(new Error("Replacement request not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.replacements.findIndex(r => r.Id === parseInt(id));
        if (index !== -1) {
          const deletedReplacement = this.replacements.splice(index, 1)[0];
          resolve({ ...deletedReplacement });
        } else {
          reject(new Error("Replacement request not found"));
        }
      }, 300);
    });
  }

  async getByStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredReplacements = this.replacements.filter(replacement => 
          replacement.status === status
        );
        resolve([...filteredReplacements]);
      }, 250);
    });
  }

  async getByStudent(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredReplacements = this.replacements.filter(replacement => 
          replacement.studentId === parseInt(studentId)
        );
        resolve([...filteredReplacements]);
      }, 250);
    });
  }

  async approve(id, approvedBy, notes = "") {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.replacements.findIndex(r => r.Id === parseInt(id));
        if (index !== -1) {
          this.replacements[index] = { 
            ...this.replacements[index], 
            status: "approved",
            approvedBy: approvedBy,
            approvedDate: new Date().toISOString(),
            notes: notes
          };
          resolve({ ...this.replacements[index] });
        } else {
          reject(new Error("Replacement request not found"));
        }
      }, 300);
    });
  }

  async reject(id, approvedBy, notes = "") {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.replacements.findIndex(r => r.Id === parseInt(id));
        if (index !== -1) {
          this.replacements[index] = { 
            ...this.replacements[index], 
            status: "rejected",
            approvedBy: approvedBy,
            approvedDate: new Date().toISOString(),
            notes: notes
          };
          resolve({ ...this.replacements[index] });
        } else {
          reject(new Error("Replacement request not found"));
        }
      }, 300);
    });
  }
}

export default new ReplacementService();