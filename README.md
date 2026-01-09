# SIG Desa Jambu - Sistem Informasi Geografis

Website Sistem Informasi Geografis (SIG) untuk Desa Jambu menggunakan HTML, CSS, JavaScript, dan Leaflet.js.


## Cara Menggunakan

### 1. Buka Landing Page
- Buka file `index.html` di browser
- Landing page akan menampilkan background video dan tombol "Mulai"

### 2. Login Admin
- Klik tombol "Login Admin" di navbar
- Username: `admin`
- Password: `admin123`

### 3. Menggunakan Aplikasi

#### Peta Interaktif
- Peta akan menampilkan marker berdasarkan data yang tersedia
- Setiap tipe data memiliki warna marker yang berbeda:
  - 🔵 Biru: Pendidikan
  - 🟢 Hijau: Tempat Ibadah
  - 🔴 Merah: Kesehatan

#### Layer Informasi
- Gunakan checkbox di sidebar untuk menampilkan/menyembunyikan layer tertentu
- Setiap layer dapat dikontrol secara independen


#### Manajemen Data
- Klik tombol "Tambah Data" untuk menambah data baru
- Klik "Edit" pada tabel untuk mengedit data
- Klik "Hapus" untuk menghapus data
- Gunakan filter untuk melihat data berdasarkan tipe

#### Dashboard Statistik
- Lihat statistik total penduduk, lahan, dan fasilitas
- Grafik batang menampilkan distribusi data

#### Export Laporan
- Pilih format export yang diinginkan
- Data akan diunduh dalam format yang dipilih

## Teknologi yang Digunakan

- **HTML5** - Struktur halaman
- **CSS3** - Styling dan layout
- **JavaScript (ES6+)** - Logika aplikasi
- **Leaflet.js** - Library peta interaktif
- **Chart.js** - Visualisasi data statistik
- **Font Awesome** - Icons

## Kredensial Login

- **Username:** admin
- **Password:** admin123

## Catatan

- Data disimpan di localStorage browser (untuk demo)
- Dalam produksi, gunakan backend dan database untuk menyimpan data
- Video background menggunakan sample video, ganti dengan video desa yang sesuai
- Koordinat default menggunakan contoh koordinat, sesuaikan dengan koordinat Desa Jambu yang sebenarnya

## Browser Support

Aplikasi ini kompatibel dengan browser modern:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Pengembangan Lebih Lanjut

Untuk pengembangan lebih lanjut, pertimbangkan:
- Integrasi dengan backend API
- Database untuk penyimpanan data
- Autentikasi yang lebih aman
- Upload gambar untuk setiap data
- Fitur drawing polygon/line yang lebih lengkap
- Integrasi dengan GPS untuk input koordinat otomatis

## Lisensi

Proyek ini dibuat untuk keperluan SIG Desa Jambu.

