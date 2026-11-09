alter table public.projects
  add column if not exists translations jsonb not null default '{}'::jsonb;

comment on column public.projects.translations is
  'Localized project fields keyed by language code, for example {"id":{"title":"..."}}.';

update public.projects
set translations = translations - 'th'
where translations ? 'th';

update public.projects
set translations = coalesce(translations, '{}'::jsonb) || jsonb_build_object(
  'id', jsonb_build_object(
    'title', 'Sistem Faktur PT Central',
    'description', 'Dasbor internal faktur dan penjualan untuk PT Central Alam Resources Lestari, dibuat oleh tim yang terdiri dari empat developer saat masih bersekolah. Staf keuangan menggunakannya untuk melacak penjualan pengujian laboratorium dan membuat faktur sesuai ketentuan pajak (DPP, PPn, dan Nomor Faktur), lalu menghasilkan PDF faktur yang siap dikirim kepada pelanggan.',
    'role', 'Frontend Developer',
    'challenge', 'Membangun alur faktur yang mengikuti aturan pajak Indonesia sambil menyeimbangkan proyek dengan kegiatan sekolah. Di tengah kelas, tugas, dan ujian, tim harus membagi pekerjaan dengan cermat, berkoordinasi dengan jadwal yang berbeda, dan tetap memenuhi tenggat proyek perusahaan nyata.',
    'highlights', jsonb_build_array(
      'Daftar faktur penjualan dengan filter rentang tanggal dan pencarian',
      'Tampilan penjualan per pelanggan dengan jumlah baris dan total',
      'Pembuatan faktur PDF dengan kop perusahaan dan rincian pajak',
      'Input Nomor Faktur untuk setiap faktur dan fitur ekspor semua data',
      'Pilihan Lab dan Non Lab untuk memisahkan jenis transaksi',
      'Dibangun sebagai proyek tim bersama tiga developer lainnya'
    ),
    'status', 'Selesai'
  )
)
where slug = 'pt-central-invoicing';

update public.projects
set translations = coalesce(translations, '{}'::jsonb) || jsonb_build_object(
  'id', jsonb_build_object(
    'title', 'Toko Fashion',
    'description', 'Toko fashion responsif yang memungkinkan pengunjung melihat produk, menyimpan favorit, mengelola keranjang, dan mencoba checkout demo dengan fitur akun dan dompet.',
    'role', 'Frontend Developer',
    'challenge', 'Membangun alur belanja lengkap (varian produk, keranjang, wishlist, checkout, akun, dan dompet) tanpa database backend, sambil menjaga semua state tetap konsisten dan memungkinkan konten toko diedit dari satu file JSON.',
    'highlights', jsonb_build_array(
      'Katalog produk dengan kategori, pencarian, pengurutan, dan varian',
      'Keranjang, wishlist, dan checkout dengan ongkir serta kode promo',
      'Pendaftaran dan login dengan hashing kata sandi PBKDF2 di browser',
      'Dompet dengan riwayat transaksi, serta riwayat dan detail pesanan',
      'Autocomplete alamat dan deteksi lokasi melalui endpoint serverless',
      'Tema terang dan gelap dengan banner pengumuman yang dapat diedit'
    ),
    'status', 'Selesai'
  )
)
where slug = 'fashion-shop';

update public.projects
set translations = coalesce(translations, '{}'::jsonb) || jsonb_build_object(
  'id', jsonb_build_object(
    'title', 'Sistem Pelaporan LazisMu Muda',
    'description', 'Situs transparansi dan pelaporan untuk LazisMu KL SMK Muda. Situs publik menampilkan donasi, kegiatan, dan laporan keuangan, sementara panel admin lengkap digunakan untuk mengelola seluruh konten.',
    'role', 'Frontend Developer',
    'challenge', 'Membangun situs publik dan dasbor admin yang aman dengan Supabase agar donasi, laporan, dan konten situs dapat dikelola tanpa mengubah kode.',
    'highlights', jsonb_build_array(
      'Situs publik: beranda, tentang, kegiatan, laporan donasi, dan kontak',
      'Kartu ringkasan langsung untuk donasi, penyaluran, kegiatan, dan donatur',
      'Login admin dengan dasbor untuk mengelola seluruh data situs',
      'Konfirmasi donasi, termasuk donasi per kelas dan donasi publik',
      'Kelola kelas, akun, anggota, info kontak, rekening bank, dan media sosial',
      'Kegiatan, slide hero, dan halaman Tentang yang dapat diedit, serta tabel laporan yang dapat dicari'
    ),
    'status', 'Selesai'
  )
)
where slug = 'lazismu-muda';

