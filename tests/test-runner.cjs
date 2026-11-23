/**
 * Skrip Otomasi Pengujian 12 Skenario Wajib UTS Web Service Engineering (SIMADU API)
 * Menjalankan server in-memory, mengirim request HTTP, dan mencatat perbandingan Hasil Aktual vs Ekspektasi.
 */

const http = require('http');
const app = require('../app.cjs');

const PORT = 3001; // Port khusus testing
let server;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { error: 'Failed to parse JSON response' };
  }

  return {
    status: res.status,
    data
  };
}

async function runTests() {
  console.log('================================================================================');
  console.log(' PENGUJIAN 12 SKENARIO FUNGSIONAL DAN KEAMANAN - SIMADU REST API');
  console.log('================================================================================\n');

  let tokenMhs1 = '';
  let tokenMhs2 = '';
  let tokenAdmin = '';
  let newPengaduanId = null;

  const testResults = [];

  function recordResult(no, skenario, expectedStatus, actualStatus, responseData) {
    const passed = expectedStatus === actualStatus;
    testResults.push({
      no,
      skenario,
      expected: expectedStatus,
      actual: actualStatus,
      status: passed ? 'PASSED (SESUAI)' : 'FAILED',
      response: responseData
    });

    console.log(`[SKENARIO #${no}] ${skenario}`);
    console.log(`  - Ekspektasi : ${expectedStatus}`);
    console.log(`  - Hasil      : ${actualStatus} -> ${passed ? '✓ PASSED' : '✗ FAILED'}`);
    console.log(`  - Respons    : ${JSON.stringify(responseData)}`);
    console.log('--------------------------------------------------------------------------------');
  }

  try {
    // Skenario 1: Login dengan kredensial benar (200, token diterima)
    const res1 = await request('/auth/login', {
      method: 'POST',
      body: { username: 'mhs_budi', password: 'password123' }
    });
    tokenMhs1 = res1.data?.data?.token;
    recordResult(1, 'Login dengan kredensial benar', 200, res1.status, res1.data);

    // Ambil token untuk mhs_siti & admin
    const resMhs2 = await request('/auth/login', {
      method: 'POST',
      body: { username: 'mhs_siti', password: 'password123' }
    });
    tokenMhs2 = resMhs2.data?.data?.token;

    const resAdmin = await request('/auth/login', {
      method: 'POST',
      body: { username: 'admin_univ', password: 'adminpass123' }
    });
    tokenAdmin = resAdmin.data?.data?.token;

    // Skenario 2: Login dengan password salah (401)
    const res2 = await request('/auth/login', {
      method: 'POST',
      body: { username: 'mhs_budi', password: 'wrongpassword' }
    });
    recordResult(2, 'Login dengan password salah', 401, res2.status, res2.data);

    // Skenario 3: Akses endpoint terlindungi tanpa token (401)
    const res3 = await request('/pengaduan', {
      method: 'GET'
    });
    recordResult(3, 'Akses endpoint terlindungi tanpa token', 401, res3.status, res3.data);

    // Skenario 4: Akses menggunakan token tidak valid (401)
    const res4 = await request('/pengaduan', {
      method: 'GET',
      headers: { Authorization: 'Bearer token_palsu_atau_rusak_12345' }
    });
    recordResult(4, 'Akses menggunakan token tidak valid', 401, res4.status, res4.data);

    // Skenario 5: Mahasiswa membuat pengaduan valid (201)
    const res5 = await request('/pengaduan', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenMhs1}` },
      body: {
        judul: 'Lampu Kelas B.102 Berkedip',
        kategori: 'Fasilitas',
        deskripsi: 'Lampu penerangan di depan ruang kelas B.102 berkedip dan mengganggu konsentrasi.'
      }
    });
    newPengaduanId = res5.data?.data?.id;
    recordResult(5, 'Mahasiswa membuat pengaduan valid', 201, res5.status, res5.data);

    // Skenario 6: Mahasiswa membaca pengaduan sendiri (200)
    // Pengaduan ID 1 dimiliki oleh mhs-001 (mhs_budi)
    const res6 = await request('/pengaduan/1', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenMhs1}` }
    });
    recordResult(6, 'Mahasiswa membaca pengaduan sendiri', 200, res6.status, res6.data);

    // Skenario 7: Mahasiswa mencoba membaca pengaduan orang lain (403)
    // Pengaduan ID 3 dimiliki oleh mhs-002 (mhs_siti), diakses oleh mhs_budi
    const res7 = await request('/pengaduan/3', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenMhs1}` }
    });
    recordResult(7, 'Mahasiswa mencoba membaca pengaduan orang lain', 403, res7.status, res7.data);

    // Skenario 8: Mahasiswa mengubah status pengaduan (403)
    const res8 = await request('/pengaduan/1/status', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenMhs1}` },
      body: { status: 'selesai' }
    });
    recordResult(8, 'Mahasiswa mengubah status pengaduan', 403, res8.status, res8.data);

    // Skenario 9: Admin melihat seluruh pengaduan (200)
    const res9 = await request('/pengaduan', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    recordResult(9, 'Admin melihat seluruh pengaduan', 200, res9.status, res9.data);

    // Skenario 10: Admin memperbarui status pengaduan (200)
    const res10 = await request('/pengaduan/1/status', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenAdmin}` },
      body: { status: 'diproses' }
    });
    recordResult(10, 'Admin memperbarui status pengaduan', 200, res10.status, res10.data);

    // Skenario 11: Membuat pengaduan dengan field wajib kosong (400)
    const res11 = await request('/pengaduan', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenMhs1}` },
      body: {
        judul: '',
        kategori: 'Fasilitas',
        deskripsi: ''
      }
    });
    recordResult(11, 'Membuat pengaduan dengan field wajib kosong', 400, res11.status, res11.data);

    // Skenario 12: Mengakses ID pengaduan yang tidak ditemukan (404)
    const res12 = await request('/pengaduan/99999', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    recordResult(12, 'Mengakses ID pengaduan yang tidak ditemukan', 404, res12.status, res12.data);

    console.log('\n================================================================================');
    console.log(' REKAPITULASI HASIL PENGUJIAN');
    console.log('================================================================================');
    console.table(
      testResults.map((t) => ({
        No: t.no,
        Skenario: t.skenario,
        Ekspektasi: t.expected,
        Aktual: t.actual,
        Status: t.status
      }))
    );

    const allPassed = testResults.every((t) => t.status.includes('PASSED'));
    console.log(`\nStatus Keseluruhan: ${allPassed ? 'SEMUA 12 SKENARIO BERHASIL MEMENUHI KONTRAK!' : 'ADA SKENARIO GAGAL'}`);
  } catch (err) {
    console.error('Terjadi kesalahan saat pengujian:', err);
  } finally {
    server.close();
  }
}

// Jalankan server lalu mulai pengujian
server = http.createServer(app).listen(PORT, () => {
  runTests();
});
