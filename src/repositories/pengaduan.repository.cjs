// Seed data pengaduan awal dengan minimal 2 mahasiswa
let pengaduanList = [
  {
    id: 1,
    mahasiswaId: 'mhs-001',
    judul: 'Proyektor Ruang A.201 Rusak',
    kategori: 'Fasilitas',
    deskripsi: 'Proyektor mati total dan tidak menampilkan display saat perkuliahan.',
    status: 'diajukan',
    createdAt: '2026-11-20T08:30:00.000Z'
  },
  {
    id: 2,
    mahasiswaId: 'mhs-001',
    judul: 'Jadwal Praktikum Jarkom Bentrok',
    kategori: 'Akademik',
    deskripsi: 'Jadwal praktikum Jaringan Komputer bentrok dengan mata kuliah WSE.',
    status: 'diproses',
    createdAt: '2026-11-21T09:15:00.000Z'
  },
  {
    id: 3,
    mahasiswaId: 'mhs-002',
    judul: 'Wi-Fi Gedung Perpustakaan Lambat',
    kategori: 'TI',
    deskripsi: 'Akses internet di lantai 2 perpustakaan sering Request Time Out (RTO).',
    status: 'diajukan',
    createdAt: '2026-11-22T10:00:00.000Z'
  }
];

let nextId = 4;

const pengaduanRepository = {
  findAll: () => {
    return [...pengaduanList];
  },
  findByMahasiswaId: (mahasiswaId) => {
    return pengaduanList.filter((item) => item.mahasiswaId === mahasiswaId);
  },
  findById: (id) => {
    const numId = parseInt(id, 10);
    return pengaduanList.find((item) => item.id === numId);
  },
  create: (data) => {
    const newPengaduan = {
      id: nextId++,
      ...data
    };
    pengaduanList.push(newPengaduan);
    return { ...newPengaduan };
  },
  update: (id, updateData) => {
    const numId = parseInt(id, 10);
    const index = pengaduanList.findIndex((item) => item.id === numId);
    if (index === -1) return null;

    pengaduanList[index] = {
      ...pengaduanList[index],
      ...updateData
    };
    return { ...pengaduanList[index] };
  },
  delete: (id) => {
    const numId = parseInt(id, 10);
    const index = pengaduanList.findIndex((item) => item.id === numId);
    if (index === -1) return false;

    pengaduanList.splice(index, 1);
    return true;
  },
  // Helper untuk reset saat testing ulang bila dibutuhkan
  reset: (initialData) => {
    pengaduanList = [...initialData];
  }
};

module.exports = pengaduanRepository;