update public.projects
set translations = coalesce(translations, '{}'::jsonb) || jsonb_build_object(
  'id', jsonb_build_object(
    'title', 'Login & Pendaftaran',
    'description', 'Antarmuka login dan pendaftaran yang dibuat dengan React dan Vite. Proyek ini membantu saya memahami localStorage, termasuk menyimpan data pengguna di browser dan membacanya kembali saat login.',
    'role', 'Frontend Developer',
    'challenge', 'Menjaga pengguna tetap masuk dan menyimpan akun tanpa backend, hanya dengan local storage browser.',
    'highlights', jsonb_build_array(
      'Alur pendaftaran dan login dengan ReactJS',
      'Data pengguna tersimpan di local storage',
      'Halaman login dan pendaftaran yang rapi dan responsif'
    ),
    'status', 'Selesai'
  )
)
where slug = 'login-and-registration';

update public.projects
set translations = coalesce(translations, '{}'::jsonb) || jsonb_build_object(
  'id', jsonb_build_object(
    'title', 'Daftar Tugas (PERN Stack)',
    'description', 'Aplikasi daftar tugas yang dibangun dengan PERN stack (PostgreSQL, Express, React, Node.js). Frontend React berkomunikasi dengan REST API Express yang menyimpan tugas di PostgreSQL. Pengguna dapat menambah, mengedit, menyelesaikan, dan menghapus tugas, dengan data yang tetap tersimpan antar sesi. Dibuat untuk mempelajari backend dan operasi CRUD.',
    'role', 'Full Stack Developer',
    'challenge', 'Membangun aplikasi daftar tugas agar setiap tindakan (tambah, edit, selesaikan, hapus) tersimpan di PostgreSQL melalui API Express, sekaligus menjaga antarmuka React tetap sinkron dengan data tersimpan.',
    'highlights', jsonb_build_array(
      'Menambah, mengedit, dan menghapus tugas',
      'Menandai tugas selesai atau belum selesai',
      'Penyimpanan data dengan PostgreSQL',
      'Pintasan keyboard: klik dua kali untuk mengubah status, Esc untuk keluar dari edit'
    ),
    'status', 'Selesai'
  )
)
where slug = 'todo-list';

update public.projects
set translations = coalesce(translations, '{}'::jsonb) || jsonb_build_object(
  'id', jsonb_build_object(
    'title', 'Tes Mengetik',
    'description', 'Aplikasi latihan mengetik yang ringan dan dapat disesuaikan, dibuat dengan React dan Tailwind CSS. Aplikasi menampilkan kata saat Anda mengetik dan melacak WPM, CPM, serta akurasi setiap sesi. Anda dapat mengganti tema dan memilih jumlah kata.',
    'role', 'Frontend Developer',
    'challenge', 'Menampilkan kata secara real time dan menghitung WPM, CPM, serta akurasi saat pengguna mengetik.',
    'highlights', jsonb_build_array(
      'Latihan mengetik kata demi kata secara real time',
      'Statistik sesi: WPM, CPM, dan akurasi',
      'Pilihan tema',
      'Jumlah kata yang dapat disesuaikan untuk setiap sesi'
    ),
    'status', 'Selesai'
  )
)
where slug = 'typing-test';

update public.projects
set translations = coalesce(translations, '{}'::jsonb) || jsonb_build_object(
  'id', jsonb_build_object(
    'title', 'Kalkulator Casio',
    'description', 'Kalkulator responsif yang dibuat sebagai proyek pembelajaran untuk berlatih Next.js, React, TypeScript, dan Tailwind CSS. Memiliki tampilan bergaya digital dan mendukung perhitungan persentase, pajak, serta markup.',
    'role', 'Frontend Developer',
    'challenge', 'Menulis parser ekspresi yang menangani prioritas operator, persentase, dan input tidak valid, seluruhnya di browser tanpa server atau database.',
    'highlights', jsonb_build_array(
      'Parser ekspresi dengan prioritas operator dan persentase',
      'Perhitungan pajak dan markup',
      'Tata letak responsif dengan Tailwind CSS',
      'Font tampilan digital dimuat dengan next/font'
    ),
    'status', 'Selesai'
  )
)
where slug = 'casio-calculator';
