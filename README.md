# UTS Pemrograman Web

Aplikasi biodata (CRUD) dengan **Frontend** (HTML, Bootstrap 5, JavaScript) dan **Backend** (Node.js, REST API, data disimpan di file JSON).

## Struktur
```
UTS-Pem-Web/
├── Frontend/
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   └── assets/img/
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── data/biodata.json
└── README.md  
```

## Cara menjalankan
Pastikan Node.js sudah terpasang, lalu:
```
cd Backend
node server.js
```
Buka http://localhost:3000 di browser (perlu internet untuk Bootstrap CDN).

## Endpoint API
| Method | URL | Fungsi |
|---|---|---|
| GET | /api/biodata | Ambil semua biodata |
| GET | /api/biodata/:id | Ambil satu biodata |
| POST | /api/biodata | Tambah biodata |
| PUT | /api/biodata/:id | Ubah biodata |
| DELETE | /api/biodata/:id | Hapus biodata |
