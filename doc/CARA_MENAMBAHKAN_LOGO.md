# Cara Menambahkan Logo di Google Apps Script

Logo sudah ditambahkan di header aplikasi dengan nama lembaga **SDN TOYANING 1 REJOSO**.

## Untuk Localhost/Testing

Logo akan otomatis muncul dari folder `img/Logosekolah.png` saat testing di localhost.

## Untuk Google Apps Script

Karena Google Apps Script tidak bisa mengakses file gambar dengan path relatif, ada beberapa cara untuk menambahkan logo:

### Opsi 1: Upload ke Google Drive (Disarankan)

1. **Upload gambar logo ke Google Drive**
   - Buka [Google Drive](https://drive.google.com)
   - Upload file `Logosekolah.png` ke Google Drive
   - Klik kanan file → **"Get link"** atau **"Dapatkan tautan"**
   - Set sharing ke **"Anyone with the link"** atau **"Siapa saja yang memiliki tautan"**
   - Copy URL yang muncul

2. **Ganti URL di Index.html**
   - Buka file `Index.html` di Google Apps Script editor
   - Cari baris: `<img src="img/Logosekolah.png" ...`
   - Ganti dengan URL dari Google Drive:
     ```html
     <img src="https://drive.google.com/uc?export=view&id=FILE_ID_DARI_DRIVE" alt="Logo SDN TOYANING 1 REJOSO" id="schoolLogo" />
     ```
   - Ganti `FILE_ID_DARI_DRIVE` dengan ID file dari URL Google Drive
   - Contoh URL Google Drive: `https://drive.google.com/file/d/FILE_ID/view`
   - Gunakan format: `https://drive.google.com/uc?export=view&id=FILE_ID`

### Opsi 2: Menggunakan Base64 Encoding

1. **Convert gambar ke Base64**
   - Buka [Base64 Image Encoder](https://www.base64-image.de/) atau tool serupa
   - Upload gambar `Logosekolah.png`
   - Copy hasil base64 string

2. **Ganti di Index.html**
   - Cari baris: `<img src="img/Logosekolah.png" ...`
   - Ganti dengan:
     ```html
     <img src="data:image/png;base64,PASTE_BASE64_STRING_DISINI" alt="Logo SDN TOYANING 1 REJOSO" id="schoolLogo" />
     ```
   - Paste base64 string setelah `base64,`

### Opsi 3: Menggunakan URL Eksternal

Jika logo sudah di-hosting di website lain, gunakan URL lengkap:
```html
<img src="https://example.com/path/to/logo.png" alt="Logo SDN TOYANING 1 REJOSO" id="schoolLogo" />
```

## Catatan

- Logo akan otomatis disembunyikan jika tidak bisa dimuat (menggunakan `onerror`)
- Logo memiliki background putih dan border radius untuk tampilan yang lebih rapi
- Logo responsive dan akan menyesuaikan ukuran di mobile device
- Nama lembaga **SDN TOYANING 1 REJOSO** sudah ditambahkan di header

---

**Setelah menambahkan logo, simpan dan deploy ulang aplikasi web app.**

