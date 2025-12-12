# ✅ Checklist Deploy Aplikasi Pencatatan Arsip Surat

## 📋 Pre-Deployment Checklist

### 1. Konfigurasi Code.gs
- [x] **SPREADSHEET_ID** sudah diisi dengan ID Spreadsheet yang benar
- [x] **DRIVE_FOLDER_ID** sudah diisi (atau dikosongkan jika ingin di root Drive)
- [x] **SHEET_NAME** sudah sesuai ('Data Surat')
- [x] Semua fungsi tidak ada duplikasi
- [x] Error handling sudah lengkap

### 2. Konfigurasi Index.html
- [ ] **GOOGLE_APPS_SCRIPT_URL** harus diganti dengan URL Web App setelah deploy
- [x] **DATA_SUBMIT_MODE** sudah diset ('url' atau 'script')
- [x] Logo sudah ditambahkan (path: `img/Logosekolah.png`)
- [x] Nama lembaga sudah ditambahkan: **SDN TOYANING 1 REJOSO**

### 3. File yang Perlu Di-upload ke Google Apps Script
- [x] `Code.gs` - Server-side code
- [x] `Index.html` - Client-side UI
- [x] `appsscript.json` - Manifest file (izin akses)
- [ ] `img/Logosekolah.png` - Logo sekolah (upload ke Google Drive dan ganti URL di Index.html)

### 4. Google Spreadsheet Setup
- [ ] Spreadsheet sudah dibuat
- [ ] Spreadsheet sudah dibagikan dengan akun yang menjalankan script
- [ ] Sheet "Data Surat" akan dibuat otomatis jika belum ada

### 5. Google Drive Setup
- [ ] Folder untuk menyimpan file sudah dibuat (opsional)
- [ ] Folder sudah dibagikan dengan akun yang menjalankan script
- [ ] DRIVE_FOLDER_ID sudah diisi di Code.gs (atau dikosongkan untuk root Drive)

## 🚀 Langkah Deploy

