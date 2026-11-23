const bcrypt = require('bcryptjs');

// Seed data: minimal 2 mahasiswa dan 1 administrator sesuai ketentuan UTS
const users = [
  {
    id: 'mhs-001',
    username: 'mhs_budi',
    // hash dari 'password123'
    passwordHash: bcrypt.hashSync('password123', 10),
    nama: 'Budi Santoso',
    role: 'mahasiswa'
  },
  {
    id: 'mhs-002',
    username: 'mhs_siti',
    // hash dari 'password123'
    passwordHash: bcrypt.hashSync('password123', 10),
    nama: 'Siti Rahma',
    role: 'mahasiswa'
  },
  {
    id: 'admin-001',
    username: 'admin_univ',
    // hash dari 'adminpass123'
    passwordHash: bcrypt.hashSync('adminpass123', 10),
    nama: 'Administrator Kampus',
    role: 'admin'
  }
];

const userRepository = {
  findByUsername: (username) => {
    return users.find((u) => u.username === username);
  },
  findById: (id) => {
    return users.find((u) => u.id === id);
  },
  getAllUsers: () => {
    // Return sanitized users (without passwordHash)
    return users.map(({ passwordHash, ...rest }) => rest);
  }
};

module.exports = userRepository;
