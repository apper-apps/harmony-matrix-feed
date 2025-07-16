import billingData from "@/services/mockData/billing.json";

class BillingService {
  constructor() {
    this.billing = [...billingData.billing];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.billing]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bill = this.billing.find(b => b.Id === parseInt(id));
        if (bill) {
          resolve({ ...bill });
        } else {
          reject(new Error("Bill not found"));
        }
      }, 200);
    });
  }

  async create(billingData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBill = {
          ...billingData,
          Id: Math.max(...this.billing.map(b => b.Id)) + 1,
          invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.max(...this.billing.map(b => b.Id)) + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString()
        };
        this.billing.push(newBill);
        resolve({ ...newBill });
      }, 500);
    });
  }

  async update(id, billingData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.billing.findIndex(b => b.Id === parseInt(id));
        if (index !== -1) {
          this.billing[index] = { ...this.billing[index], ...billingData };
          resolve({ ...this.billing[index] });
        } else {
          reject(new Error("Bill not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.billing.findIndex(b => b.Id === parseInt(id));
        if (index !== -1) {
          const deletedBill = this.billing.splice(index, 1)[0];
          resolve({ ...deletedBill });
        } else {
          reject(new Error("Bill not found"));
        }
      }, 300);
    });
  }

  async getByStudent(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredBills = this.billing.filter(bill => 
          bill.studentId === parseInt(studentId)
        );
        resolve([...filteredBills]);
      }, 250);
    });
  }

  async getByStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredBills = this.billing.filter(bill => 
          bill.status === status
        );
        resolve([...filteredBills]);
      }, 250);
    });
  }

  async getOverdueBills() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date();
        const overdueBills = this.billing.filter(bill => 
          bill.status === "unpaid" && new Date(bill.dueDate) < today
        );
        resolve([...overdueBills]);
      }, 300);
    });
  }

  async markAsPaid(id, paymentMethod) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.billing.findIndex(b => b.Id === parseInt(id));
        if (index !== -1) {
          this.billing[index] = { 
            ...this.billing[index], 
            status: "paid",
            paidDate: new Date().toISOString().split('T')[0],
            paymentMethod: paymentMethod
          };
          resolve({ ...this.billing[index] });
        } else {
          reject(new Error("Bill not found"));
        }
      }, 300);
    });
  }
}

export default new BillingService();