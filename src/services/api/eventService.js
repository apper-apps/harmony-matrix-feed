import eventsData from "@/services/mockData/events.json";

class EventService {
  constructor() {
    this.events = [...eventsData.events];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.events]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = this.events.find(e => e.Id === parseInt(id));
        if (event) {
          resolve({ ...event });
        } else {
          reject(new Error("Event not found"));
        }
      }, 200);
    });
  }

  async create(eventData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent = {
          ...eventData,
          Id: Math.max(...this.events.map(e => e.Id)) + 1,
          status: "scheduled"
        };
        this.events.push(newEvent);
        resolve({ ...newEvent });
      }, 500);
    });
  }

  async update(id, eventData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.events.findIndex(e => e.Id === parseInt(id));
        if (index !== -1) {
          this.events[index] = { ...this.events[index], ...eventData };
          resolve({ ...this.events[index] });
        } else {
          reject(new Error("Event not found"));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.events.findIndex(e => e.Id === parseInt(id));
        if (index !== -1) {
          const deletedEvent = this.events.splice(index, 1)[0];
          resolve({ ...deletedEvent });
        } else {
          reject(new Error("Event not found"));
        }
      }, 300);
    });
  }

  async getByDate(date) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredEvents = this.events.filter(event => 
          event.date === date
        );
        resolve([...filteredEvents]);
      }, 250);
    });
  }

  async getByType(type) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredEvents = this.events.filter(event => 
          event.type === type
        );
        resolve([...filteredEvents]);
      }, 250);
    });
  }

  async getByDateRange(startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredEvents = this.events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
        });
        resolve([...filteredEvents]);
      }, 300);
    });
  }
}

export default new EventService();