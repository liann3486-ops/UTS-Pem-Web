// Backend UTS Pem Web - tanpa library tambahan (hanya bawaan Node.js)
// Jalankan: node server.js  ->  http://localhost:3000
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'biodata.json');
const FRONTEND_DIR = path.join(__dirname, '..', 'Frontend');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch (e) { return []; }
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function sendJSON(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => {
      raw += c;
      if (raw.length > 10 * 1024 * 1024) { reject(new Error('Body terlalu besar')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { reject(new Error('JSON tidak valid')); }
    });
  });
}

function validasi(b) {
  const nama = (b.nama || '').toString().trim();
  const deskripsi = (b.deskripsi || '').toString().trim();
  if (!nama || !deskripsi) return null;
  return { nama, deskripsi, foto: (b.foto || '').toString() };
}

async function handleApi(req, res, url) {
  const m = url.pathname.match(/^\/api\/biodata(?:\/(\d+))?$/);
  if (!m) return sendJSON(res, 404, { pesan: 'Endpoint tidak ditemukan' });
  const id = m[1] ? Number(m[1]) : null;
  let data = readData();

  try {
    if (req.method === 'GET' && id === null) return sendJSON(res, 200, data);

    if (req.method === 'GET') {
      const p = data.find(x => x.id === id);
      return p ? sendJSON(res, 200, p) : sendJSON(res, 404, { pesan: 'Biodata tidak ditemukan' });
    }

    if (req.method === 'POST' && id === null) {
      const v = validasi(await readBody(req));
      if (!v) return sendJSON(res, 400, { pesan: 'Nama dan deskripsi wajib diisi' });
      const baru = { id: Date.now(), ...v };
      data.push(baru);
      writeData(data);
      return sendJSON(res, 201, baru);
    }

    if (req.method === 'PUT' && id !== null) {
      const idx = data.findIndex(x => x.id === id);
      if (idx === -1) return sendJSON(res, 404, { pesan: 'Biodata tidak ditemukan' });
      const body = await readBody(req);
      const v = validasi(body);
      if (!v) return sendJSON(res, 400, { pesan: 'Nama dan deskripsi wajib diisi' });
      // jika tidak kirim foto baru, pertahankan foto lama
      if (!body.foto) v.foto = data[idx].foto;
      data[idx] = { id, ...v };
      writeData(data);
      return sendJSON(res, 200, data[idx]);
    }

    if (req.method === 'DELETE' && id !== null) {
      const idx = data.findIndex(x => x.id === id);
      if (idx === -1) return sendJSON(res, 404, { pesan: 'Biodata tidak ditemukan' });
      data.splice(idx, 1);
      writeData(data);
      return sendJSON(res, 200, { pesan: 'Biodata berhasil dihapus' });
    }

    return sendJSON(res, 405, { pesan: 'Method tidak diizinkan' });
  } catch (e) {
    return sendJSON(res, 400, { pesan: e.message });
  }
}

function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  const file = path.normalize(path.join(FRONTEND_DIR, rel));
  if (!file.startsWith(FRONTEND_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, content) => {
    if (err) { res.writeHead(404); return res.end('404 Not Found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(content);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url);
  serveStatic(req, res, url);
}).listen(PORT, () => {
  console.log('Server jalan di http://localhost:' + PORT);
});
