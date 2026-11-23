/**
 * Middleware Validasi Input Permintaan (Request Validation)
 * Menolak field tak dikenal, input kosong, atau format tidak sesuai (HTTP 400)
 */

const KATEGORI_VALID = ['Fasilitas', 'Akademik', 'TI'];
const STATUS_VALID = ['diajukan', 'diproses', 'selesai'];

function validateLogin(req, res, next) {
  const { username, password } = req.body || {};

  if (!username || typeof username !== 'string' || username.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal: Field username wajib diisi.'
    });
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal: Field password wajib diisi.'
    });
  }

  next();
}

function validateCreatePengaduan(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal: Request body tidak boleh kosong.'
    });
  }

  // Cek field yang tidak diizinkan diisi oleh client
  const forbiddenFields = ['id', 'mahasiswaId', 'status', 'createdAt'];
  const bodyKeys = Object.keys(body);
  for (const field of forbiddenFields) {
    if (bodyKeys.includes(field)) {
      return res.status(400).json({
        success: false,
        message: `Validasi gagal: Field '${field}' tidak boleh ditentukan oleh client.`
      });
    }
  }

  const { judul, kategori, deskripsi } = body;

  if (!judul || typeof judul !== 'string' || judul.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal: Field judul wajib diisi.'
    });
  }

  if (!kategori || typeof kategori !== 'string' || !KATEGORI_VALID.includes(kategori.trim())) {
    return res.status(400).json({
      success: false,
      message: `Validasi gagal: Field kategori harus salah satu dari: ${KATEGORI_VALID.join(', ')}.`
    });
  }

  if (!deskripsi || typeof deskripsi !== 'string' || deskripsi.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal: Field deskripsi wajib diisi.'
    });
  }

  // Sanitasi whitespace
  req.body.judul = judul.trim();
  req.body.kategori = kategori.trim();
  req.body.deskripsi = deskripsi.trim();

  next();
}

function validateUpdatePengaduan(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal: Request body tidak boleh kosong.'
    });
  }

  const forbiddenFields = ['id', 'mahasiswaId', 'status', 'createdAt'];
  const bodyKeys = Object.keys(body);
  for (const field of forbiddenFields) {
    if (bodyKeys.includes(field)) {
      return res.status(400).json({
        success: false,
        message: `Validasi gagal: Field '${field}' tidak boleh diubah melalui endpoint ini.`
      });
    }
  }

  const { judul, kategori, deskripsi } = body;

  if (!judul || typeof judul !== 'string' || judul.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal: Field judul wajib diisi.'
    });
  }

  if (!kategori || typeof kategori !== 'string' || !KATEGORI_VALID.includes(kategori.trim())) {
    return res.status(400).json({
      success: false,
      message: `Validasi gagal: Field kategori harus salah satu dari: ${KATEGORI_VALID.join(', ')}.`
    });
  }

  if (!deskripsi || typeof deskripsi !== 'string' || deskripsi.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal: Field deskripsi wajib diisi.'
    });
  }

  req.body.judul = judul.trim();
  req.body.kategori = kategori.trim();
  req.body.deskripsi = deskripsi.trim();

  next();
}

function validateStatusPengaduan(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal: Request body tidak boleh kosong.'
    });
  }

  const bodyKeys = Object.keys(body);
  const extraKeys = bodyKeys.filter((k) => k !== 'status');
  if (extraKeys.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Validasi gagal: Hanya field 'status' yang diperbolehkan.`
    });
  }

  const { status } = body;
  if (!status || typeof status !== 'string' || !STATUS_VALID.includes(status.trim())) {
    return res.status(400).json({
      success: false,
      message: `Validasi gagal: Field status harus salah satu dari: ${STATUS_VALID.join(', ')}.`
    });
  }

  req.body.status = status.trim();
  next();
}

module.exports = {
  validateLogin,
  validateCreatePengaduan,
  validateUpdatePengaduan,
  validateStatusPengaduan
};
