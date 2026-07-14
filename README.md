# Absen Ustadz — SPM Roudlotut Thullab

Aplikasi absensi guru berbasis web dengan kalender Hijriyah.

## 🚀 Deploy ke GitHub + Cloudflare Pages

### 1. Upload ke GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git branch -M main
git push -u origin main
```

### 2. Deploy ke Cloudflare Pages
1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Masuk ke **Workers & Pages** → **Pages** → **Connect to Git**
3. Pilih repository GitHub Anda
4. **Build settings:**
   - **Build command:** (kosongkan — ini static site)
   - **Build output:** (kosongkan)
   - **Root directory:** (biarkan default)
5. Klik **Deploy**

Selesai! Aplikasi langsung bisa diakses via URL Cloudflare Pages.

### 3. (Opsional) Aktifkan Cloud Database

Data bisa disimpan di cloud agar semua pengguna melihat data yang SAMA.

#### Langkah:
1. Buka https://script.google.com, buat project baru
2. Copy paste isi file `Code.gs` ke editor
3. Deploy → **New Deployment** → **Web App**
   - **Execute as:** Me
   - **Access:** Anyone
4. Copy URL deployment (contoh: `https://script.google.com/macros/s/abcdef/exec`)
5. Buka aplikasi, login admin → **Kelola Data** → **Set Google Sheets URL**
6. Paste URL, reload halaman

> 💡 **Tips:** Buat Google Sheet kosong baru sebelum deploy Code.gs.
> Apps Script akan otomatis membuat sheet-sheet yang diperlukan.

## 📁 Struktur File
```
absensi-guru/
├── absensi Ustadz.html   # Aplikasi utama
├── Code.gs               # Backend Google Apps Script (untuk cloud sync)
├── logo.png              # Logo default
├── _redirects            # Konfigurasi Cloudflare Pages
└── README.md             # Dokumentasi ini
```

## 🔧 Fitur
- ✅ Absensi harian dengan 7 jam pelajaran
- ✅ Kalender Hijriyah
- ✅ Input checkbox (ceklis) — sederhana & cepat
- ✅ Admin panel (password-protected)
- ✅ Kelola data guru (tambah, edit, hapus, import Excel/CSV)
- ✅ Rekap bulanan + export CSV & Excel
- ✅ Backup/restore JSON
- ✅ Google Sheets cloud sync (opsional)
- ✅ Warna jam: Sorogan (kuning), Madrasah (biru), Musyawaroh (putih)
- ✅ Edit header, logo, label jam

## 🔐 Admin
- **Password default:** `Absen Ustadz`
- Bisa diubah di menu kelola data.
