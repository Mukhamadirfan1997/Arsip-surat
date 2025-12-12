# Cara Memberikan Izin Google Drive untuk Aplikasi

Jika Anda mendapat error:
```
Exception: Anda tidak memiliki izin untuk memanggil DriveApp.getRootFolder
```

Ini berarti aplikasi belum memiliki izin untuk mengakses Google Drive. Ikuti langkah berikut:

## Metode 1: Memberikan Izin Melalui Execution (Disarankan)

1. **Buka Google Apps Script Editor**
   - Buka [script.google.com](https://script.google.com)
   - Pilih project aplikasi Anda

2. **Jalankan Fungsi untuk Memicu Permintaan Izin**
   - Di editor, pilih fungsi `uploadFileToDrive` dari dropdown di atas editor
   - Klik tombol **"Run"** (▶️)
   - Atau pilih fungsi `doGet` dan klik **"Run"**

3. **Berikan Izin**
   - Akan muncul popup **"Authorization required"**
   - Klik **"Review Permissions"**
   - Pilih akun Google Anda
   - Klik **"Advanced"** → **"Go to [Nama Project Anda] (unsafe)"**
   - Klik **"Allow"** untuk memberikan izin

4. **Verifikasi Izin**
   - Setelah memberikan izin, coba jalankan fungsi lagi
   - Jika tidak ada error, izin sudah berhasil diberikan

## Metode 2: Melalui Deployment Baru

1. **Hapus Deployment Lama (Opsional)**
   - Di editor Apps Script, klik **"Deploy"** → **"Manage deployments"**
   - Hapus deployment lama jika ada

2. **Buat Deployment Baru**
   - Klik **"Deploy"** → **"New deployment"**
   - Pilih **"Web app"**
   - Set konfigurasi:
     - **Execute as:** Me
     - **Who has access:** Anyone (atau sesuai kebutuhan)
   - Klik **"Deploy"**

3. **Berikan Izin**
   - Saat deployment dibuat, akan muncul permintaan izin
   - Klik **"Authorize access"**
   - Pilih akun Google Anda
   - Klik **"Advanced"** → **"Go to [Nama Project] (unsafe)"**
   - Klik **"Allow"**

## Metode 3: Menambahkan File Manifest (appsscript.json)

1. **Aktifkan Tampilan Manifest File**
   - Di editor Apps Script, klik **"Project Settings"** (⚙️) di sidebar kiri
   - Centang **"Show 'appsscript.json' manifest file in editor"**
   - Kembali ke editor

2. **Tambahkan File appsscript.json**
   - File `appsscript.json` akan muncul di daftar file
   - Klik file tersebut
   - Salin isi dari file `appsscript.json` yang telah disediakan:
     ```json
     {
       "timeZone": "Asia/Jakarta",
       "dependencies": {},
       "exceptionLogging": "STACKDRIVER",
       "runtimeVersion": "V8",
       "oauthScopes": [
         "https://www.googleapis.com/auth/spreadsheets",
         "https://www.googleapis.com/auth/drive",
         "https://www.googleapis.com/auth/drive.file"
       ]
     }
     ```
   - Simpan file

3. **Jalankan Script untuk Memicu Izin**
   - Pilih fungsi `uploadFileToDrive` atau `doGet`
   - Klik **"Run"**
   - Berikan izin saat diminta

## Verifikasi Izin Sudah Diberikan

1. **Cek di Project Settings**
   - Klik **"Project Settings"** (⚙️)
   - Scroll ke bagian **"OAuth scopes"**
   - Pastikan scope berikut ada:
     - `https://www.googleapis.com/auth/spreadsheets`
     - `https://www.googleapis.com/auth/drive`
     - `https://www.googleapis.com/auth/drive.file`

2. **Test Upload File**
   - Buka aplikasi web Anda
   - Coba upload file
   - Jika berhasil, izin sudah benar

## Troubleshooting

### Masih Error Setelah Memberikan Izin

1. **Hapus Izin Lama dan Berikan Lagi**
   - Buka [Google Account Permissions](https://myaccount.google.com/permissions)
   - Cari aplikasi Anda
   - Klik **"Remove"**
   - Jalankan script lagi dan berikan izin baru

2. **Pastikan File appsscript.json Benar**
   - Pastikan file `appsscript.json` sudah ditambahkan
   - Pastikan scope `drive` dan `drive.file` ada di dalamnya

3. **Cek Execution Log**
   - Di editor Apps Script, klik **"Executions"** (📊)
   - Lihat log error terbaru
   - Pastikan error sudah tidak muncul

### Error: "This app isn't verified"

Ini adalah peringatan normal untuk aplikasi yang belum diverifikasi oleh Google. Untuk aplikasi pribadi:

1. Klik **"Advanced"**
2. Klik **"Go to [Nama Project] (unsafe)"**
3. Klik **"Allow"**

Aplikasi akan berfungsi normal meskipun belum diverifikasi.

## Catatan Penting

- **Izin diberikan per akun Google**: Setiap akun yang menjalankan aplikasi harus memberikan izin sendiri
- **Izin berlaku permanen**: Setelah diberikan, izin akan tetap berlaku kecuali dihapus manual
- **Deployment baru mungkin memerlukan izin baru**: Jika membuat deployment baru, mungkin perlu memberikan izin lagi

---

**Setelah memberikan izin, aplikasi upload file seharusnya berfungsi dengan baik!** ✅

