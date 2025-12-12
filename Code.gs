/**
 * Aplikasi Pencatatan Arsip Surat Masuk dan Keluar
 * Google Apps Script - Server-side Code
 */

// GANTI ID SPREADSHEET ANDA DI SINI
// Cara mendapatkan ID: Buka Google Spreadsheet Anda, lihat URL
// Contoh: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
const SPREADSHEET_ID = '1XnsHSh1SwLwyjTvwGWtha4VXwKOdsKPCme3q-mnGBko';

// Nama sheet yang akan digunakan untuk menyimpan data
const SHEET_NAME = 'Data Surat';

// ID Folder Google Drive untuk menyimpan file (opsional, kosongkan jika ingin di root Drive)
// Cara mendapatkan ID: Buka folder di Google Drive, lihat URL
// Contoh: https://drive.google.com/drive/folders/FOLDER_ID_HERE
const DRIVE_FOLDER_ID = '1r4MoqSIsu6nm_zBxdDvZs3VXEkflMZkp'; // Kosongkan jika ingin menyimpan di root Drive

/**
 * Fungsi untuk menyertakan file HTML lain (CSS)
 * Digunakan untuk memisahkan stylesheet
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}


/**
 * Fungsi untuk menangani POST request dari external URL
 * Digunakan untuk menerima data dari aplikasi eksternal
 */
function doPost(e) {
  try {
    Logger.log('doPost dipanggil');
    Logger.log('e.postData: ' + JSON.stringify(e.postData));
    Logger.log('e.parameter: ' + JSON.stringify(e.parameter));
    
    // Parse data dari request
    let formData;
    
    // doPost bisa menerima data dari:
    // 1. POST body dengan Content-Type: application/x-www-form-urlencoded (e.postData.contents)
    // 2. GET parameter (e.parameter) - jika form dikirim sebagai GET tapi masuk ke doPost
    if (e.postData && e.postData.contents) {
      // Data dikirim sebagai POST body (form-urlencoded)
      Logger.log('Parsing POST body data...');
      Logger.log('Content-Type: ' + (e.postData.type || 'unknown'));
      Logger.log('POST body length: ' + e.postData.contents.length + ' characters');
      
      // Parse form-urlencoded data
      const postDataString = e.postData.contents;
      const params = {};
      const pairs = postDataString.split('&');
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        if (pair.length === 2) {
          const key = decodeURIComponent(pair[0]);
          const value = decodeURIComponent(pair[1].replace(/\+/g, ' '));
          params[key] = value;
        }
      }
      
      formData = {
        jenisSurat: params.jenisSurat || '',
        nomorSurat: params.nomorSurat || '',
        tanggalSurat: params.tanggalSurat || '',
        tanggalTerimaKirim: params.tanggalTerimaKirim || null,
        asalTujuan: params.asalTujuan || '',
        perihal: params.perihal || '',
        keterangan: params.keterangan || '',
        fileName: params.fileName || '',
        fileType: params.fileType || '',
        fileData: params.fileData || ''
      };
      Logger.log('Data dari POST body: ' + JSON.stringify({
        jenisSurat: formData.jenisSurat,
        nomorSurat: formData.nomorSurat,
        tanggalSurat: formData.tanggalSurat,
        fileName: formData.fileName,
        fileDataLength: formData.fileData ? formData.fileData.length : 0
      }));
      if (formData.fileName && formData.fileData) {
        Logger.log('File detected in POST body: ' + formData.fileName);
        Logger.log('File data preview (first 100 chars): ' + formData.fileData.substring(0, 100));
        Logger.log('File data preview (last 100 chars): ' + formData.fileData.substring(Math.max(0, formData.fileData.length - 100)));
      }
    } else if (e.parameter) {
      // Data dikirim sebagai GET parameter (fallback)
      formData = {
        jenisSurat: e.parameter.jenisSurat || '',
        nomorSurat: e.parameter.nomorSurat || '',
        tanggalSurat: e.parameter.tanggalSurat || '',
        tanggalTerimaKirim: e.parameter.tanggalTerimaKirim || null,
        asalTujuan: e.parameter.asalTujuan || '',
        perihal: e.parameter.perihal || '',
        keterangan: e.parameter.keterangan || '',
        fileName: e.parameter.fileName || '',
        fileType: e.parameter.fileType || '',
        fileData: e.parameter.fileData || ''
      };
      Logger.log('Data dari parameter: ' + JSON.stringify({
        jenisSurat: formData.jenisSurat,
        nomorSurat: formData.nomorSurat,
        tanggalSurat: formData.tanggalSurat,
        fileName: formData.fileName,
        fileDataLength: formData.fileData ? formData.fileData.length : 0
      }));
    } else {
      Logger.log('Tidak ada data yang diterima');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Tidak ada data yang diterima. Pastikan data dikirim dengan benar.'
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }

    // Validasi data minimal
    if (!formData || (!formData.jenisSurat && !formData.nomorSurat)) {
      Logger.log('Data tidak valid: ' + JSON.stringify(formData));
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Data tidak valid. Pastikan jenisSurat dan nomorSurat diisi.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Simpan data ke spreadsheet
    Logger.log('Menyimpan data ke spreadsheet...');
    const result = saveDataToSheet(formData);
    Logger.log('Result: ' + JSON.stringify(result));

    // Kembalikan response sebagai JSON dengan CORS headers
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });

  } catch (error) {
    Logger.log('Error doPost: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Terjadi kesalahan: ' + error.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
  }
}

