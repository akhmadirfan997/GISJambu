// Admin page JS: auth check, map, CRUD for titik
let adminMap;
let adminLayers = { pendidikan: L.layerGroup(), tempatibadah: L.layerGroup(), kesehatan: L.layerGroup() };
let adminMarkers = {};

function loadAdminData() {
    const raw = localStorage.getItem('sigDesaJambuData');
    if (!raw) return [];
    try { return JSON.parse(raw); } catch (e) { return []; }
}

function saveAdminData(data) {
    localStorage.setItem('sigDesaJambuData', JSON.stringify(data));
}

function checkAuth() {
    if (localStorage.getItem('sigDesaAdminLoggedIn') !== 'true') {
        alert('Anda harus login sebagai admin terlebih dahulu');
        window.location.href = 'app.html';
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;

    // init map
    adminMap = L.map('mapAdmin').setView([-6.51, 110.68], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(adminMap);
    Object.values(adminLayers).forEach(l => l.addTo(adminMap));

    // form elements
    const fNama = document.getElementById('fieldNama');
    const fTipe = document.getElementById('fieldTipe');
    const fDes = document.getElementById('fieldDeskripsi');
    const fLat = document.getElementById('fieldLat');
    const fLng = document.getElementById('fieldLng');
    const btnSave = document.getElementById('btnSave');
    const btnCancel = document.getElementById('btnCancel');
    const listContainer = document.getElementById('listContainer');

    let data = loadAdminData();
    let editId = null;

    function getIcon(tipe) {
        const colors = { pendidikan: '#3498db', tempatibadah: '#3ac072ff', kesehatan: '#e74c3c' };
        return L.divIcon({ className: 'custom-marker', html: `<div style="background:${colors[tipe]}; width:20px; height:20px; border-radius:50%; border:3px solid white"></div>`, iconSize:[20,20], iconAnchor:[10,10] });
    }

    function renderMarkers() {
        // clear layers
        Object.values(adminLayers).forEach(l => l.clearLayers());
        adminMarkers = {};
        data.forEach(item => {
            const m = L.marker([item.lat, item.lng], { icon: getIcon(item.tipe) }).addTo(adminLayers[item.tipe]);
            m.bindPopup(`<strong>${item.nama}</strong><br>${item.deskripsi}`);
            adminMarkers[item.id] = m;
        });
    }

    function renderList() {
        listContainer.innerHTML = '';
        if (!data || data.length === 0) {
            listContainer.innerHTML = '<p style="color:#666">Belum ada data.</p>';
            return;
        }
        data.slice().reverse().forEach(item => {
            const div = document.createElement('div');
            div.className = 'list-item';
            const meta = document.createElement('div'); meta.className = 'meta';
            meta.innerHTML = `<strong>${item.nama}</strong><br><small>${item.tipe} — ${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}</small>`;
            const actions = document.createElement('div');
            const btnEdit = document.createElement('button'); btnEdit.className='btn btn-ghost'; btnEdit.textContent='Edit';
            const btnDel = document.createElement('button'); btnDel.className='btn btn-danger'; btnDel.textContent='Hapus';
            const btnZoom = document.createElement('button'); btnZoom.className='btn'; btnZoom.textContent='⤢';

            btnEdit.addEventListener('click', () => {
                editId = item.id;
                fNama.value = item.nama;
                fTipe.value = item.tipe;
                fDes.value = item.deskripsi || '';
                fLat.value = item.lat;
                fLng.value = item.lng;
                window.scrollTo({ top:0, behavior:'smooth' });
            });

            btnDel.addEventListener('click', () => {
                if (!confirm('Hapus titik ini?')) return;
                data = data.filter(d => d.id !== item.id);
                saveAdminData(data);
                renderMarkers(); renderList();
            });

            btnZoom.addEventListener('click', () => {
                adminMap.setView([item.lat, item.lng], 17);
                if (adminMarkers[item.id]) adminMarkers[item.id].openPopup();
            });

            actions.appendChild(btnZoom);
            actions.appendChild(btnEdit);
            actions.appendChild(btnDel);
            div.appendChild(meta); div.appendChild(actions);
            listContainer.appendChild(div);
        });
    }

    // map click to fill coords
    adminMap.on('click', function(e) {
        fLat.value = e.latlng.lat.toFixed(6);
        fLng.value = e.latlng.lng.toFixed(6);
    });

    btnSave.addEventListener('click', () => {
        const nama = fNama.value && fNama.value.trim();
        const tipe = fTipe.value;
        const des = fDes.value && fDes.value.trim();
        const lat = parseFloat(fLat.value);
        const lng = parseFloat(fLng.value);
        if (!nama || !tipe || isNaN(lat) || isNaN(lng)) { alert('Lengkapi nama, tipe, dan koordinat'); return; }

        if (editId) {
            // update
            data = data.map(d => { if (d.id === editId) return { ...d, nama, tipe, deskripsi: des, lat, lng }; return d; });
            editId = null;
        } else {
            const maxId = data.reduce((mx, cur) => Math.max(mx, (cur.id || 0)), 0);
            const newItem = { id: maxId + 1, nama, tipe, deskripsi: des, lat, lng };
            data.push(newItem);
        }

        saveAdminData(data);
        renderMarkers(); renderList();
        // reset form
        fNama.value=''; fDes.value=''; fLat.value=''; fLng.value='';
    });

    btnCancel.addEventListener('click', () => {
        editId = null; fNama.value=''; fDes.value=''; fLat.value=''; fLng.value='';
    });

    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('sigDesaAdminLoggedIn');
        alert('Anda telah logout');
        window.location.href = 'app.html';
    });

    // initial render
    renderMarkers(); renderList();
});
