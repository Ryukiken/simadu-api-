const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository.cjs');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_simadu_jwt_token_key_wse_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

class AuthService {
  async login(username, password) {
    const user = userRepository.findByUsername(username);
    if (!user) {
      const error = new Error('Username atau password salah.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Username atau password salah.');
      error.statusCode = 401;
      throw error;
    }

    // Token latihan menyertakan identitas unik & tidak bernilai tetap
    const payload = {
      id: user.id,
      username: user.username,
      nama: user.nama,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        nama: user.nama,
        role: user.role
      }
    };
  }
}

module.exports = new AuthService();
