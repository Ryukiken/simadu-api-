const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_simadu_jwt_token_key_wse_2026';

/**
 * Middleware untuk verifikasi JWT Bearer Token
 * Mengembalikan HTTP 401 jika token tidak ada, format salah, atau kadaluarsa
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Header Authorization tidak ditemukan.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Format token tidak valid. Gunakan format: Bearer <token>'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Menyimpan info user { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah kedaluwarsa.'
    });
  }
}

/**
 * Middleware untuk otorisasi berbasis Role (RBAC)
 * Mengembalikan HTTP 403 jika role pengguna tidak memiliki izin
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses terlarang. Anda tidak memiliki izin untuk operasi ini.'
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
