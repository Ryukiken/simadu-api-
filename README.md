# SIMADU REST API (Sistem Layanan Informasi dan Pengaduan Mahasiswa)

> **Ujian Tengah Semester (UTS) — Web Service Engineering (WSE)**  
> **Nama Mahasiswa:** Rahmat Allam | **NIM:** 240104040182  
> Program Studi Teknologi Informasi | Dosen: Muhayat, M.IT

---

## 1. Deskripsi Proyek
SIMADU API adalah layanan RESTful API backend yang dirancang untuk mengelola laporan dan pengaduan mahasiswa terkait fasilitas kampus, layanan akademik, dan teknologi informasi. API ini mengintegrasikan arsitektur berlapis (*layered architecture*), autentikasi berbasis JWT Bearer Token, otorisasi berbasis peran (RBAC & kepemilikan data), validasi input yang ketat, dokumentasi interaktif OpenAPI/Swagger UI, serta penanganan error standar.

---

## 2. Struktur Direktori Proyek
Proyek ini mengimplementasikan pola arsitektur berlapis sesuai rekomendasi tugas:
```text
simadu-api/
├── src/
│   ├── controllers/      # Menangani request dan response HTTP
│   │   ├── auth.controller.cjs
│   │   └── pengaduan.controller.cjs
│   ├── services/         # Logika bisnis & aturan penanganan hak akses
│   │   ├── auth.service.cjs
│   │   └── pengaduan.service.cjs
│   ├── repositories/     # Abstraksi dan manipulasi data (In-Memory Array)
│   │   ├── user.repository.cjs
│   │   └── pengaduan.repository.cjs
│   ├── routes/           # Definisi endpoint HTTP
│   │   ├── auth.routes.cjs
│   │   ├── pengaduan.routes.cjs
│   │   └── index.cjs
│   └── middleware/       # Autentikasi JWT, RBAC, Validasi, dan Error Handler
│       ├── auth.middleware.cjs
│       ├── validator.middleware.cjs
│       └── error.middleware.cjs
├── docs/
│   └── openapi.json      # Spesifikasi OpenAPI 3.0
├── tests/
│   ├── simadu_api.postman_collection.json  # Koleksi Postman (12 Skenario)
│   └── test-runner.cjs                     # Skrip otomatisasi pengujian
├── app.cjs               # Konfigurasi aplikasi Express
├── server.cjs            # Entry point listener server
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. Prasyarat Sistem
* **Node.js**: v18.0.0 atau lebih baru (Disarankan v20+ / v24+)
* **npm**: v9.0.0 atau lebih baru

---

## 4. Instalasi dan Konfigurasi

1. **Clone atau buka repositori:**
   ```bash
   cd simadu-api
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Salin file environment:**
   ```bash
   cp .env.example .env
   ```
   *Konfigurasi default `.env`:*
   ```env
   PORT=3000
   JWT_SECRET=supersecret_simadu_jwt_token_key_wse_2026
   JWT_EXPIRES_IN=1h
   ```

---

## 5. Cara Menjalankan Server

* **Mode Produksi / Standar:**
  ```bash
  npm start
  ```

* **Mode Pengembangan (Hot Reload dengan Node --watch):**
  ```bash
  npm run dev
  ```

Setelah server aktif, Anda dapat mengakses:
* **Base URL:** `http://localhost:3000/api`
* **Dokumentasi Swagger UI:** `http://localhost:3000/api-docs`

---

## 6. Akun Bawaan (Seed Data Pengujian)

Data awal telah disediakan dengan password yang ter-hash menggunakan `bcryptjs`:

| Username | Password | Role | Keterangan |
| :--- | :--- | :--- | :--- |
| `mhs_budi` | `password123` | `mahasiswa` | Akun Mahasiswa 1 (Pemilik pengaduan ID 1 & 2) |
| `mhs_siti` | `password123` | `mahasiswa` | Akun Mahasiswa 2 (Pemilik pengaduan ID 3) |
| `admin_univ` | `adminpass123` | `admin` | Akun Administrator Kampus |

---

## 7. Kontrak Endpoint REST API

| Metode | Endpoint | Hak Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Publik | Autentikasi dan penerbitan JWT Bearer Token |
| `GET` | `/api/pengaduan` | Mahasiswa, Admin | Mahasiswa: daftar miliknya; Admin: semua pengaduan |
| `GET` | `/api/pengaduan/:id` | Mahasiswa, Admin | Mahasiswa: hanya miliknya; Admin: semua pengaduan |
| `POST` | `/api/pengaduan` | Mahasiswa | Membuat pengaduan baru (`status` awal: `diajukan`) |
| `PUT` | `/api/pengaduan/:id` | Mahasiswa (Pemilik) | Mengubah judul, kategori, deskripsi (Status wajib `diajukan`) |
| `PATCH` | `/api/pengaduan/:id/status` | Admin | Memperbarui status penanganan (`diajukan`, `diproses`, `selesai`) |
| `DELETE` | `/api/pengaduan/:id` | Mahasiswa (Pemilik) | Menghapus pengaduan (Status wajib `diajukan`) |

---

## 8. Pengujian 12 Skenario

### A. Menjalankan Tes Otomatis (Built-in Test Runner)
Jalankan perintah berikut pada terminal:
```bash
npm test
```
Skrip ini akan secara otomatis menguji ke-12 skenario fungsional dan keamanan, lalu mencetak tabel status *PASSED/FAILED* beserta payload respons aktual.

### B. Pengujian via Postman
1. Buka aplikasi **Postman**.
2. Klik tombol **Import**, lalu pilih file `tests/simadu_api.postman_collection.json`.
3. Jalankan request secara berurutan mulai dari skenario 1 hingga 12.
