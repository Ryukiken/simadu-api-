const express = require('express');
const router = express.Router();
const pengaduanController = require('../controllers/pengaduan.controller.cjs');
const { authenticateToken } = require('../middleware/auth.middleware.cjs');
const {
  validateCreatePengaduan,
  validateUpdatePengaduan,
  validateStatusPengaduan
} = require('../middleware/validator.middleware.cjs');

// Seluruh endpoint pengaduan membutuhkan autentikasi Bearer Token
router.use(authenticateToken);

// GET /api/pengaduan - Mengambil daftar pengaduan sesuai hak akses
router.get('/', (req, res, next) => pengaduanController.getAll(req, res, next));

// GET /api/pengaduan/:id - Mengambil detail pengaduan
router.get('/:id', (req, res, next) => pengaduanController.getById(req, res, next));

// POST /api/pengaduan - Menambahkan pengaduan baru
router.post('/', validateCreatePengaduan, (req, res, next) => pengaduanController.create(req, res, next));

// PUT /api/pengaduan/:id - Mengubah judul, kategori, dan deskripsi
router.put('/:id', validateUpdatePengaduan, (req, res, next) => pengaduanController.update(req, res, next));

// PATCH /api/pengaduan/:id/status - Memperbarui status penanganan (khusus admin)
router.patch('/:id/status', validateStatusPengaduan, (req, res, next) => pengaduanController.updateStatus(req, res, next));

// DELETE /api/pengaduan/:id - Menghapus pengaduan
router.delete('/:id', (req, res, next) => pengaduanController.delete(req, res, next));

module.exports = router;
