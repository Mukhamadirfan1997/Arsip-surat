# Perbaikan Upload File - Troubleshooting Guide

## 🔧 Perbaikan yang Sudah Dilakukan

### 1. **Batasan Ukuran File**
- Maksimal file: **500KB** (bukan 10MB)
- Alasan: File base64 akan membuat URL terlalu panjang
- File 500KB = ~665KB base64, masih dalam batas wajar

### 2. **Form Submission dengan Iframe**
- File besar menggunakan form submission dengan iframe
- Menghindari CORS dan batas panjang URL
- Timeout 15 detik dengan fallback

### 3. **Logging yang Lebih Baik**
- Logging detail di client-side (console browser)
- Logging detail di server-side (execution log)
- Deteksi file terpotong

## 🐛 Masalah yang Mungkin Terjadi

### Masalah 1: File Terlalu Besar
**Gejala:** File tidak terkirim, atau hanya sebagian yang terkirim

**Solusi:**
- Kompres file sebelum upload
- Gunakan file <500KB
- Atau gunakan kompresi PDF/image

### Masalah 2: URL Terlalu Panjang
**Gejala:** Browser error atau request gagal

**Solusi:**
- File sudah dibatasi maksimal 500KB
- Form submission dengan iframe sudah diimplementasikan
- Jika masih error, kurangi ukuran file

### Masalah 3: File Data Terpotong
**Gejala:** File name ada tapi fileData kosong atau sangat pendek

**Penyebab:**
- Browser memotong URL yang terlalu panjang
- File terlalu besar

**Solusi:**
- Gunakan file lebih kecil
- Cek execution log untuk melihat panjang fileData yang diterima

## 📋 Langkah Debugging

### 1. Cek Console Browser
Buka console (F12) dan periksa:
- `File terdeteksi: ... Size: ... KB`
- `File read as base64, total length: ...`
- `Base64 data length (after split): ...`
- `Total form data size: ... KB`
- `Form submitted successfully`

### 2. Cek Execution Log di Google Apps Script
1. Buka [Google Apps Script](https://script.google.com)
2. Buka project Anda
3. Klik **Executions** (ikon jam)
4. Periksa log terbaru:
   - `doGet dengan action=save dipanggil`
   - `File Name: ...`
   - `File Data Length: ... characters`
   - `Memulai upload file ke Google Drive...`
   - `File berhasil diupload, URL: ...`

### 3. Cek Spreadsheet
- Buka Google Spreadsheet
- Cek kolom "File" - harus berisi URL Google Drive
- Klik URL untuk membuka file

### 4. Cek Google Drive
- Buka folder dengan ID: `12gdY_vOK7vKBvWYQbpT71kvZYfVT-XOt`
- Atau cek root Drive jika folder ID kosong
- File harus ada di sana

## ⚠️ Batasan Teknis

1. **Batas Panjang URL Browser:**
   - Chrome/Edge: ~2MB
   - Firefox: ~65KB
   - Safari: ~80KB
   - **Rekomendasi: File <500KB untuk kompatibilitas maksimal**

2. **Base64 Overhead:**
   - File base64 ~33% lebih besar dari file asli
   - 500KB file = ~665KB base64

3. **CORS:**
   - Response tidak bisa dibaca karena CORS
   - Tapi data tetap terkirim jika status 200/0

## 🔍 Checklist Troubleshooting

Sebelum melaporkan masalah, pastikan:

- [ ] File size < 500KB
- [ ] Console browser tidak menunjukkan error
- [ ] Execution log di Google Apps Script sudah dicek
- [ ] File name dan file type terdeteksi dengan benar
- [ ] File data length > 100 characters (jika file name ada)
- [ ] Spreadsheet sudah dicek
- [ ] Google Drive folder sudah dicek

## 💡 Tips

1. **Untuk file besar:**
   - Kompres PDF menggunakan online tool
   - Kompres image menggunakan tool kompresi
   - Pertimbangkan split file menjadi beberapa bagian

2. **Testing:**
   - Mulai dengan file kecil (<100KB)
   - Jika berhasil, coba file lebih besar
   - Monitor execution log untuk melihat proses

3. **Alternatif:**
   - Jika file sangat besar, pertimbangkan upload manual ke Google Drive
   - Atau gunakan Google Apps Script HTML Service (mode 'script')

---

**Jika masih ada masalah, salin log dari console browser dan execution log untuk debugging lebih lanjut.**

