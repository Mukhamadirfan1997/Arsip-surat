# Panduan Pengiriman Data via URL Google Apps Script

## 📋 Ringkasan

Aplikasi ini sekarang mendukung pengiriman data melalui **HTTP POST** ke URL Google Apps Script, sehingga bisa digunakan dari aplikasi eksternal atau website manapun, tidak hanya dari dalam Google Apps Script environment.

## 🔧 Setup

### 1. Deploy Google Apps Script sebagai Web App

1. Buka [Google Apps Script](https://script.google.com)
2. Buka project Anda
3. Klik **Deploy** → **New deployment**
4. Klik ikon ⚙️ di sebelah "Select type"
5. Pilih **Web app**
6. Konfigurasi:
   - **Execute as:** Me (akun Anda)
   - **Who has access:** Anyone (atau sesuai kebutuhan)
7. Klik **Deploy**
8. **SALIN URL** yang muncul (contoh: `https://script.google.com/macros/s/AKfycby.../exec`)

### 2. Konfigurasi URL di JavaScript

Buka file `Index.html` dan cari baris:

```javascript
const GOOGLE_APPS_SCRIPT_URL = 'GANTI_DENGAN_URL_WEB_APP_ANDA';
```

Ganti dengan URL yang Anda salin di langkah 1.

### 3. Pilih Mode Pengiriman Data

Di file `Index.html`, ada konfigurasi:

```javascript
const DATA_SUBMIT_MODE = 'url'; // 'url' atau 'script'
```

- **'url'**: Menggunakan HTTP POST ke URL (bisa digunakan dari manapun)
- **'script'**: Menggunakan `google.script.run` (hanya bekerja di Google Apps Script environment)

## 📡 Cara Kerja

### Metode URL (HTTP POST)

Aplikasi mengirim data menggunakan **Fetch API** dengan metode POST:

```javascript
fetch(GOOGLE_APPS_SCRIPT_URL, {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
})
```

**Data yang dikirim:**
```json
{
  "jenisSurat": "Masuk",
  "nomorSurat": "001/SM/2024",
  "tanggalSurat": "2024-01-15",
  "tanggalTerimaKirim": "2024-01-16",
  "asalTujuan": "Instansi ABC",
  "perihal": "Surat Penting",
  "keterangan": "Catatan tambahan"
}
```

### Server-side (Code.gs)

Fungsi `doPost()` di `Code.gs` menerima data dan menyimpannya ke Google Spreadsheet:

```javascript
function doPost(e) {
  // Parse data dari request
  let formData = JSON.parse(e.postData.contents);
  
  // Simpan ke spreadsheet
  const result = saveDataToSheet(formData);
  
  // Return response
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 🔍 Testing

### 1. Testing di Browser Console

Buka browser console (F12) dan jalankan:

```javascript
// Test data
const testData = {
  jenisSurat: 'Masuk',
  nomorSurat: 'TEST/001/2024',
  tanggalSurat: '2024-01-15',
  tanggalTerimaKirim: '2024-01-16',
  asalTujuan: 'Test Instansi',
  perihal: 'Test Perihal',
  keterangan: 'Test Keterangan'
};

// Kirim data
sendDataViaURL(
  testData,
  (result) => console.log('Sukses:', result),
  (error) => console.error('Error:', error)
);
```

### 2. Testing dengan cURL

```bash
curl -X POST "YOUR_GOOGLE_APPS_SCRIPT_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "jenisSurat": "Masuk",
    "nomorSurat": "001/SM/2024",
    "tanggalSurat": "2024-01-15",
    "asalTujuan": "Test",
    "perihal": "Test"
  }'
```

### 3. Testing dengan Postman

1. Buka Postman
2. Method: **POST**
3. URL: Masukkan URL Google Apps Script Anda
4. Headers:
   - `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "jenisSurat": "Masuk",
  "nomorSurat": "001/SM/2024",
  "tanggalSurat": "2024-01-15",
  "asalTujuan": "Test Instansi",
  "perihal": "Test Perihal"
}
```

## 📝 Fungsi JavaScript yang Tersedia

### 1. `sendDataViaURL(formData, successCallback, errorCallback)`

Mengirim data via HTTP POST dengan JSON format.

**Parameter:**
- `formData` (Object): Data yang akan dikirim
- `successCallback` (Function): Dipanggil jika sukses
- `errorCallback` (Function): Dipanggil jika error

**Contoh:**
```javascript
sendDataViaURL(
  {
    jenisSurat: 'Masuk',
    nomorSurat: '001/SM/2024',
    tanggalSurat: '2024-01-15'
  },
  (result) => {
    console.log('Sukses:', result);
  },
  (error) => {
    console.error('Error:', error);
  }
);
```

### 2. `sendDataViaFormURL(formData, successCallback, errorCallback)`

Mengirim data via HTTP POST dengan Form URL-encoded format (alternatif).

**Contoh:**
```javascript
sendDataViaFormURL(
  formData,
  (result) => console.log('Sukses:', result),
  (error) => console.error('Error:', error)
);
```

## ⚠️ Catatan Penting

1. **CORS**: Google Apps Script menggunakan `no-cors` mode, jadi response tidak bisa dibaca langsung. Aplikasi akan menganggap sukses jika tidak ada error.

2. **URL Deployment**: Setiap kali Anda mengupdate kode di Google Apps Script, Anda perlu membuat deployment baru dan mendapatkan URL baru.

3. **Izin Akses**: Pastikan deployment di-set ke "Anyone" jika ingin bisa diakses dari eksternal.

4. **Validasi**: Data divalidasi di server-side (Code.gs), jadi pastikan field wajib diisi.

5. **Error Handling**: Jika terjadi error, cek:
   - URL sudah benar
   - Deployment sudah dibuat
   - Izin akses sudah di-set
   - Data yang dikirim sesuai format

## 🔒 Keamanan

Untuk keamanan lebih, Anda bisa:

1. **Menambahkan API Key**: Modifikasi `doPost()` untuk memvalidasi API key
2. **Rate Limiting**: Batasi jumlah request per waktu
3. **Whitelist Domain**: Hanya izinkan request dari domain tertentu

## 📞 Troubleshooting

### Error: "URL Google Apps Script belum dikonfigurasi"
- Pastikan `GOOGLE_APPS_SCRIPT_URL` sudah di-set di `Index.html`

### Error: "Network error"
- Cek koneksi internet
- Pastikan URL benar
- Cek apakah deployment masih aktif

### Data tidak tersimpan
- Cek console browser untuk error
- Pastikan field wajib sudah diisi
- Cek execution log di Google Apps Script editor

---

**Selamat menggunakan! 🎉**

