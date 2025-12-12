# Troubleshooting - Data Tidak Muncul di Spreadsheet

## 🔍 Langkah-langkah Debugging

### 1. Cek Console Browser

Buka browser console (F12) dan periksa:

**Yang harus muncul:**
- `Mengirim data via URL: {...}`
- `URL target: https://script.google.com/...`
- `Mengirim JSON: {...}`
- `Response status: 200` atau `0`
- `Response dari server (parsed): {...}`

**Jika ada error:**
- `Network error` → Cek koneksi internet dan URL
- `HTTP Error: 404` → URL salah atau deployment tidak aktif
- `HTTP Error: 403` → Izin akses tidak cukup
- `Error parsing JSON` → Response dari server tidak valid

### 2. Cek Execution Log di Google Apps Script

1. Buka [Google Apps Script](https://script.google.com)
2. Buka project Anda
3. Klik **Executions** (ikon jam) di sidebar kiri
4. Periksa log untuk melihat:
   - Apakah `doPost()` dipanggil?
   - Apakah ada error?
   - Apakah data diterima dengan benar?

**Log yang harus muncul:**
```
doPost dipanggil
e.postData: {...}
Data JSON parsed: {...}
Membuka spreadsheet dengan ID: ...
Menyimpan data ke spreadsheet...
Data berhasil ditambahkan ke baris: X
Data berhasil disimpan dengan sukses!
```

### 3. Cek Spreadsheet ID

Pastikan `SPREADSHEET_ID` di `Code.gs` sudah benar:

```javascript
const SPREADSHEET_ID = '1XnsHSh1SwLwyjTvwGWtha4VXwKOdsKPCme3q-mnGBko';
```

**Cara mendapatkan ID:**
1. Buka Google Spreadsheet Anda
2. Lihat URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`
3. Salin bagian `SPREADSHEET_ID_HERE`

### 4. Cek Izin Akses

Pastikan:
1. Spreadsheet sudah dibagikan dengan akun yang menjalankan script
2. Deployment di-set ke "Anyone" atau sesuai kebutuhan
3. Script sudah diberi izin akses ke Spreadsheet

### 5. Test Manual dengan cURL

Test langsung ke URL untuk memastikan server bekerja:

```bash
curl -X POST "YOUR_GOOGLE_APPS_SCRIPT_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "jenisSurat": "Masuk",
    "nomorSurat": "TEST/001/2024",
    "tanggalSurat": "2024-01-15",
    "asalTujuan": "Test",
    "perihal": "Test"
  }'
```

**Response yang diharapkan:**
```json
{
  "success": true,
  "message": "Data surat berhasil disimpan!"
}
```

## 🐛 Masalah Umum dan Solusi

### Masalah 1: Response Status 0

**Gejala:** Response status 0, tapi data tidak muncul

**Penyebab:** 
- CORS issue
- Response tidak bisa dibaca karena mode no-cors

**Solusi:**
- Gunakan XMLHttpRequest (sudah diimplementasikan)
- Pastikan deployment di-set ke "Anyone"

### Masalah 2: "Tidak ada data yang diterima"

**Gejala:** Server mengembalikan error "Tidak ada data yang diterima"

**Penyebab:**
- Data tidak dikirim dengan benar
- Content-Type header salah

**Solusi:**
- Pastikan menggunakan `Content-Type: application/json`
- Pastikan data dikirim sebagai JSON string

### Masalah 3: "Data tidak valid"

**Gejala:** Server mengembalikan "Data tidak valid"

**Penyebab:**
- Field wajib tidak diisi
- Format data salah

**Solusi:**
- Pastikan `jenisSurat`, `nomorSurat`, dan `tanggalSurat` diisi
- Cek format data di console browser

### Masalah 4: "Error: Spreadsheet tidak ditemukan"

**Gejala:** Error di execution log

**Penyebab:**
- SPREADSHEET_ID salah
- Spreadsheet tidak dibagikan dengan akun script

**Solusi:**
- Cek SPREADSHEET_ID
- Bagikan spreadsheet dengan akun yang menjalankan script
- Pastikan izin "Editor" atau "Viewer" (minimal)

### Masalah 5: Data muncul tapi di sheet yang salah

**Gejala:** Data tersimpan tapi tidak di sheet "Data Surat"

**Penyebab:**
- Sheet "Data Surat" belum ada
- Nama sheet berbeda

**Solusi:**
- Script akan otomatis membuat sheet jika belum ada
- Cek apakah sheet sudah dibuat
- Pastikan nama sheet sesuai dengan `SHEET_NAME` di Code.gs

## 🔧 Testing Step-by-Step

### Test 1: Cek URL

Buka URL di browser:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**Harus muncul:** Halaman form aplikasi

### Test 2: Test dengan Browser Console

Buka console (F12) dan jalankan:

```javascript
// Test data
const testData = {
  jenisSurat: 'Masuk',
  nomorSurat: 'TEST/001/2024',
  tanggalSurat: '2024-01-15',
  asalTujuan: 'Test Instansi',
  perihal: 'Test Perihal'
};

// Kirim data
sendDataViaURL(
  testData,
  (result) => {
    console.log('✅ Sukses:', result);
    alert('Data berhasil dikirim! Cek spreadsheet.');
  },
  (error) => {
    console.error('❌ Error:', error);
    alert('Error: ' + error.message);
  }
);
```

### Test 3: Cek Execution Log

1. Setelah test, buka Google Apps Script
2. Klik **Executions**
3. Periksa log terbaru
4. Cek apakah ada error

### Test 4: Cek Spreadsheet

1. Buka Google Spreadsheet
2. Cek sheet "Data Surat"
3. Periksa apakah data muncul

## 📝 Checklist

Sebelum melaporkan masalah, pastikan:

- [ ] URL Google Apps Script sudah benar
- [ ] SPREADSHEET_ID sudah benar
- [ ] Spreadsheet sudah dibagikan dengan akun script
- [ ] Deployment sudah dibuat dan aktif
- [ ] Field wajib sudah diisi (jenisSurat, nomorSurat, tanggalSurat)
- [ ] Console browser tidak menunjukkan error
- [ ] Execution log di Google Apps Script sudah dicek
- [ ] Koneksi internet stabil

## 🆘 Masih Tidak Berfungsi?

Jika semua langkah di atas sudah dilakukan tapi masih tidak berfungsi:

1. **Copy semua log dari console browser**
2. **Copy execution log dari Google Apps Script**
3. **Screenshot error message**
4. **Cek apakah ada error di spreadsheet** (permission, dll)

Dengan informasi ini, masalah bisa lebih mudah diidentifikasi.

---

**Tips:** Selalu cek execution log di Google Apps Script untuk melihat apa yang terjadi di server-side!

