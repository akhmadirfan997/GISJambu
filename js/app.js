// Initialize Map
let map;
let markers = [];
let batasDesaLayer = null;
let layers = {
    pendidikan: L.layerGroup(),
    tempatibadah: L.layerGroup(),
    kesehatan: L.layerGroup()
};

// Sample data (dalam produksi, ini harus dari database/API)
const defaultData = [
    { id: 1, nama: 'SDN 2 Jambu', tipe: 'pendidikan', lat: -6.52449, lng: 110.70646, deskripsi: 'Sekolah Dasar Negeri ' },
    { id: 2, nama: 'SDN 4 Jambu', tipe: 'pendidikan', lat: -6.52711, lng: 110.70703, deskripsi: 'Sekolah Dasar Negeri ' },
    { id: 3, nama: 'SDN 6 Jambu', tipe: 'pendidikan', lat: -6.52302, lng: 110.69785, deskripsi: 'Sekolah Dasar Negeri ' },
    { id: 4, nama: 'SDN 9 Jambu', tipe: 'pendidikan', lat: -6.52599, lng: 110.69192, deskripsi: 'Sekolah Dasar Negeri ' },
    { id: 5, nama: 'SDN 11 Jambu', tipe: 'pendidikan', lat: -6.51999, lng: 110.69839, deskripsi: 'Sekolah Dasar Negeri ' },
    { id: 6, nama: 'MI Mathalibul Huda', tipe: 'pendidikan', lat: -6.52875, lng: 110.70224, deskripsi: 'Madrasah Ibtidaiyah ' },
    { id: 7, nama: 'MTs Mathalibul Huda', tipe: 'pendidikan', lat: -6.52828, lng: 110.70467, deskripsi: 'Madrasah Tsanawiyah ' },
    { id: 8, nama: 'MA Mathalibul Huda', tipe: 'pendidikan', lat: -6.52792, lng: 110.70505, deskripsi: 'Madrasah Aliyah ' },
    { id: 9, nama: 'Mushola Al Istiqomah', tipe: 'tempatibadah', lat: -6.52826, lng: 110.69964, deskripsi: 'Mushola' },
    { id: 10, nama: 'Mushola Darussalam', tipe: 'tempatibadah', lat: -6.52953, lng: 110.69837, deskripsi: 'Mushola' },
    { id: 11, nama: 'Mushola Nurul Huda', tipe: 'tempatibadah', lat: -6.53041, lng: 110.70121, deskripsi: 'Mushola' },
    { id: 12, nama: 'Mushola Baitul Muttaqin', tipe: 'tempatibadah', lat: -6.52623, lng: 110.71423, deskripsi: 'Mushola' },
    { id: 13, nama: 'Mushola Darussalam', tipe: 'tempatibadah', lat: -6.52167, lng: 110.69904, deskripsi: 'Mushola' },
    { id: 14, nama: 'Mushola Darus Surur', tipe: 'tempatibadah', lat: -6.52673, lng: 110.68222, deskripsi: 'Mushola' },
    { id: 15, nama: 'Mushola As-shadiqin', tipe: 'tempatibadah', lat: -6.52381, lng: 110.70021, deskripsi: 'Mushola' },
    { id: 15, nama: 'Mushola Nurul Hadi', tipe: 'tempatibadah', lat: -6.52571, lng: 110.70167, deskripsi: 'Mushola' },
    { id: 16, nama: 'Masjid Al Hidayah Assyubakir', tipe: 'tempatibadah', lat: -6.52533, lng: 110.69040, deskripsi: 'Masjid' },
    { id: 17, nama: 'Masjid Besar Baiturrohman Mlonggo', tipe: 'tempatibadah', lat: -6.52883, lng: 110.70250, deskripsi: 'Masjid' },
    { id: 18, nama: 'Masjid Jami', tipe: 'tempatibadah', lat: -6.52724, lng: 110.70818, deskripsi: 'Masjid' },
    { id: 19, nama: 'Masjid Baiturrohman 2', tipe: 'tempatibadah', lat: -6.52657, lng: 110.71289, deskripsi: 'Masjid' },
    { id: 20, nama: 'Masjid Baitul Muttaqin', tipe: 'tempatibadah', lat: -6.52344, lng: 110.69781, deskripsi: 'Masjid' },
    { id: 21, nama: 'RSU Ashavin', tipe: 'kesehatan', lat: -6.52931, lng: 110.70013, deskripsi: 'Rumah Sakit Umum' },
    { id: 22, nama: 'Praktik drg. Rizkia Febri', tipe: 'kesehatan', lat: -6.52969, lng: 110.70031, deskripsi: 'Klinik Gigi' },
    { id: 23, nama: 'Poliklinik Kesehatan Desa ', tipe: 'kesehatan', lat: -6.52049, lng: 110.69874, deskripsi: 'Pusat Kesehatan Masyarakat' },
    { id: 24, nama: 'GKMI Mlonggo', tipe: 'tempatibadah', lat: -6.52896, lng: 110.70112, deskripsi: 'Gereja' },
];

