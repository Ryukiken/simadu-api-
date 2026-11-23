/**
 * Global Error Handling Middleware
 * Menangani error tanpa membocorkan informasi sensitif atau stack trace ke client
 */
function errorHandler(err, req, res, next) {
  // Catat error secara internal (bisa ke file log pada production)
  // console.error(`[ERROR] ${err.name}: ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';

  res.status(statusCode).json({
    success: false,
    message: message
  });
}

module.exports = errorHandler;
