const pengaduanRepository = require('../repositories/pengaduan.repository.cjs');

class PengaduanService {
  /**
   * Mengambil daftar pengaduan berdasarkan hak akses (Role-Based Access)
   * - Mahasiswa: hanya melihat pengaduannya sendiri
   * - Administrator: dapat melihat seluruh pengaduan
   */
  async getAllPengaduan(user) {
    if (user.role === 'admin') {
      return pengaduanRepository.findAll();
    }
    // Jika mahasiswa, hanya ambil milik sendiri
    return pengaduanRepository.findByMahasiswaId(user.id);
  }

  /**
   * Mengambil detail pengaduan dengan validasi hak akses
   */
  async getPengaduanById(id, user) {
    const pengaduan = pengaduanRepository.findById(id);
    if (!pengaduan) {
      const error = new Error(`Pengaduan dengan ID ${id} tidak ditemukan.`);
      error.statusCode = 404;
      throw error;
    }

    // Mahasiswa tidak boleh melihat pengaduan milik mahasiswa lain
    if (user.role === 'mahasiswa' && pengaduan.mahasiswaId !== user.id) {
      const error = new Error('Akses terlarang. Anda tidak memiliki izin untuk melihat pengaduan ini.');
      error.statusCode = 403;
      throw error;
    }

    return pengaduan;
  }

  /**
   * Menambahkan pengaduan baru (Hanya untuk mahasiswa)
   * ID dan identitas pemilik (mahasiswaId) tidak ditentukan secara bebas oleh client
   */
  async createPengaduan(data, user) {
    if (user.role !== 'mahasiswa') {
      const error = new Error('Hanya mahasiswa yang diperbolehkan membuat pengaduan.');
      error.statusCode = 403;
      throw error;
    }

    const newPengaduanData = {
      mahasiswaId: user.id, // berasal dari token autentikasi
      judul: data.judul,
      kategori: data.kategori,
      deskripsi: data.deskripsi,
      status: 'diajukan', // status awal selalu 'diajukan'
      createdAt: new Date().toISOString()
    };

    return pengaduanRepository.create(newPengaduanData);
  }

  /**
   * Mengubah judul, kategori, dan deskripsi pengaduan
   * Aturan: Hanya oleh mahasiswa pemilik DAN selama berstatus 'diajukan'
   */
  async updatePengaduan(id, updateData, user) {
    const pengaduan = pengaduanRepository.findById(id);
    if (!pengaduan) {
      const error = new Error(`Pengaduan dengan ID ${id} tidak ditemukan.`);
      error.statusCode = 404;
      throw error;
    }

    // Pengecekan otorisasi kepemilikan data
    if (user.role !== 'mahasiswa' || pengaduan.mahasiswaId !== user.id) {
      const error = new Error('Akses terlarang. Anda hanya dapat mengubah pengaduan milik Anda sendiri.');
      error.statusCode = 403;
      throw error;
    }

    // Aturan bisnis: hanya boleh diubah selama berstatus diajukan
    if (pengaduan.status !== 'diajukan') {
      const error = new Error(`Pengaduan tidak dapat diubah karena statusnya sudah '${pengaduan.status}'. Hanya status 'diajukan' yang dapat diubah.`);
      error.statusCode = 400;
      throw error;
    }

    const payload = {
      judul: updateData.judul,
      kategori: updateData.kategori,
      deskripsi: updateData.deskripsi
    };

    return pengaduanRepository.update(id, payload);
  }

  /**
   * Memperbarui status penanganan pengaduan
   * Aturan: Hanya boleh dilakukan oleh Administrator
   */
  async updateStatus(id, newStatus, user) {
    if (user.role !== 'admin') {
      const error = new Error('Akses terlarang. Hanya administrator yang dapat memperbarui status penanganan.');
      error.statusCode = 403;
      throw error;
    }

    const pengaduan = pengaduanRepository.findById(id);
    if (!pengaduan) {
      const error = new Error(`Pengaduan dengan ID ${id} tidak ditemukan.`);
      error.statusCode = 404;
      throw error;
    }

    return pengaduanRepository.update(id, { status: newStatus });
  }

  /**
   * Menghapus pengaduan
   * Aturan: Hanya boleh oleh mahasiswa pemilik DAN selama berstatus 'diajukan'
   */
  async deletePengaduan(id, user) {
    const pengaduan = pengaduanRepository.findById(id);
    if (!pengaduan) {
      const error = new Error(`Pengaduan dengan ID ${id} tidak ditemukan.`);
      error.statusCode = 404;
      throw error;
    }

    // Pengecekan otorisasi
    if (user.role !== 'mahasiswa' || pengaduan.mahasiswaId !== user.id) {
      const error = new Error('Akses terlarang. Anda hanya dapat menghapus pengaduan milik Anda sendiri.');
      error.statusCode = 403;
      throw error;
    }

    // Aturan bisnis: hanya boleh dihapus selama berstatus diajukan
    if (pengaduan.status !== 'diajukan') {
      const error = new Error(`Pengaduan tidak dapat dihapus karena statusnya sudah '${pengaduan.status}'.`);
      error.statusCode = 400;
      throw error;
    }

    pengaduanRepository.delete(id);
    return true;
  }
}

module.exports = new PengaduanService();