/**
 * Fungsi untuk menangani GET request
 * Mendukung: menampilkan UI dan menerima data via parameter (untuk menghindari CORS)
 */
function doGet(e) {
  // Jika ada parameter 'action' = 'getAllData', ambil semua data
  if (e.parameter && e.parameter.action === 'getAllData') {
    try {
      Logger.log('doGet dengan action=getAllData dipanggil');
      const result = getAllData();
      
      // Jika ada callback parameter (JSONP), gunakan JSONP format
      if (e.parameter.callback) {
        const callback = e.parameter.callback;
        return ContentService
          .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
          .setMimeType(ContentService.MimeType.JAVASCRIPT)
          .setHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
      }
      
      // Default: return JSON dengan CORS headers
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    } catch (error) {
      Logger.log('Error doGet getAllData: ' + error.toString());
      const errorResult = {
        success: false,
        message: 'Terjadi kesalahan: ' + error.toString(),
        data: []
      };
      
      // Jika ada callback parameter (JSONP), gunakan JSONP format
      if (e.parameter && e.parameter.callback) {
        const callback = e.parameter.callback;
        return ContentService
          .createTextOutput(callback + '(' + JSON.stringify(errorResult) + ');')
          .setMimeType(ContentService.MimeType.JAVASCRIPT)
          .setHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
      }
      
      return ContentService
        .createTextOutput(JSON.stringify(errorResult))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
  }
  
  // Jika ada parameter 'action' = 'save', simpan data
  if (e.parameter && e.parameter.action === 'save') {
    try {
      Logger.log('doGet dengan action=save dipanggil');
      Logger.log('Number of parameters: ' + Object.keys(e.parameter).length);
      
      // Parse data dari parameter
      const formData = {
        jenisSurat: e.parameter.jenisSurat || '',
        nomorSurat: e.parameter.nomorSurat || '',
        tanggalSurat: e.parameter.tanggalSurat || '',
        tanggalTerimaKirim: e.parameter.tanggalTerimaKirim || null,
        asalTujuan: e.parameter.asalTujuan || '',
        perihal: e.parameter.perihal || '',
        keterangan: e.parameter.keterangan || '',
        fileName: e.parameter.fileName || '',
        fileType: e.parameter.fileType || '',
        fileData: e.parameter.fileData || ''
      };
      
      Logger.log('Data dari parameter diterima');
      Logger.log('Jenis Surat: ' + (formData.jenisSurat || 'kosong'));
      Logger.log('Nomor Surat: ' + (formData.nomorSurat || 'kosong'));
      Logger.log('Tanggal Surat: ' + (formData.tanggalSurat || 'kosong'));
      Logger.log('File Name: ' + (formData.fileName || 'tidak ada'));
      Logger.log('File Type: ' + (formData.fileType || 'tidak ada'));
      Logger.log('File Data Length: ' + (formData.fileData ? formData.fileData.length : 0) + ' characters');
      
      // Cek apakah fileData terpotong (jika panjangnya tidak sesuai)
      if (formData.fileName && formData.fileData) {
        if (formData.fileData.length < 100) {
          Logger.log('WARNING: File data sangat pendek, mungkin terpotong oleh browser');
        }
      }
      
      // Validasi data minimal
      if (!formData.jenisSurat || !formData.nomorSurat || !formData.tanggalSurat) {
        return ContentService
          .createTextOutput(JSON.stringify({
            success: false,
            message: 'Data tidak valid. Pastikan jenisSurat, nomorSurat, dan tanggalSurat diisi.'
          }))
          .setMimeType(ContentService.MimeType.JSON)
          .setHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
      }
      
      // Simpan data ke spreadsheet
      Logger.log('Menyimpan data ke spreadsheet...');
      const result = saveDataToSheet(formData);
      Logger.log('Result: ' + JSON.stringify(result));
      
      // Kembalikan response sebagai JSON dengan CORS headers
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        
    } catch (error) {
      Logger.log('Error doGet save: ' + error.toString());
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: 'Terjadi kesalahan: ' + error.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
  }
  
  // Jika ada parameter 'action' dan 'page', tampilkan UI
  if (e.parameter && e.parameter.page === 'index') {
    return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('Aplikasi Pencatatan Arsip Surat')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  // Jika tidak ada parameter, tampilkan UI default
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Aplikasi Pencatatan Arsip Surat')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Fungsi untuk menyimpan data ke spreadsheet (dipisah untuk digunakan oleh doPost dan saveData)
 */
function saveDataToSheet(formData) {
  try {
    Logger.log('saveDataToSheet dipanggil dengan data: ' + JSON.stringify(formData));
    
    // Validasi data di server-side
    if (!formData.jenisSurat || !formData.nomorSurat || !formData.tanggalSurat) {
      Logger.log('Validasi gagal: Field wajib tidak lengkap');
      return {
        success: false,
        message: 'Mohon lengkapi semua field yang wajib diisi! (jenisSurat, nomorSurat, tanggalSurat)'
      };
    }

    Logger.log('Membuka spreadsheet dengan ID: ' + SPREADSHEET_ID);
    // Buka spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Jika sheet belum ada, buat sheet baru
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Tambahkan header kolom
      sheet.getRange(1, 1, 1, 9).setValues([[
        'Timestamp',
        'Jenis Surat',
        'Nomor Surat',
        'Tanggal Surat',
        'Tanggal Terima/Kirim',
        'Asal/Tujuan Surat',
        'Perihal',
        'Keterangan/Disposisi',
        'File'
      ]]);
      // Format header
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
      sheet.getRange(1, 1, 1, 9).setBackground('#4285f4');
      sheet.getRange(1, 1, 1, 9).setFontColor('#ffffff');
    }

    // Handle file upload jika ada
    let fileUrl = '';
    if (formData.fileName && formData.fileData) {
      try {
        Logger.log('Mengupload file: ' + formData.fileName);
        fileUrl = uploadFileToDrive(formData.fileName, formData.fileType, formData.fileData);
        Logger.log('File berhasil diupload, URL: ' + fileUrl);
      } catch (fileError) {
        Logger.log('Error upload file: ' + fileError.toString());
        // Lanjutkan tanpa file jika error
        fileUrl = 'Error: ' + fileError.toString();
      }
    }

    // Siapkan data untuk disimpan
    const timestamp = new Date();
    const rowData = [
      timestamp,                                    // Timestamp
      formData.jenisSurat,                         // Jenis Surat
      formData.nomorSurat,                         // Nomor Surat
      new Date(formData.tanggalSurat),             // Tanggal Surat
      formData.tanggalTerimaKirim ? new Date(formData.tanggalTerimaKirim) : '', // Tanggal Terima/Kirim
      formData.asalTujuan || '',                    // Asal/Tujuan Surat
      formData.perihal || '',                       // Perihal
      formData.keterangan || '',                    // Keterangan/Disposisi
      fileUrl || ''                                 // File URL
    ];

    Logger.log('Menambahkan data ke sheet...');
    // Tambahkan data ke sheet
    sheet.appendRow(rowData);
    Logger.log('Data berhasil ditambahkan ke baris: ' + sheet.getLastRow());

    // Format baris baru (opsional - untuk membuat tampilan lebih rapi)
    const lastRow = sheet.getLastRow();
    try {
      sheet.getRange(lastRow, 1, 1, 9).setBorder(true, true, true, true, true, true);
      
      // Format kolom tanggal
      sheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd HH:mm:ss');
      sheet.getRange(lastRow, 4).setNumberFormat('yyyy-mm-dd');
      if (formData.tanggalTerimaKirim) {
        sheet.getRange(lastRow, 5).setNumberFormat('yyyy-mm-dd');
      }
      Logger.log('Formatting selesai');
    } catch (formatError) {
      Logger.log('Warning: Error saat formatting (tidak kritis): ' + formatError.toString());
    }

    Logger.log('Data berhasil disimpan dengan sukses!');
    return {
      success: true,
      message: 'Data surat berhasil disimpan!'
    };

  } catch (error) {
    // Tangani error
    Logger.log('Error saveDataToSheet: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    return {
      success: false,
      message: 'Terjadi kesalahan: ' + error.toString() + '. Pastikan SPREADSHEET_ID benar dan Anda memiliki akses ke spreadsheet.'
    };
  }
}

/**
 * Fungsi untuk menyimpan data surat ke Google Spreadsheet
 * Dipanggil dari sisi klien melalui AJAX (untuk kompatibilitas dengan google.script.run)
 * 
 * @param {Object} formData - Data formulir yang dikirim dari klien
 * @return {Object} - Objek dengan status dan pesan
 */
function saveData(formData) {
  return saveDataToSheet(formData);
}

/**
 * Fungsi untuk mendapatkan ID Spreadsheet saat ini
 * Dapat digunakan untuk debugging
 */
function getSpreadsheetId() {
  return SPREADSHEET_ID;
}

/**
 * Fungsi untuk mengupload file ke Google Drive
 * @param {String} fileName - Nama file
 * @param {String} fileType - MIME type file
 * @param {String} base64Data - Data file dalam format base64
 * @return {String} URL file di Google Drive
 */
function uploadFileToDrive(fileName, fileType, base64Data) {
  try {
    Logger.log('uploadFileToDrive dipanggil');
    Logger.log('fileName: ' + fileName);
    Logger.log('fileType: ' + fileType);
    Logger.log('base64Data length: ' + base64Data.length);
    
    // Validasi base64 data
    if (!base64Data || base64Data.length === 0) {
      throw new Error('Base64 data kosong');
    }
    
    // Decode base64 data
    Logger.log('Decoding base64 data...');
    const bytes = Utilities.base64Decode(base64Data);
    Logger.log('Bytes decoded: ' + bytes.length + ' bytes');
    
    // Buat blob
    const blob = Utilities.newBlob(bytes, fileType || 'application/octet-stream', fileName);
    Logger.log('Blob created, size: ' + blob.getBytes().length + ' bytes');
    
    // Tentukan folder tujuan
    let folder;
    if (DRIVE_FOLDER_ID && DRIVE_FOLDER_ID.trim() !== '') {
      try {
        Logger.log('Mencoba membuka folder dengan ID: ' + DRIVE_FOLDER_ID);
        folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
        Logger.log('Folder ditemukan: ' + folder.getName());
      } catch (e) {
        Logger.log('Folder tidak ditemukan, menggunakan root Drive. Error: ' + e.toString());
        folder = DriveApp.getRootFolder();
      }
    } else {
      Logger.log('DRIVE_FOLDER_ID kosong, menggunakan root Drive');
      folder = DriveApp.getRootFolder();
    }
    
    // Upload file ke Drive
    Logger.log('Membuat file di Drive...');
    const file = folder.createFile(blob);
    Logger.log('File berhasil dibuat: ' + file.getName());
    Logger.log('File ID: ' + file.getId());
    
    // Set file bisa diakses oleh siapa saja (opsional, bisa diubah)
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      Logger.log('File sharing di-set ke ANYONE_WITH_LINK');
    } catch (shareError) {
      Logger.log('Warning: Tidak bisa set sharing, lanjutkan: ' + shareError.toString());
    }
    
    // Return URL file
    const fileUrl = file.getUrl();
    Logger.log('File URL: ' + fileUrl);
    return fileUrl;
    
  } catch (error) {
    Logger.log('Error uploadFileToDrive: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    throw error;
  }
}

/**
 * Fungsi untuk mengambil semua data dari spreadsheet
 * @return {Object} - Objek dengan status, message, dan data array
 */
function getAllData() {
  try {
    Logger.log('getAllData dipanggil');
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return {
        success: true,
        message: 'Sheet belum ada, belum ada data',
        data: []
      };
    }
    
    // Ambil semua data (skip header row)
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return {
        success: true,
        message: 'Belum ada data',
        data: []
      };
    }
    
    // Ambil data dari baris 2 sampai terakhir
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 9);
    const values = dataRange.getValues();
    
    // Format data menjadi array of objects
    const data = values.map((row, index) => {
      return {
        rowIndex: index + 2, // +2 karena baris 1 adalah header, dan array index dimulai dari 0
        timestamp: row[0] ? Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss') : '',
        jenisSurat: row[1] || '',
        nomorSurat: row[2] || '',
        tanggalSurat: row[3] ? Utilities.formatDate(new Date(row[3]), Session.getScriptTimeZone(), 'yyyy-MM-dd') : '',
        tanggalTerimaKirim: row[4] ? Utilities.formatDate(new Date(row[4]), Session.getScriptTimeZone(), 'yyyy-MM-dd') : '',
        asalTujuan: row[5] || '',
        perihal: row[6] || '',
        keterangan: row[7] || '',
        fileUrl: row[8] || ''
      };
    });
    
    Logger.log('Data berhasil diambil: ' + data.length + ' baris');
    return {
      success: true,
      message: 'Data berhasil diambil',
      data: data
    };
    
  } catch (error) {
    Logger.log('Error getAllData: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    return {
      success: false,
      message: 'Terjadi kesalahan saat mengambil data: ' + error.toString(),
      data: []
    };
  }
}

