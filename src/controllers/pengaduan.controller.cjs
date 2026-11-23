const pengaduanService = require('../services/pengaduan.service.cjs');

class PengaduanController {
  async getAll(req, res, next) {
    try {
      const data = await pengaduanService.getAllPengaduan(req.user);
      return res.status(200).json({
        success: true,
        message: 'Daftar pengaduan berhasil diambil.',
        data: data
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await pengaduanService.getPengaduanById(id, req.user);
      return res.status(200).json({
        success: true,
        message: 'Detail pengaduan berhasil diambil.',
        data: data
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const created = await pengaduanService.createPengaduan(req.body, req.user);
      return res.status(201).json({
        success: true,
        message: 'Pengaduan berhasil diajukan.',
        data: created
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await pengaduanService.updatePengaduan(id, req.body, req.user);
      return res.status(200).json({
        success: true,
        message: 'Pengaduan berhasil diperbarui.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await pengaduanService.updateStatus(id, status, req.user);
      return res.status(200).json({
        success: true,
        message: 'Status pengaduan berhasil diperbarui.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await pengaduanService.deletePengaduan(id, req.user);
      return res.status(200).json({
        success: true,
        message: `Pengaduan dengan ID ${id} berhasil dihapus.`
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PengaduanController();
