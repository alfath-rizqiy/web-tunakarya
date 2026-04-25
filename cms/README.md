# Tunakarya CMS

CMS ini menggunakan Decap CMS (sebelumnya Netlify CMS) untuk mengelola konten website Tunakarya.

## Fitur

- **Struktur Organisasi**: Kelola anggota organisasi dengan foto, nama, dan role
- **Purna Karya**: Kelola alumni/purna karya dengan profil, angkatan, dan quotes
- **Program**: Kelola program-program organisasi

## Setup Netlify Identity

1. Deploy folder `cms` ke Netlify
2. Aktifkan **Identity** di dashboard Netlify
3. Aktifkan **Git Gateway** di Settings > Identity > Services
4. Tambahkan admin user di Identity > Invites
5. Akses CMS di `https://your-site.netlify.app/admin/`

## Struktur Folder

```
cms/
├── index.html      # Entry point CMS
├── config.yml      # Konfigurasi Decap CMS
└── README.md       # Dokumentasi ini

content/
├── struktur/       # Data struktur organisasi
├── purna/          # Data purna karya
├── program/        # Data program
├── settings/       # Pengaturan site
└── uploads/        # Folder upload gambar
```

## Cara Penggunaan

1. Buka URL CMS yang sudah di-deploy
2. Login dengan akun yang sudah di-invite
3. Pilih koleksi yang ingin dikelola (Struktur/Purna/Program)
4. Tambah, edit, atau hapus konten
5. Publish perubahan

## Integrasi dengan Frontend

Frontend web-tunakarya membaca data dari folder `content/` yang berisi file markdown dengan frontmatter. Pastikan folder `content` di-commit ke repository yang sama dengan frontend agar bisa dibaca.
