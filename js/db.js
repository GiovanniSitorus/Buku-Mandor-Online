/**
 * Database Engine - Buku Mandor Digital
 * Relational LocalStorage Store with Seed Data & Audit Logs
 */

const DB_KEY = 'buku_mandor_db_v1';

function getTodayStr() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const INITIAL_SEED = {
  currentUser: {
    id: 'USR-001',
    username: 'mandor_supri',
    name: 'Supriatna (Mandor Utama)',
    role: 'mandor', // 'admin', 'mandor', 'asisten'
    afdeling: 'Afdeling Alpha - Sawit'
  },
  users: [
    { id: 'USR-001', username: 'mandor_supri', name: 'Supriatna (Mandor Utama)', role: 'mandor', afdeling: 'Afdeling Alpha - Sawit' },
    { id: 'USR-002', username: 'admin_kebun', name: 'Budi Santoso (Admin)', role: 'admin', afdeling: 'Pusat Kebun' },
    { id: 'USR-003', username: 'asisten_hendra', name: 'Ir. Hendra (Asisten Afdeling)', role: 'asisten', afdeling: 'Afdeling Alpha - Sawit' }
  ],
  workers: [
    { id: 'W-001', workerId: 'PKR-001', name: 'Agus Setiawan', nik: '3201018501230001', position: 'Pemanen Utama', gender: 'Laki-laki', team: 'Regu 1 - Panen', afdeling: 'Afdeling Alpha', status: 'aktif' },
    { id: 'W-002', workerId: 'PKR-002', name: 'Siti Rahmawati', nik: '3201019002150002', position: 'Pekerja Pemupukan', gender: 'Perempuan', team: 'Regu 2 - Pemupukan', afdeling: 'Afdeling Alpha', status: 'aktif' },
    { id: 'W-003', workerId: 'PKR-003', name: 'Bambang Hermanto', nik: '3201018203110003', position: 'Pemanen Utama', gender: 'Laki-laki', team: 'Regu 1 - Panen', afdeling: 'Afdeling Alpha', status: 'aktif' },
    { id: 'W-004', workerId: 'PKR-004', name: 'Joko Widodo', nik: '3201018704200004', position: 'Operator Sprayer', gender: 'Laki-laki', team: 'Regu 3 - Gulma & Semprot', afdeling: 'Afdeling Alpha', status: 'aktif' },
    { id: 'W-005', workerId: 'PKR-005', name: 'Dewi Lestari', nik: '3201019305100005', position: 'Pekerja Pemupukan', gender: 'Perempuan', team: 'Regu 2 - Pemupukan', afdeling: 'Afdeling Alpha', status: 'aktif' },
    { id: 'W-006', workerId: 'PKR-006', name: 'Dedi Kurniawan', nik: '3201018906050006', position: 'Pemanen Utama', gender: 'Laki-laki', team: 'Regu 1 - Panen', afdeling: 'Afdeling Alpha', status: 'aktif' },
    { id: 'W-007', workerId: 'PKR-007', name: 'Rudi Tabuti', nik: '3201019107120007', position: 'Pengangkut TBS (Loading)', gender: 'Laki-laki', team: 'Regu 4 - Pengangkutan', afdeling: 'Afdeling Alpha', status: 'aktif' },
    { id: 'W-008', workerId: 'PKR-008', name: 'Nurul Hidayah', nik: '3201019508180008', position: 'Pekerja Pemangkasan', gender: 'Perempuan', team: 'Regu 3 - Gulma & Semprot', afdeling: 'Afdeling Alpha', status: 'aktif' },
    { id: 'W-009', workerId: 'PKR-009', name: 'Eko Prasetyo', nik: '3201018809220009', position: 'Pemanen Utama', gender: 'Laki-laki', team: 'Regu 1 - Panen', afdeling: 'Afdeling Alpha', status: 'aktif' },
    { id: 'W-010', workerId: 'PKR-010', name: 'Suryadi', nik: '3201018610040010', position: 'Perawat Jalan & Parit', gender: 'Laki-laki', team: 'Regu 4 - Pengangkutan', afdeling: 'Afdeling Alpha', status: 'aktif' }
  ],
  teams: [
    { id: 'T-001', name: 'Regu 1 - Panen', leader: 'Agus Setiawan', desc: 'Fokus Panen Pokok Tinggi & Sedang Blok A & B' },
    { id: 'T-002', name: 'Regu 2 - Pemupukan', leader: 'Siti Rahmawati', desc: 'Pemupukan Anorganik & Organik Block Wise' },
    { id: 'T-003', name: 'Regu 3 - Gulma & Semprot', leader: 'Joko Widodo', desc: 'Pengendalian Gulma & Semprot Herbisida Pasar Pikul' },
    { id: 'T-004', name: 'Regu 4 - Pengangkutan', leader: 'Rudi Tabuti', desc: 'Pengangkutan TBS dari TPH ke PKS / Ramp' }
  ],
  attendance: [
    { id: 'ATT-001', date: getTodayStr(), workerId: 'PKR-001', status: 'Hadir', checkIn: '06:15', checkOut: '14:30', notes: 'Hadir tepat waktu' },
    { id: 'ATT-002', date: getTodayStr(), workerId: 'PKR-002', status: 'Hadir', checkIn: '06:20', checkOut: '14:30', notes: 'Hadir tepat waktu' },
    { id: 'ATT-003', date: getTodayStr(), workerId: 'PKR-003', status: 'Hadir', checkIn: '06:10', checkOut: '14:30', notes: 'Hadir tepat waktu' },
    { id: 'ATT-004', date: getTodayStr(), workerId: 'PKR-004', status: 'Hadir', checkIn: '06:30', checkOut: '14:30', notes: 'Hadir tepat waktu' },
    { id: 'ATT-005', date: getTodayStr(), workerId: 'PKR-005', status: 'Izin', checkIn: '-', checkOut: '-', notes: 'Izin keperluan keluarga' },
    { id: 'ATT-006', date: getTodayStr(), workerId: 'PKR-006', status: 'Hadir', checkIn: '06:15', checkOut: '14:30', notes: 'Hadir tepat waktu' },
    { id: 'ATT-007', date: getTodayStr(), workerId: 'PKR-007', status: 'Hadir', checkIn: '06:25', checkOut: '14:30', notes: 'Hadir tepat waktu' },
    { id: 'ATT-008', date: getTodayStr(), workerId: 'PKR-008', status: 'Sakit', checkIn: '-', checkOut: '-', notes: 'Surat dokter terlampir' },
    { id: 'ATT-009', date: getTodayStr(), workerId: 'PKR-009', status: 'Hadir', checkIn: '06:12', checkOut: '14:30', notes: 'Hadir tepat waktu' },
    { id: 'ATT-010', date: getTodayStr(), workerId: 'PKR-010', status: 'Hadir', checkIn: '06:18', checkOut: '14:30', notes: 'Hadir tepat waktu' }
  ],
  activities: [
    {
      id: 'ACT-001',
      date: getTodayStr(),
      time: '07:00',
      workerNames: 'Agus Setiawan, Bambang Hermanto, Dedi Kurniawan, Eko Prasetyo',
      workerIds: ['PKR-001', 'PKR-003', 'PKR-006', 'PKR-009'],
      team: 'Regu 1 - Panen',
      type: 'Panen',
      locationBlock: 'Blok A12',
      targetArea: 12,
      unit: 'Kg TBS',
      result: 6840,
      startTime: '07:00',
      endTime: '12:30',
      toolsUsed: 'Egrek 9m, Dodos, Batu Asah',
      materialsUsed: 'Areal Pasar Pikul',
      notes: 'Panen pusingan ke-3 berjalan lancar. Buah matang sempurna.',
      status: 'Selesai'
    },
    {
      id: 'ACT-002',
      date: getTodayStr(),
      time: '07:30',
      workerNames: 'Siti Rahmawati, Dewi Lestari',
      workerIds: ['PKR-002', 'PKR-005'],
      team: 'Regu 2 - Pemupukan',
      type: 'Pemupukan',
      locationBlock: 'Blok B05',
      targetArea: 8,
      unit: 'Kg Pupuk',
      result: 700,
      startTime: '07:30',
      endTime: '13:00',
      toolsUsed: 'Ember Dosis, Takaran Pupuk 2.5kg',
      materialsUsed: 'Pupuk NPK 15-15-15 (700 kg)',
      notes: 'Pemupukan piringan keliling pokok 2kg/pokok.',
      status: 'Selesai'
    },
    {
      id: 'ACT-003',
      date: getTodayStr(),
      time: '08:00',
      workerNames: 'Joko Widodo, Nurul Hidayah',
      workerIds: ['PKR-004', 'PKR-008'],
      team: 'Regu 3 - Gulma & Semprot',
      type: 'Pengendalian gulma',
      locationBlock: 'Blok C02',
      targetArea: 6,
      unit: 'Ha',
      result: 4.5,
      startTime: '08:00',
      endTime: '14:00',
      toolsUsed: 'Solo Knapsack Sprayer 15L',
      materialsUsed: 'Herbisida Gisat 480 SL (15 Liter)',
      notes: 'Penyemprotan pasar pikul dan TPH.',
      status: 'Berjalan'
    }
  ],
  harvest_records: [
    {
      id: 'HARV-001',
      activityId: 'ACT-001',
      block: 'Blok A12',
      blockArea: 12,
      workerCount: 4,
      palmTrees: 380,
      bunchCount: 380,
      bjr: 18.0,
      totalTbsWeight: 6840,
      tphCount: 12,
      ancakCount: 16,
      notes: 'Pusingan 3, kondisi TBS segar (BJR 18.0 kg)'
    }
  ],
  fertilizer_records: [
    {
      id: 'FERT-001',
      activityId: 'ACT-002',
      fertilizerType: 'Pupuk NPK 15-15-15',
      dosage: '2.0 Kg / Pokok',
      workerCount: 2,
      areaSize: 8,
      palmTrees: 350,
      totalFertilizerUsed: 700,
      block: 'Blok B05',
      result: 'Selesai 8 Ha (350 Pokok terpupuk)',
      notes: 'Piringan bersih dari gulma.'
    }
  ],
  weed_control_records: [
    {
      id: 'WEED-001',
      activityId: 'ACT-003',
      method: 'Semprot Chemis (Knapsack)',
      weedType: 'Gulma Berdaun Lebar & Pakisan',
      areaSize: 6,
      block: 'Blok C02',
      workerCount: 2,
      herbicideUsed: 'Gisat 480 SL',
      dosage: '2.5 L / Ha',
      result: 'Realisasi 4.5 Ha dari target 6 Ha',
      notes: 'Dosis sesuai SOP Afdeling.'
    }
  ],
  tools: [
    { id: 'TL-001', name: 'Egrek Panen 9m', type: 'Alat Panen', quantity: 18, unit: 'Pcs', condition: 'Baik', usage: 'Panen Sawit Pokok Tinggi', lastUsed: getTodayStr(), notes: 'Siap Pakai' },
    { id: 'TL-002', name: 'Dodos Panen 5 inch', type: 'Alat Panen', quantity: 12, unit: 'Pcs', condition: 'Baik', usage: 'Panen Sawit Pokok Rendah', lastUsed: getTodayStr(), notes: 'Tajam' },
    { id: 'TL-003', name: 'Solo Knapsack Sprayer 15L', type: 'Alat Semprot', quantity: 8, unit: 'Unit', condition: 'Perlu Perbaikan', usage: 'Pengendalian Gulma Chemis', lastUsed: getTodayStr(), notes: '7 Baik, 1 Service' },
    { id: 'TL-004', name: 'Angkong / Sorong TBS', type: 'Alat Angkut', quantity: 15, unit: 'Unit', condition: 'Baik', usage: 'Lansir TBS ke TPH', lastUsed: getTodayStr(), notes: 'Ban dalam baru' },
    { id: 'TL-005', name: 'Tojok TBS Stainless', type: 'Alat Angkut', quantity: 20, unit: 'Pcs', condition: 'Baik', usage: 'Loading TBS ke Truk', lastUsed: getTodayStr(), notes: 'Siap Pakai' }
  ],
  materials: [
    { id: 'MT-001', name: 'Pupuk NPK 15-15-15 (Mahkota)', type: 'Pupuk Anorganik', quantity: 4300, unit: 'Kg', condition: 'Bagus (Karung Utuh)', usage: 'Pemupukan Rutin Afdeling', lastUsed: getTodayStr(), notes: 'Gudang Afdeling Alpha' },
    { id: 'MT-002', name: 'Pupuk Urea Granul', type: 'Pupuk Anorganik', quantity: 2500, unit: 'Kg', condition: 'Baik', usage: 'Pemupukan Vegetatif', lastUsed: getTodayStr(), notes: 'Stok Terjaga' },
    { id: 'MT-003', name: 'Herbisida Gisat 480 SL', type: 'Pestisida / Herbisida', quantity: 120, unit: 'Liter', condition: 'Sealed', usage: 'Semprot Gulma Pasar Pikul', lastUsed: getTodayStr(), notes: 'Jerigen 20L x 6' },
    { id: 'MT-004', name: 'Perekat / Surfaktan Spreader', type: 'Bahan Pembantu', quantity: 25, unit: 'Liter', condition: 'Baik', usage: 'Campuran Herbisida', lastUsed: getTodayStr(), notes: 'Botol 1L' }
  ],
  targets: [
    { id: 'TGT-001', date: getTodayStr(), activityType: 'Panen', targetValue: 6000, realizationValue: 6840, unit: 'Kg TBS', percentage: 114.0, status: 'Tercapai', block: 'Blok A12' },
    { id: 'TGT-002', date: getTodayStr(), activityType: 'Pemupukan', targetValue: 700, realizationValue: 700, unit: 'Kg Pupuk', percentage: 100.0, status: 'Tercapai', block: 'Blok B05' },
    { id: 'TGT-003', date: getTodayStr(), activityType: 'Pengendalian gulma', targetValue: 6.0, realizationValue: 4.5, unit: 'Ha', percentage: 75.0, status: 'Hampir tercapai', block: 'Blok C02' },
    { id: 'TGT-004', date: getTodayStr(), activityType: 'Pengangkutan TBS', targetValue: 10.0, realizationValue: 3.0, unit: 'Ton TBS', percentage: 30.0, status: 'Belum tercapai', block: 'TPH Blok A12' }
  ],
  activity_photos: [
    {
      id: 'PH-001',
      activityId: 'ACT-001',
      photoData: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=600&q=80',
      timestamp: getTodayStr() + ' 08:45:10',
      caption: 'Dokumentasi TPH Blok A12 - TBS Matang Sempurna'
    }
  ],
  activity_logs: [
    { id: 'LOG-001', timestamp: getTodayStr() + ' 06:30:12', user: 'Supriatna (Mandor Utama)', role: 'Mandor', action: 'Input Absensi Pagi', details: 'Menandai 8 Pekerja Hadir, 1 Izin, 1 Sakit.' },
    { id: 'LOG-002', timestamp: getTodayStr() + ' 07:05:40', user: 'Supriatna (Mandor Utama)', role: 'Mandor', action: 'Input Kegiatan Panen', details: 'Kegiatan ACT-001 di Blok A12 dibuat dengan target 12 Ha.' },
    { id: 'LOG-003', timestamp: getTodayStr() + ' 13:10:00', user: 'Supriatna (Mandor Utama)', role: 'Mandor', action: 'Update Hasil Panen', details: 'TBS Terpanen 380 Janjang (6.840 Kg) di Blok A12.' }
  ]
};

