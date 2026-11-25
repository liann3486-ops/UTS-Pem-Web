# UTS Pemrograman Web

Aplikasi biodata (CRUD) dengan **Frontend** (HTML, Bootstrap 5, JavaScript) dan **Backend** (Node.js, REST API, data disimpan di file JSON).

## Tim Pengembang
- **Master (Frontend)**: Lian Miranty (NIM: 24010110181)
- **Pegawai (Backend)**: Zalwa Nadia (NIM: 24010110168)

## Struktur
```
UTS-Pem-Web/
├── Frontend/
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   └── assets/img/
│       ├── lian.jpg
│       ├── backend.jpg
│       └── btn-plus.png
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── data/biodata.json
└── README.md
```

## Cara Menjalankan
Pastikan Node.js sudah terpasang, lalu:
```bash
cd Backend
node server.js
```
Buka http://localhost:3000 di browser.

## Endpoint API
| Method | URL | Fungsi |
|---|---|---|
| GET | /api/biodata | Ambil semua biodata |
| GET | /api/biodata/:id | Ambil satu biodata |
| POST | /api/biodata | Tambah biodata |
| PUT | /api/biodata/:id | Ubah biodata |
| DELETE | /api/biodata/:id | Hapus biodata |