// Load data from localStorage or use default
let dataStore = loadDataFromStorage();

// If no saved data exists in localStorage, persist the defaultData
// so other pages (admin) see the same dataset.
if (!localStorage.getItem('sigDesaJambuData')) {
    saveDataToStorage();
}

// Ensure all items have unique integer IDs. If duplicates or invalid IDs
// are found, reassign sequential IDs and persist the corrected dataset.
function ensureUniqueIds(arr) {
    const seen = new Set();
    let nextId = 1;
    let changed = false;

    for (const item of arr) {
        if (!Number.isInteger(item.id) || seen.has(item.id)) {
            // find next unused id
            while (seen.has(nextId)) nextId++;
            item.id = nextId;
            seen.add(nextId);
            nextId++;
            changed = true;
        } else {
            seen.add(item.id);
            if (item.id >= nextId) nextId = item.id + 1;
        }
    }

    return { arr, changed };
}

// Normalize IDs on load (fix duplicates like duplicate id:15)
const normalized = ensureUniqueIds(dataStore);
if (normalized.changed) {
    dataStore = normalized.arr;
    saveDataToStorage();
    console.log('Duplicate/invalid IDs detected — IDs normalized and saved to localStorage.');
}

function loadDataFromStorage() {
    const saved = localStorage.getItem('sigDesaJambuData');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            // If stored data is corrupted, restore defaultData to localStorage
            try {
                localStorage.setItem('sigDesaJambuData', JSON.stringify(defaultData));
            } catch (err) {
                console.error('Gagal menulis defaultData ke localStorage:', err);
            }
            return defaultData;
        }
    }
    return defaultData;
}

function saveDataToStorage() {
    localStorage.setItem('sigDesaJambuData', JSON.stringify(dataStore));
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    
    // Wait for map to be ready before loading data
    map.whenReady(() => {
        initNavigation();
        initLayerControls();
        initDashboard();
        loadBatasDesa();
        loadDataToMap();
        updateDashboard();
    });
});