### Step 1: Upload File ke Google Apps Script
1. Buka [Google Apps Script](https://script.google.com)
2. Buat project baru atau buka project yang sudah ada
3. Upload file:
   - Copy isi `Code.gs` ke editor Apps Script
   - Klik **"+"** → **"HTML"** → Buat file `Index`
   - Copy isi `Index.html` ke file `Index`
   - Klik **"Project Settings"** (⚙️) → Centang **"Show 'appsscript.json' manifest file in editor"**
   - Copy isi `appsscript.json` ke file `appsscript.json`

### Step 2: Konfigurasi
1. **Ganti SPREADSHEET_ID** di `Code.gs`:
   ```javascript
   const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';
   ```

2. **Ganti DRIVE_FOLDER_ID** di `Code.gs` (opsional):
   ```javascript
   const DRIVE_FOLDER_ID = 'GANTI_DENGAN_ID_FOLDER_ANDA'; // atau kosongkan ''
   ```

3. **Upload Logo ke Google Drive**:
   - Upload `img/Logosekolah.png` ke Google Drive
   - Set sharing ke "Anyone with the link"
   - Copy URL dan ganti di `Index.html`:
     ```html
     <img src="https://drive.google.com/uc?export=view&id=FILE_ID" ... />
     ```

### Step 3: Berikan Izin
1. Klik **"Run"** (▶️) pada fungsi `doGet` atau `uploadFileToDrive`
2. Klik **"Review Permissions"**
3. Pilih akun Google Anda
4. Klik **"Advanced"** → **"Go to [Project Name] (unsafe)"**
5. Klik **"Allow"** untuk memberikan izin:
   - Google Spreadsheet
   - Google Drive

### Step 4: Deploy Web App
1. Klik **"Deploy"** → **"New deployment"**
2. Klik ikon **"Select type"** (⚙️) → Pilih **"Web app"**
3. Isi konfigurasi:
   - **Description:** Aplikasi Pencatatan Arsip Surat - SDN TOYANING 1 REJOSO
   - **Execute as:** Me (akun Anda)
   - **Who has access:** Anyone (untuk akses publik) atau sesuai kebutuhan
4. Klik **"Deploy"**
5. **PENTING:** Copy **Web App URL** yang muncul
6. Klik **"Done"**

### Step 5: Update URL di Index.html
1. Buka file `Index.html` di Apps Script editor
2. Cari baris:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'GANTI_DENGAN_URL_WEB_APP_ANDA';
   ```
3. Ganti dengan URL Web App yang sudah di-copy
4. Simpan file

### Step 6: Deploy Ulang (jika perlu)
1. Jika sudah mengubah `Index.html`, klik **"Deploy"** → **"Manage deployments"**
2. Klik ikon **"Edit"** (✏️) pada deployment yang ada
3. Klik **"Deploy"** untuk update

## ✅ Post-Deployment Testing

### Test 1: Akses Web App
- [ ] Buka Web App URL di browser
- [ ] Logo sekolah muncul dengan benar
- [ ] Nama lembaga "SDN TOYANING 1 REJOSO" muncul
- [ ] Form input muncul dengan lengkap

### Test 2: Input Data Tanpa File
- [ ] Isi form dengan data contoh
- [ ] Klik "Simpan Data"
- [ ] Notifikasi sukses muncul
- [ ] Data muncul di Google Spreadsheet

### Test 3: Input Data Dengan File
- [ ] Isi form dengan data contoh
- [ ] Upload file (PDF/JPG, max 2MB)
- [ ] Klik "Simpan Data"
- [ ] Notifikasi sukses muncul
- [ ] Data muncul di Google Spreadsheet
- [ ] File muncul di Google Drive
- [ ] URL file muncul di kolom "File" di Spreadsheet

### Test 4: Validasi Form
- [ ] Coba submit tanpa mengisi field wajib
- [ ] Error message muncul dengan benar
- [ ] Form tidak bisa di-submit

### Test 5: Error Handling
- [ ] Cek Execution Log di Apps Script (View → Execution log)
- [ ] Tidak ada error yang muncul
- [ ] Semua fungsi berjalan dengan baik

## 🔧 Troubleshooting

### Error: "Spreadsheet tidak ditemukan"
- Pastikan SPREADSHEET_ID benar
- Pastikan Spreadsheet sudah dibagikan dengan akun yang menjalankan script

### Error: "Anda tidak memiliki izin untuk memanggil DriveApp"
- Pastikan sudah memberikan izin Google Drive
- Lihat file `IZIN_GOOGLE_DRIVE.md` untuk panduan lengkap

### Logo tidak muncul
- Pastikan logo sudah di-upload ke Google Drive
- Pastikan URL logo sudah benar di Index.html
- Lihat file `CARA_MENAMBAHKAN_LOGO.md` untuk panduan lengkap

### Data tidak tersimpan
- Cek Execution Log di Apps Script
- Pastikan semua field wajib sudah diisi
- Pastikan SPREADSHEET_ID benar

## 📝 Catatan Penting

1. **Jangan commit SPREADSHEET_ID dan DRIVE_FOLDER_ID ke GitHub** jika ingin menjaga privasi
2. **Gunakan environment variables** atau file konfigurasi terpisah untuk production
3. **Backup data** secara berkala dari Google Spreadsheet
4. **Monitor Execution Log** untuk melihat aktivitas aplikasi
5. **Update deployment** setiap kali ada perubahan kode

## 📚 Dokumentasi Tambahan

- `README.md` - Panduan setup lengkap
- `IZIN_GOOGLE_DRIVE.md` - Panduan memberikan izin Google Drive
- `CARA_MENAMBAHKAN_LOGO.md` - Panduan menambahkan logo
- `TROUBLESHOOTING.md` - Panduan troubleshooting

---

**Setelah semua checklist selesai, aplikasi siap digunakan! 🎉**