/**
 * Fungsi untuk mengupdate data di spreadsheet
 * @param {Number} rowIndex - Nomor baris yang akan diupdate (1-based, termasuk header)
 * @param {Object} formData - Data baru yang akan disimpan
 * @return {Object} - Objek dengan status dan pesan
 */
function updateData(rowIndex, formData) {
  try {
    Logger.log('updateData dipanggil untuk baris: ' + rowIndex);
    Logger.log('Data baru: ' + JSON.stringify(formData));
    
    // Validasi
    if (!formData.jenisSurat || !formData.nomorSurat || !formData.tanggalSurat) {
      return {
        success: false,
        message: 'Mohon lengkapi semua field yang wajib diisi!'
      };
    }
    
    if (!rowIndex || rowIndex < 2) {
      return {
        success: false,
        message: 'Row index tidak valid'
      };
    }
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        message: 'Sheet tidak ditemukan'
      };
    }
    
    // Cek apakah baris ada
    if (rowIndex > sheet.getLastRow()) {
      return {
        success: false,
        message: 'Baris tidak ditemukan'
      };
    }
    
    // Handle file upload jika ada file baru
    let fileUrl = '';
    if (formData.fileName && formData.fileData) {
      try {
        Logger.log('Mengupload file baru: ' + formData.fileName);
        fileUrl = uploadFileToDrive(formData.fileName, formData.fileType, formData.fileData);
        Logger.log('File baru berhasil diupload, URL: ' + fileUrl);
      } catch (fileError) {
        Logger.log('Error upload file baru: ' + fileError.toString());
        // Jika ada file lama, pertahankan
        const oldFileUrl = sheet.getRange(rowIndex, 9).getValue();
        fileUrl = oldFileUrl || '';
      }
    } else {
      // Pertahankan file URL yang lama
      fileUrl = sheet.getRange(rowIndex, 9).getValue() || '';
    }
    
    // Update data di baris yang ditentukan
    const rowData = [
      new Date(), // Update timestamp
      formData.jenisSurat,
      formData.nomorSurat,
      new Date(formData.tanggalSurat),
      formData.tanggalTerimaKirim ? new Date(formData.tanggalTerimaKirim) : '',
      formData.asalTujuan || '',
      formData.perihal || '',
      formData.keterangan || '',
      fileUrl
    ];
    
    sheet.getRange(rowIndex, 1, 1, 9).setValues([rowData]);
    
    // Format ulang
    sheet.getRange(rowIndex, 1).setNumberFormat('yyyy-mm-dd HH:mm:ss');
    sheet.getRange(rowIndex, 4).setNumberFormat('yyyy-mm-dd');
    if (formData.tanggalTerimaKirim) {
      sheet.getRange(rowIndex, 5).setNumberFormat('yyyy-mm-dd');
    }
    
    Logger.log('Data berhasil diupdate di baris: ' + rowIndex);
    return {
      success: true,
      message: 'Data berhasil diupdate!'
    };
    
  } catch (error) {
    Logger.log('Error updateData: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    return {
      success: false,
      message: 'Terjadi kesalahan saat mengupdate data: ' + error.toString()
    };
  }
}

/**
 * Fungsi untuk menghapus data dari spreadsheet
 * @param {Number} rowIndex - Nomor baris yang akan dihapus (1-based, termasuk header)
 * @return {Object} - Objek dengan status dan pesan
 */
function deleteData(rowIndex) {
  try {
    Logger.log('deleteData dipanggil untuk baris: ' + rowIndex);
    
    if (!rowIndex || rowIndex < 2) {
      return {
        success: false,
        message: 'Row index tidak valid'
      };
    }
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        message: 'Sheet tidak ditemukan'
      };
    }
    
    // Cek apakah baris ada
    if (rowIndex > sheet.getLastRow()) {
      return {
        success: false,
        message: 'Baris tidak ditemukan'
      };
    }
    
    // Hapus baris
    sheet.deleteRow(rowIndex);
    
    Logger.log('Data berhasil dihapus dari baris: ' + rowIndex);
    return {
      success: true,
      message: 'Data berhasil dihapus!'
    };
    
  } catch (error) {
    Logger.log('Error deleteData: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    return {
      success: false,
      message: 'Terjadi kesalahan saat menghapus data: ' + error.toString()
    };
  }
}