// Initialize Leaflet Map
function initMap() {
    // Center pada koordinat Desa Jambu (dari GeoJSON: sekitar -6.51, 110.68)
    map = L.map('map').setView([-6.51, 110.68], 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add layer groups to map
    Object.values(layers).forEach(layer => {
        layer.addTo(map);
    });
}

// Load Batas Desa from GeoJSON
function loadBatasDesa() {
    // Ensure map is initialized
    if (!map) {
        console.error('Map belum diinisialisasi');
        setTimeout(loadBatasDesa, 100);
        return;
    }
    
    // Check if running from file:// protocol (not recommended)
    if (window.location.protocol === 'file:') {
        console.error('⚠️ PERINGATAN: Aplikasi dibuka dari file system (file://)');
        console.error('Browser memblokir akses file karena CORS policy.');
        console.error('Solusi: Buka aplikasi melalui web server Laragon');
        console.error('URL yang benar: http://localhost/GISIPAN/app.html');
        alert('⚠️ PERINGATAN!\n\nAplikasi harus dibuka melalui web server, bukan langsung dari file system.\n\nBuka melalui: http://localhost/GISIPAN/app.html\n\nPastikan Laragon web server sudah running!');
        return;
    }
    
    // Try multiple possible file names
    const possibleFiles = [
        'batas-desa.geojson',
        './batas-desa.geojson',
        'batas desa.geojson'
    ];
    
    let fileIndex = 0;
    
    function tryLoadFile() {
        if (fileIndex >= possibleFiles.length) {
            console.error('Error: File batas desa tidak ditemukan setelah mencoba semua kemungkinan');
            console.warn('Pastikan file "batas-desa.geojson" ada di folder root project');
            return;
        }
        
        const fileName = possibleFiles[fileIndex];
        console.log(`Mencoba memuat: ${fileName}`);
        
        fetch(fileName)
            .then(response => {
                console.log(`Response status untuk ${fileName}:`, response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('GeoJSON data diterima:', data);
                
                // Validate GeoJSON structure
                if (!data || !data.type) {
                    throw new Error('Invalid GeoJSON: missing type');
                }
                
                if (data.type !== 'FeatureCollection') {
                    throw new Error(`Invalid GeoJSON type: ${data.type}, expected FeatureCollection`);
                }
                
                if (!data.features || data.features.length === 0) {
                    throw new Error('GeoJSON tidak memiliki features');
                }
                
                console.log(`GeoJSON memiliki ${data.features.length} feature(s)`);
                
                // Create GeoJSON layer with styling
                batasDesaLayer = L.geoJSON(data, {
                    style: {
                        color: '#ff2800',
                        weight: 3,
                        opacity: 0.8,
                        fillColor: '#fffa00',
                        fillOpacity: 0.2
                    },
                    onEachFeature: function(feature, layer) {
                        // Add popup with information
                        if (feature.properties) {
                            const props = feature.properties;
                            const luas = props.SHAPE_Area ? (props.SHAPE_Area * 111 * 111).toFixed(2) + ' km²' : '-';
                            const popupContent = `
                                <div style="min-width: 200px;">
                                    <strong>${props.NAMOBJ || 'Desa Jambu'}</strong><br>
                                    Kecamatan: ${props.WADMKC || '-'}<br>
                                    Kabupaten: ${props.WADMKK || '-'}<br>
                                    Provinsi: ${props.WADMPR || '-'}<br>
                                    Luas: ${luas}
                                </div>
                            `;
                            layer.bindPopup(popupContent);
                        }
                    }
                });
                
                // Add to map by default
                if (batasDesaLayer) {
                    // Check if checkbox is checked before adding
                    const checkbox = document.getElementById('layerBatasDesa');
                    const shouldShow = checkbox ? checkbox.checked : true;
                    
                    if (shouldShow) {
                        // Check if layer is already on map
                        if (!map.hasLayer(batasDesaLayer)) {
                            batasDesaLayer.addTo(map);
                            console.log('Batas desa layer berhasil ditambahkan ke peta');
                        } else {
                            console.log('Batas desa layer sudah ada di peta');
                        }
                    } else {
                        console.log('Batas desa layer dibuat tapi tidak ditampilkan (checkbox unchecked)');
                    }
                    
                    // Fit map to bounds with padding (always, regardless of checkbox)
                    try {
                        const bounds = batasDesaLayer.getBounds();
                        if (bounds && bounds.isValid && bounds.isValid()) {
                            map.fitBounds(bounds, { padding: [50, 50] });
                            console.log('Peta di-fit ke bounds batas desa');
                        } else {
                            // Try alternative method
                            const latlngs = [];
                            batasDesaLayer.eachLayer(function(layer) {
                                if (layer.getLatLng) {
                                    latlngs.push(layer.getLatLng());
                                } else if (layer.getBounds) {
                                    const layerBounds = layer.getBounds();
                                    latlngs.push(layerBounds.getSouthWest(), layerBounds.getNorthEast());
                                }
                            });
                            if (latlngs.length > 0) {
                                const bounds = L.latLngBounds(latlngs);
                                map.fitBounds(bounds, { padding: [50, 50] });
                                console.log('Peta di-fit ke bounds menggunakan alternatif method');
                            }
                        }
                    } catch (e) {
                        console.warn('Error saat fit bounds:', e);
                    }
                    
                    console.log('✅ Batas desa berhasil dimuat dari:', fileName);
                    console.log('Layer memiliki', batasDesaLayer.getLayers().length, 'sub-layer(s)');
                } else {
                    console.error('Gagal membuat layer batas desa');
                }
            })
            .catch(error => {
                console.warn(`❌ Gagal memuat ${fileName}:`, error.message);
                fileIndex++;
                tryLoadFile();
            });
    }
    
    tryLoadFile();
}

// Navigation between pages
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageId = btn.getAttribute('data-page');
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding page
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(`page${pageId.charAt(0).toUpperCase() + pageId.slice(1)}`).classList.add('active');
        });
    });
}

