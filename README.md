# E-Service Nanda Computer Karawang

## Deskripsi Proyek
**Nanda Computer** adalah platform web aplikasi layanan servis perangkat komputer, laptop, dan printer yang dirancang untuk mendigitalisasi alur operasional di toko reparasi. Website ini menyediakan sistem manajemen terpadu yang transparan, memungkinkan pelanggan untuk mendaftarkan perangkat secara mandiri secara *online* maupun langsung (*offline*) di toko, serta memantau status perbaikan perangkat secara *real-time* melalui widget pelacakan nota yang interaktif.

---

## Fitur-Fitur Utama
1. **Landing Page Interaktif & Publik:**
   - Halaman utama Menampilkan Profil Layanan Mengenai Nanda Computer
   - Dilengkapi Widget Lacak Status Nota (Quick Tracking) yang transparan, memungkinkan pelanggan umum memantau progres perbaikan perangkat secara real-time hanya dengan memasukkan nomor nota.
2. **Pemisahan Hak Akses & Keamanan (Role-Based Access Control)**
Menerapkan pembatasan autentikasi yang tegas antara Portal Staf Internal (mencakup Admin, Kasir, dan Teknisi) dan Portal Pelanggan / Member demi menjamin keamanan data serta kenyamanan pengalaman pengguna (UX).
3. **Dashboard Kasir & Transaksi:**
   - Menyediakan fitur pencatatan perangkat masuk, pengaturan jenis servis, hingga pencetakan nota awal.
   - Seluruh data transaksi langsung tersinkronisasi secara otomatis menggunakan penyimpanan lokal sisi klien (localStorage).
4. **Dashboard Teknisi & Admin:**
   - Menghadirkan panel kontrol terpusat untuk memantau daftar antrean servis, memperbarui status pengerjaan perangkat oleh teknisi, serta mengelola rekapitulasi data operasional toko secara keseluruhan.
5. **Portal Pelanggan:**
   - Menyediakan ruang khusus bagi member terdaftar untuk meninjau riwayat servis perangkat mereka secara mandiri, transparan, dan terpusat.

---

## Struktur Direktori Proyek
```text
E-ServiceNandaComputer/
│
├── index.html                  # Landing page publik & widget lacak status
├── login-staf.html             # Pintu masuk khusus staf internal (Admin/Kasir/Teknisi)
├── login-pelanggan.html        # Pintu masuk khusus pelanggan / member
├── register.html               # Halaman pendaftaran member baru
├── dashboard-admin.html        # Dashboard kontrol Administrator
├── dashboard-kasir.html        # Dashboard transaksi & pencatatan nota kasir
├── dashboard-teknisi.html      # Dashboard pengerjaan servis teknisi
├── dashboard-pelanggan.html    # Portal riwayat servis pelanggan
│
├── css/                        # Kumpulan file styling modular
│   ├── style.css
│   ├── login-staf.css
│   └── login-pelanggan.css
│
└── js/                         # Kumpulan file logika JavaScript
    ├── landing.js
    ├── login-staf.js
    └── login-pelanggan.js