class MandorDB {
  constructor() {
    this.init();
  }

  init() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      this.saveAll(INITIAL_SEED);
    }
  }

  getRaw() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEY)) || INITIAL_SEED;
    } catch (e) {
      console.error('Failed to parse DB, resetting to initial seed:', e);
      this.saveAll(INITIAL_SEED);
      return INITIAL_SEED;
    }
  }

  saveAll(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }

  getTable(tableName) {
    const data = this.getRaw();
    return data[tableName] || [];
  }

  setTable(tableName, items) {
    const data = this.getRaw();
    data[tableName] = items;
    this.saveAll(data);
  }

  getCurrentUser() {
    const data = this.getRaw();
    return data.currentUser || INITIAL_SEED.currentUser;
  }

  setCurrentUser(userObj) {
    const data = this.getRaw();
    data.currentUser = userObj;
    this.saveAll(data);
  }

  // Generic CRUD
  getAll(tableName) {
    return this.getTable(tableName);
  }

  getById(tableName, id) {
    const items = this.getTable(tableName);
    return items.find(item => item.id === id);
  }

  insert(tableName, item) {
    const items = this.getTable(tableName);
    if (!item.id) {
      item.id = tableName.substring(0, 3).toUpperCase() + '-' + Date.now().toString().slice(-6);
    }
    items.unshift(item);
    this.setTable(tableName, items);

    // Auto log
    const user = this.getCurrentUser();
    this.addAuditLog(user.name, user.role, `Tambah ${tableName}`, `Menambahkan data baru (ID: ${item.id})`);

    return item;
  }

  update(tableName, id, updateFields) {
    const items = this.getTable(tableName);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updateFields };
      this.setTable(tableName, items);

      const user = this.getCurrentUser();
      this.addAuditLog(user.name, user.role, `Edit ${tableName}`, `Memperbarui data (ID: ${id})`);
      return items[index];
    }
    return null;
  }

  delete(tableName, id) {
    let items = this.getTable(tableName);
    const target = items.find(i => i.id === id);
    items = items.filter(i => i.id !== id);
    this.setTable(tableName, items);

    const user = this.getCurrentUser();
    this.addAuditLog(user.name, user.role, `Hapus ${tableName}`, `Menghapus data ID: ${id}`);
  }

  addAuditLog(user, role, action, details) {
    const logs = this.getTable('activity_logs');
    const now = new Date();
    const timeStr = `${getTodayStr()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    logs.unshift({
      id: 'LOG-' + Date.now().toString().slice(-6),
      timestamp: timeStr,
      user: user || 'Mandor Supriatna',
      role: role || 'mandor',
      action: action,
      details: details
    });

    this.setTable('activity_logs', logs.slice(0, 200)); // keep last 200 logs
  }

  resetToDefault() {
    this.saveAll(INITIAL_SEED);
  }
}

const db = new MandorDB();
window.db = db;