// Layer controls
function initLayerControls() {
    const layerCheckboxes = {
        pendidikan: document.getElementById('layerPendidikan'),
        tempatibadah: document.getElementById('layerTempatIbadah'),
        kesehatan: document.getElementById('layerKesehatan'),
        batasDesa: document.getElementById('layerBatasDesa')
    };
    
    Object.keys(layerCheckboxes).forEach(key => {
        if (layerCheckboxes[key]) {
            layerCheckboxes[key].addEventListener('change', (e) => {
                if (key === 'batasDesa') {
                    if (e.target.checked && batasDesaLayer) {
                        map.addLayer(batasDesaLayer);
                    } else if (batasDesaLayer) {
                        map.removeLayer(batasDesaLayer);
                    }
                } else {
                    if (e.target.checked) {
                        map.addLayer(layers[key]);
                    } else {
                        map.removeLayer(layers[key]);
                    }
                }
            });
        }
    });
}

// Load data to map
function loadDataToMap() {
    // Clear existing markers
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
    Object.values(layers).forEach(layer => layer.clearLayers());
    
    // Add markers
    dataStore.forEach(item => {
        const icon = getIconForType(item.tipe);
        const marker = L.marker([item.lat, item.lng], { icon })
            .addTo(layers[item.tipe])
            .bindPopup(`
                <strong>${item.nama}</strong><br>
                Tipe: ${item.tipe}<br>
                ${item.deskripsi}
            `);
        
        marker.dataId = item.id;
        markers.push(marker);
    });
}

function getIconForType(tipe) {
    const iconColors = {
        pendidikan: '#3498db',
        tempatibadah: '#3ac072ff',
        kesehatan: '#e74c3c'
    };
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${iconColors[tipe]}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}

// Dashboard
function initDashboard() {
    updateDashboard();
}

function updateDashboard() {
    const pendidikanCount = dataStore.filter(d => d.tipe === 'pendidikan').length;
    const tempatibadahCount = dataStore.filter(d => d.tipe === 'tempatibadah').length;
    const kesehatanCount = dataStore.filter(d => d.tipe === 'kesehatan').length;
    
    document.getElementById('statPendidikan').textContent = pendidikanCount;
    document.getElementById('statTempatibadah').textContent = tempatibadahCount;
    document.getElementById('statKesehatan').textContent = kesehatanCount;
    
    // Update chart
    updateChart();
}

function updateChart() {
    const ctx = document.getElementById('chartCanvas');
    if (!ctx) return;
    
    const pendidikanCount = dataStore.filter(d => d.tipe === 'pendidikan').length;
    const tempatibadahCount = dataStore.filter(d => d.tipe === 'tempatibadah').length;
    const kesehatanCount = dataStore.filter(d => d.tipe === 'kesehatan').length;
    
    // Destroy existing chart if any
    if (window.chartInstance) {
        window.chartInstance.destroy();
    }
    
    window.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pendidikan', 'Tempat ibadah', 'Kesehatan'],
            datasets: [{
                label: 'Jumlah Data',
                data: [pendidikanCount, tempatibadahCount, kesehatanCount],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(231, 76, 60, 0.8)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}


