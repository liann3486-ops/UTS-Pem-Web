// Alamat API Backend
const API = '/api/biodata';

// Data default sesuai template UTS Pem Web ("buat seperti ini.png")
const DEFAULT_DATA = [
  {
    id: 1,
    nama: "Lian Miranty",
    deskripsi: "24010110181 merupakan master dari uts ini dengan tugas membuat front-end dan mengirimkannya ke grup",
    foto: "assets/img/lian.jpg"
  },
  {
    id: 2,
    nama: "Zalwa Nadia",
    deskripsi: "dengan NIM 24010110168 merupakan pegawai dan mempunyai tugas mengerjakan back-end pada UTS ini",
    foto: "assets/img/backend.jpg"
  }
];

let data = [];
let hapusId = null;
let fotoBaru = null;
let backendOnline = false;

const list = document.getElementById('biodataList');
const alertArea = document.getElementById('alertArea');
const modalEl = document.getElementById('biodataModal');
const hapusModalEl = document.getElementById('hapusModal');

const modal = new bootstrap.Modal(modalEl);
const hapusModal = new bootstrap.Modal(hapusModalEl);

function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function notif(pesan, tipe = 'success') {
  alertArea.innerHTML = `
    <div class="alert alert-${tipe} alert-dismissible fade show" role="alert">
      ${pesan}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Tutup"></button>
    </div>`;
}

// Render kartu biodata dan tombol tambah
function render() {
  let html = `
    <!-- KARTU TAMBAH (KIRI) -->
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card bio-card add-card" id="btnTambah" role="button" aria-label="Tambah Biodata">
        <div class="btn-plus-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="#ffffff" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" stroke="#ffffff" stroke-width="1.2"/>
          </svg>
        </div>
      </div>
    </div>`;

  data.forEach((p, idx) => {
    const fotoDefault = idx === 0 ? 'assets/img/lian.jpg' : 'assets/img/backend.jpg';
    const fotoSrc = p.foto || fotoDefault;
    html += `
    <!-- KARTU BIODATA -->
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card bio-card d-flex flex-column">
        <img class="bio-foto" src="${fotoSrc}" alt="Foto ${esc(p.nama)}">
        <div class="card-body d-flex flex-column p-3">
          <h6 class="card-title fw-bold text-dark mb-1">${esc(p.nama)}</h6>
          <p class="card-text text-secondary mb-3" style="font-size: 0.85rem; line-height: 1.4;">${esc(p.deskripsi)}</p>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-outline-primary btn-action" data-edit="${p.id}">Edit</button>
            <button class="btn btn-outline-danger btn-action" data-hapus="${p.id}">Hapus</button>
          </div>
        </div>
      </div>
    </div>`;
  });

  list.innerHTML = html;
}

// Muat data dari Backend atau Fallback Local/Default
async function muatData() {
  try {
    const res = await fetch(API, { cache: 'no-cache' });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        data = json;
        backendOnline = true;
      } else {
        data = DEFAULT_DATA;
      }
    } else {
      throw new Error();
    }
  } catch (e) {
    const local = localStorage.getItem('uts_biodata');
    if (local) {
      try { data = JSON.parse(local); }
      catch (_) { data = DEFAULT_DATA; }
    } else {
      data = DEFAULT_DATA;
    }
    backendOnline = false;
  }
  render();
}

// Buka form modal Tambah/Edit
function bukaForm(p) {
  document.getElementById('modalTitle').textContent = p ? 'Edit Biodata' : 'Tambah Biodata';
  document.getElementById('fId').value = p ? p.id : '';
  document.getElementById('fNama').value = p ? p.nama : '';
  document.getElementById('fDeskripsi').value = p ? p.deskripsi : '';
  document.getElementById('fFoto').value = '';
  fotoBaru = null;

  const prev = document.getElementById('fPreview');
  if (p && p.foto) {
    prev.src = p.foto;
    prev.classList.remove('d-none');
  } else {
    prev.classList.add('d-none');
  }
  modal.show();
}

// Event delegasi klik Tambah / Edit / Hapus
list.addEventListener('click', e => {
  const addBtn = e.target.closest('#btnTambah');
  if (addBtn) return bukaForm(null);

  const editBtn = e.target.closest('[data-edit]');
  if (editBtn) {
    const id = Number(editBtn.dataset.edit);
    const item = data.find(p => p.id === id);
    if (item) bukaForm(item);
    return;
  }

  const hapusBtn = e.target.closest('[data-hapus]');
  if (hapusBtn) {
    hapusId = Number(hapusBtn.dataset.hapus);
    const item = data.find(p => p.id === hapusId);
    if (item) {
      document.getElementById('hapusNama').textContent = item.nama;
      hapusModal.show();
    }
  }
});

// Resize foto input ke base64 jika ada upload foto
document.getElementById('fFoto').addEventListener('change', async e => {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 800 / img.width);
      const c = document.createElement('canvas');
      c.width = img.width * s;
      c.height = img.height * s;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      fotoBaru = c.toDataURL('image/jpeg', 0.85);
      const prev = document.getElementById('fPreview');
      prev.src = fotoBaru;
      prev.classList.remove('d-none');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(f);
});

// Submit Form (Simpan Tambah / Edit)
document.getElementById('biodataForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('fId').value;
  const nama = document.getElementById('fNama').value.trim();
  const deskripsi = document.getElementById('fDeskripsi').value.trim();
  const foto = fotoBaru || (id ? (data.find(x => x.id == id)?.foto || '') : 'assets/img/lian.jpg');

  const payload = { nama, deskripsi, foto };

  if (backendOnline) {
    try {
      const url = id ? `${API}/${id}` : API;
      const method = id ? 'PUT' : 'POST';
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error('Gagal menyimpan ke server');
    } catch (err) {
      console.warn('Backend gagal, menyimpan lokal:', err);
    }
  }

  // Update data state & localStorage
  if (id) {
    const idx = data.findIndex(x => x.id == id);
    if (idx !== -1) data[idx] = { ...data[idx], ...payload };
    notif('Biodata berhasil diperbarui.');
  } else {
    data.push({ id: Date.now(), ...payload });
    notif('Biodata berhasil ditambahkan.');
  }

  localStorage.setItem('uts_biodata', JSON.stringify(data));
  modal.hide();
  render();
});

// Konfirmasi Hapus
document.getElementById('btnKonfirmasiHapus').addEventListener('click', async () => {
  if (!hapusId) return;

  if (backendOnline) {
    try {
      await fetch(`${API}/${hapusId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Backend gagal saat hapus:', err);
    }
  }

  data = data.filter(x => x.id !== hapusId);
  localStorage.setItem('uts_biodata', JSON.stringify(data));
  hapusModal.hide();
  render();
  notif('Biodata berhasil dihapus.');
});

// Jalankan pertama kali
muatData();
