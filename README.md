# ArilCode — Arsip PDF Kelompok

Website arsip dokumen PDF untuk tugas kelompok sekolah. Dilengkapi sistem akses, tema dark/light, dan tampilan responsive.

**Dibuat oleh:** Arill  
**Versi:** v7  
**Tanggal:** 04 September 2026

---

# 📁 STRUKTUR FILE
arilcode-pdf-archive/
### Halaman utama + Lock Screen
├── http://index.html        
### Styling, Tema, Responsive  
├── http://style.css     
### Logic: Auth, Theme, Navigasi
├── http://main.js       
### Dokumentasi ini
├── http://README.md      
### Folder penyimpanan PDF
├── /Pdf/                       
│   ├── http://PPTKelompok1.pdf      
│   ├── http://PPTKelompok2.pdf      
│   ├── http://PPTKelompok3.pdf       
│   ├── http://PPTKelompok4.pdf      
└   └── http://PPTKelompok5.pdf
# Folder gambar
└── /Image/                     
└    └── http://favicon.png


---

## 🔐 SISTEM KEAMANAN AKSES

Website menggunakan sistem lock screen. Konten hanya bisa diakses dengan kode yang valid.

### Jenis Kode Akses
| Kode | Tipe | Cara Kerja | Penyimpanan |
| --- | --- | --- | --- |
| **CODE 1** | Permanent | Buka selamanya di device itu | `localStorage.access_perm = true` |
| **CODE 2** | Burn / 1x Pakai | Hanya bisa dipakai 1 kali per device | `localStorage.used_codes[]` + `sessionStorage.burn_session` |
| **CODE 3** | Session | Buka sampai halaman di-refresh | Tidak disimpan |

> **Catatan Keamanan:** Kode disimpan dalam bentuk SHA-256 Hash di `main.js`. Tidak disimpan sebagai text biasa.

---

## ✨ FITUR UTAMA

### 1. Authentication
- Lock Screen full screen
- Validasi input tidak boleh kosong
- Pesan error otomatis hilang
- Toggle lihat/sembunyikan password

### 2. Theme Manager
- 2 Tema: Dark & Light
- Pilihan tersimpan otomatis
- Transisi warna smooth 1.5 detik
- Tombol toggle dengan ikon SVG

### 3. Document Library  
- 5 Card dokumen kelompok
- Validasi link PDF sebelum download
- Avatar anggota kelompok dengan tooltip nama
- 1 Card khusus ada tombol "Tampilkan" untuk link presentasi

### 4. UI/UX
- Navbar Sticky + Glassmorphism
- Hero Section dengan background blur
- Smooth Scroll ke setiap section
- Popup Modal untuk notifikasi
- Scroll di-lock saat popup/masuk

### 5. Responsive
- Desktop, Tablet, Mobile
- Grid otomatis menyesuaikan
- Navbar jadi fixed di layar < 720px

---

## 🚀 CARA PENGGUNAAN

1.  Buka file `index.html`
2.  Masukkan Kode Akses pada kolom yang tersedia
3.  Klik "Buka Sekarang" atau tekan `Enter`
4.  Setelah masuk, pilih dokumen pada bagian "Unduhan Dokumen"

---

## 🛠️ PANDUAN UNTUK ADMIN

#### Mengganti Kode Akses
1. Buka file `main.js`
2. Cari variabel `CODE1_PERMANENT`, `CODE2_BURN`, `CODE3_RESET`
3. Ganti dengan hash SHA-256 yang baru

#### Reset Akses di Browser
- **Reset Semua:** Hapus `localStorage` dan `sessionStorage` di DevTools
- **Reset Kode Burn:** `localStorage.removeItem("used_codes")`
- **Reset Tema:** `localStorage.removeItem("site-theme")`

#### Menambah Dokumen Baru
Copy dan paste 1 blok `<article class="card">` di dalam `div.cards` pada `index.html`.  
Jangan lupa ganti link PDF dan nama anggota di `.member-avatars`

---

## 💻 TEKNOLOGI
- HTML5 Semantic
- CSS3 Custom Properties + Grid + Flexbox
- JavaScript ES6+ : `crypto.subtle.digest`, `fetch`, `localStorage`
- External: Google Fonts, Font Awesome 6.5.1

---

## 📞 BANTUAN
Jika ada kendala akses silakan hubungi: **Arill**  
Link: https://my-all-link.vercel.app/

---
© 2026 ArilCode. Untuk keperluan internal sekolah.
