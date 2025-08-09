// In-memory user storage
const users = [];

class User {
  constructor(id, name, email, password, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // Hashed password
    this.role = role; // 'organizer' or 'attendee'
    this.registeredEvents = [];
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static create(userData) {
    users.push(userData);
    return userData;
  }

  static getAll() {
    return users;
  }
}

module.exports = User;

// Added extra line