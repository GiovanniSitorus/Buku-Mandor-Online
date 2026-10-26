/**
 * Main Application Logic - Buku Mandor Digital
 * Full Feature Controller, Event Handlers, Charting & Export Engine
 */

let activeSection = 'sec-dashboard';
let activeAlatBahanTab = 'alat';
let chartKehadiranInst = null;
let chartProduktivitasInst = null;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Restore Saved Theme
  const savedTheme = localStorage.getItem('themePreference') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeUI(savedTheme);

  // Apply Language Translations
  if (window.i18n) {
    window.i18n.applyTranslations();
  }

  // Set Today Date Inputs
  const today = getTodayStr();
  document.getElementById('dashTodayDate').textContent = formatDateIndo(today);
  document.getElementById('absensiDate').value = today;
  document.getElementById('filterKegiatanDate').value = today;
  document.getElementById('laporanDate').value = today;
  document.getElementById('kegiatanDate').value = today;
  document.getElementById('targetDate').value = today;

  // Sync Current User Profile
  const user = db.getCurrentUser();
  syncUserProfileUI(user);

  // Initial Data Renders
  renderDashboard();
  renderPekerjaTable();
  loadAbsensiForDate();
  renderKegiatanTable();
  renderTargetTable();
  renderAlatBahanTables();
  generateReportView();
  renderAuditLogsTable();
  initCharts();
}

function syncUserProfileUI(user) {
  document.getElementById('dashWelcomeUser').textContent = user.name;
  document.getElementById('dashAfdelingInfo').textContent = user.afdeling;
  document.getElementById('sidebarUserName').textContent = user.name.split(' ')[0];
  document.getElementById('sidebarUserRole').textContent = user.role.toUpperCase();
  document.getElementById('userRoleSelector').value = user.role;
  document.getElementById('settingMandorName').value = user.name;
  document.getElementById('settingAfdeling').value = user.afdeling;
}

// Navigation & Tab Switching
function navigateTo(sectionId) {
  activeSection = sectionId;
  
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.getAttribute('data-target') === sectionId) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const targetSec = document.getElementById(sectionId);
  if (targetSec) {
    targetSec.classList.add('active');
  }

  // Update Page Headings with i18n Support
  const sectionKey = sectionId.replace('sec-', '');
  const headText = window.i18n ? window.i18n.t('head_' + sectionKey) : '';
  const subText = window.i18n ? window.i18n.t('sub_' + sectionKey) : '';

  if (headText) {
    document.getElementById('pageHeading').textContent = headText;
    document.getElementById('pageSubheading').textContent = subText;
  }

  // Close mobile sidebar if open
  document.getElementById('appSidebar').classList.remove('mobile-open');

  // Trigger refresh on view
  if (sectionId === 'sec-dashboard') renderDashboard();
  if (sectionId === 'sec-laporan') {
    generateReportView();
    updateCharts();
  }
}

function toggleMobileSidebar() {
  document.getElementById('appSidebar').classList.toggle('mobile-open');
}

// Theme Switcher
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('themePreference', newTheme);
  
  updateThemeUI(newTheme);
}

function updateThemeUI(theme) {
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (theme === 'light') {
    if (icon) icon.className = 'fa-solid fa-sun';
    if (label) label.textContent = window.i18n ? window.i18n.t('theme_light') : 'LIGHT';
  } else {
    if (icon) icon.className = 'fa-solid fa-moon';
    if (label) label.textContent = window.i18n ? window.i18n.t('theme_dark') : 'DARK';
  }
}

// Language Switcher
function switchLanguage(lang) {
  if (window.i18n) {
    window.i18n.setLang(lang);
    navigateTo(activeSection);
    updateThemeUI(document.documentElement.getAttribute('data-theme'));
    const msg = lang === 'en' ? 'Switched language to English 🇬🇧' : 'Berhasil mengubah bahasa ke Bahasa Indonesia 🇮🇩';
    showToast(msg, 'success');
  }
}

// Role Switcher & Permissions Check
function switchRole(role) {
  const user = db.getCurrentUser();
  user.role = role;
  if (role === 'admin') user.name = 'Budi Santoso (Admin)';
  if (role === 'asisten') user.name = 'Ir. Hendra (Asisten Afdeling)';
  if (role === 'mandor') user.name = 'Supriatna (Mandor Utama)';
  
  db.setCurrentUser(user);
  syncUserProfileUI(user);
  showToast(`Berhasil beralih ke Mode Akses: ${role.toUpperCase()}`, 'info');
  
  db.addAuditLog(user.name, user.role, 'Switch Role', `Ganti role ke ${role.toUpperCase()}`);
}

function checkUserPermission(action) {
  const user = db.getCurrentUser();
  if (action === 'delete' && user.role === 'asisten') {
    showToast('Akses Ditolak: Asisten hanya memiliki hak akses Monitoring & Verifikasi.', 'danger');
    return false;
  }
  return true;
}


/* ==========================================================================
   MODULE 1: DASHBOARD RENDERER
   ========================================================================== */
function renderDashboard() {
  const today = getTodayStr();
  const workers = db.getAll('workers');
  const attendance = db.getAll('attendance').filter(a => a.date === today);
  const activities = db.getAll('activities').filter(a => a.date === today);

  const hadirCount = attendance.filter(a => a.status === 'Hadir').length;
  const absenCount = attendance.filter(a => a.status !== 'Hadir').length;
  const totalPekerja = workers.length;

  const totalPekerjaan = activities.length;
  const pendingCount = activities.filter(a => a.status !== 'Selesai').length;

  // Calculate total TBS harvested weight (from harvest records or activity results)
  const harvestRecords = db.getAll('harvest_records');
  const totalTbsKg = harvestRecords.reduce((sum, h) => sum + (Number(h.totalTbsWeight) || 0), 0);

  document.getElementById('dashStatHadir').textContent = hadirCount;
  document.getElementById('dashStatAbsen').textContent = absenCount;
  document.getElementById('dashStatTotalPekerja').textContent = totalPekerja;
  document.getElementById('dashStatTotalPekerjaan').textContent = totalPekerjaan;
  document.getElementById('dashStatTotalHasil').textContent = totalTbsKg.toLocaleString('id-ID') + ' Kg';
  document.getElementById('dashStatPending').textContent = pendingCount;

  // Render Table Ringkasan Kegiatan Hari Ini
  const tbody = document.getElementById('dashTableKegiatan');
  tbody.innerHTML = '';

  if (activities.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">Belum ada kegiatan tercatat hari ini. Klik "Catat Kegiatan Baru" untuk mulai.</td></tr>`;
    return;
  }

  activities.forEach(act => {
    const tr = document.createElement('tr');
    const badgeClass = act.status === 'Selesai' ? 'badge-selesai' : (act.status === 'Berjalan' ? 'badge-berjalan' : 'badge-belum');
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700;">${act.time || '-'}</td>
      <td><strong>${act.type}</strong></td>
      <td>${act.team}</td>
      <td><span class="badge badge-izin">${act.locationBlock}</span></td>
      <td>${act.targetArea} ${act.unit}</td>
      <td style="font-weight:700; color:var(--accent-gold);">${act.result} ${act.unit}</td>
      <td><span class="badge ${badgeClass}">${act.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}


/* ==========================================================================
   MODULE 2: DATA PEKERJA RENDERER & CRUD
   ========================================================================== */
function renderPekerjaTable() {
  const search = document.getElementById('searchPekerja').value.toLowerCase();
  const reguFilter = document.getElementById('filterReguPekerja').value;
  
  let workers = db.getAll('workers');

  if (search) {
    workers = workers.filter(w => 
      w.name.toLowerCase().includes(search) || 
      w.workerId.toLowerCase().includes(search) || 
      w.nik.includes(search)
    );
  }

  if (reguFilter) {
    workers = workers.filter(w => w.team === reguFilter);
  }

  const tbody = document.getElementById('tablePekerjaBody');
  tbody.innerHTML = '';

  if (workers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--text-muted);">Tidak ada data pekerja yang cocok.</td></tr>`;
    return;
  }

  workers.forEach(w => {
    const tr = document.createElement('tr');
    const badgeStatus = w.status === 'aktif' ? 'badge-aktif' : 'badge-nonaktif';
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700;">${w.workerId}</td>
      <td><strong>${w.name}</strong></td>
      <td style="font-family:var(--font-mono);">${w.nik}</td>
      <td>${w.position}</td>
      <td>${w.gender}</td>
      <td>${w.team}</td>
      <td>${w.afdeling}</td>
      <td><span class="badge ${badgeStatus}">${w.status}</span></td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-secondary btn-sm" onclick="editPekerja('${w.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deletePekerja('${w.id}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleSavePekerja(e) {
  e.preventDefault();
  const dbId = document.getElementById('pekerjaDbId').value;
  const workerId = document.getElementById('pekerjaIdCode').value.trim();
  const nik = document.getElementById('pekerjaNik').value.trim();
  const name = document.getElementById('pekerjaNama').value.trim();
  const position = document.getElementById('pekerjaJabatan').value;
  const gender = document.getElementById('pekerjaGender').value;
  const team = document.getElementById('pekerjaRegu').value;
  const afdeling = document.getElementById('pekerjaAfdeling').value;
  const status = document.getElementById('pekerjaStatus').value;

  // Validation
  if (!workerId || !nik || !name) {
    showToast('Gagal: Seluruh data wajib diisi!', 'danger');
    return;
  }

  // Duplicate Check
  const existing = db.getAll('workers');
  const duplicate = existing.find(w => w.workerId.toLowerCase() === workerId.toLowerCase() && w.id !== dbId);
  if (duplicate) {
    showToast(`Gagal: ID Pekerja ${workerId} sudah digunakan oleh ${duplicate.name}!`, 'danger');
    return;
  }

  const payload = { workerId, nik, name, position, gender, team, afdeling, status };

  if (dbId) {
    db.update('workers', dbId, payload);
    showToast(`Berhasil memperbarui data pekerja ${name}`, 'success');
  } else {
    db.insert('workers', payload);
    showToast(`Berhasil menambah pekerja baru ${name}`, 'success');
  }

  closeModal('modalInputPekerja');
  renderPekerjaTable();
}

function editPekerja(id) {
  const w = db.getById('workers', id);
  if (!w) return;

  document.getElementById('pekerjaDbId').value = w.id;
  document.getElementById('pekerjaIdCode').value = w.workerId;
  document.getElementById('pekerjaNik').value = w.nik;
  document.getElementById('pekerjaNama').value = w.name;
  document.getElementById('pekerjaJabatan').value = w.position;
  document.getElementById('pekerjaGender').value = w.gender;
  document.getElementById('pekerjaRegu').value = w.team;
  document.getElementById('pekerjaAfdeling').value = w.afdeling;
  document.getElementById('pekerjaStatus').value = w.status;

  document.getElementById('modalPekerjaTitle').textContent = 'Edit Data Pekerja';
  openModal('modalInputPekerja');
}

function deletePekerja(id) {
  if (!checkUserPermission('delete')) return;
  const w = db.getById('workers', id);
  if (!w) return;

  if (confirm(`Apakah Anda yakin ingin menghapus data pekerja ${w.name} (${w.workerId})?`)) {
    db.delete('workers', id);
    showToast(`Data pekerja ${w.name} telah dihapus.`, 'info');
    renderPekerjaTable();
  }
}


/* ==========================================================================
   MODULE 3: ABSENSI HARIAN RENDERER & 1-CLICK ACTIONS
   ========================================================================== */
function loadAbsensiForDate() {
  const dateVal = document.getElementById('absensiDate').value || getTodayStr();
  const workers = db.getAll('workers').filter(w => w.status === 'aktif');
  let attendance = db.getAll('attendance').filter(a => a.date === dateVal);

  // If no attendance records exist for this date, build default records
  if (attendance.length === 0) {
    attendance = workers.map(w => ({
      id: 'ATT-' + Date.now().toString().slice(-6) + '-' + w.workerId,
      date: dateVal,
      workerId: w.workerId,
      status: 'Hadir',
      checkIn: '06:30',
      checkOut: '14:30',
      notes: ''
    }));
  }

  // Update Summary Counts
  const hadir = attendance.filter(a => a.status === 'Hadir').length;
  const izin = attendance.filter(a => a.status === 'Izin').length;
  const sakit = attendance.filter(a => a.status === 'Sakit').length;
  const alpha = attendance.filter(a => a.status === 'Alpha').length;

  document.getElementById('rekapHadirCount').textContent = hadir;
  document.getElementById('rekapIzinCount').textContent = izin;
  document.getElementById('rekapSakitCount').textContent = sakit;
  document.getElementById('rekapAlphaCount').textContent = alpha;

  const tbody = document.getElementById('tableAbsensiBody');
  tbody.innerHTML = '';

  workers.forEach(w => {
    const attRec = attendance.find(a => a.workerId === w.workerId) || {
      status: 'Hadir', checkIn: '06:30', checkOut: '14:30', notes: ''
    };

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700;">${w.workerId}</td>
      <td><strong>${w.name}</strong><br><small style="color:var(--text-muted);">${w.position}</small></td>
      <td>${w.team}</td>
      <td>
        <select class="form-control att-status-select" data-worker-id="${w.workerId}" style="min-width:110px; height:38px; padding:4px 8px;" onchange="updateAbsensiSummaryLive()">
          <option value="Hadir" ${attRec.status === 'Hadir' ? 'selected' : ''}>Hadir</option>
          <option value="Izin" ${attRec.status === 'Izin' ? 'selected' : ''}>Izin</option>
          <option value="Sakit" ${attRec.status === 'Sakit' ? 'selected' : ''}>Sakit</option>
          <option value="Alpha" ${attRec.status === 'Alpha' ? 'selected' : ''}>Alpha</option>
        </select>
      </td>
      <td><input type="time" class="form-control att-checkin" data-worker-id="${w.workerId}" value="${attRec.checkIn === '-' ? '06:30' : attRec.checkIn}" style="height:38px; width:100px;"></td>
      <td><input type="time" class="form-control att-checkout" data-worker-id="${w.workerId}" value="${attRec.checkOut === '-' ? '14:30' : attRec.checkOut}" style="height:38px; width:100px;"></td>
      <td><input type="text" class="form-control att-notes" data-worker-id="${w.workerId}" value="${attRec.notes || ''}" placeholder="Catatan..." style="height:38px;"></td>
    `;
    tbody.appendChild(tr);
  });
}

function markAllPresent() {
  const selects = document.querySelectorAll('.att-status-select');
  selects.forEach(s => { s.value = 'Hadir'; });
  updateAbsensiSummaryLive();
  showToast('Semua pekerja ditandai HADIR!', 'success');
}

function updateAbsensiSummaryLive() {
  const selects = document.querySelectorAll('.att-status-select');
  let hadir = 0, izin = 0, sakit = 0, alpha = 0;
  selects.forEach(s => {
    if (s.value === 'Hadir') hadir++;
    if (s.value === 'Izin') izin++;
    if (s.value === 'Sakit') sakit++;
    if (s.value === 'Alpha') alpha++;
  });

  document.getElementById('rekapHadirCount').textContent = hadir;
  document.getElementById('rekapIzinCount').textContent = izin;
  document.getElementById('rekapSakitCount').textContent = sakit;
  document.getElementById('rekapAlphaCount').textContent = alpha;
}

function saveAbsensiData() {
  const dateVal = document.getElementById('absensiDate').value || getTodayStr();
  const rows = document.querySelectorAll('#tableAbsensiBody tr');
  
  let allAttendance = db.getAll('attendance').filter(a => a.date !== dateVal);

  rows.forEach(tr => {
    const workerId = tr.querySelector('.att-status-select').getAttribute('data-worker-id');
    const status = tr.querySelector('.att-status-select').value;
    const checkIn = tr.querySelector('.att-checkin').value;
    const checkOut = tr.querySelector('.att-checkout').value;
    const notes = tr.querySelector('.att-notes').value.trim();

    allAttendance.push({
      id: 'ATT-' + Date.now().toString().slice(-6) + '-' + workerId,
      date: dateVal,
      workerId: workerId,
      status: status,
      checkIn: status === 'Hadir' ? checkIn : '-',
      checkOut: status === 'Hadir' ? checkOut : '-',
      notes: notes
    });
  });

  db.setTable('attendance', allAttendance);
  const user = db.getCurrentUser();
  db.addAuditLog(user.name, user.role, 'Simpan Presensi', `Presensi ${dateVal} disimpan (${rows.length} pekerja)`);

  showToast(`Data Presensi tanggal ${formatDateIndo(dateVal)} berhasil disimpan!`, 'success');
  renderDashboard();
  updateCharts();
}


/* ==========================================================================
   MODULE 4: KEGIATAN HARIAN RENDERER & DYNAMIC SUBFORMS
   ========================================================================== */
function renderKegiatanTable() {
  const dateFilter = document.getElementById('filterKegiatanDate').value;
  const typeFilter = document.getElementById('filterKegiatanType').value;
  
  let activities = db.getAll('activities');
  if (dateFilter) activities = activities.filter(a => a.date === dateFilter);
  if (typeFilter) activities = activities.filter(a => a.type === typeFilter);

  const harvestRecords = db.getAll('harvest_records');
  const fertRecords = db.getAll('fertilizer_records');
  const weedRecords = db.getAll('weed_control_records');
  const photos = db.getAll('activity_photos');

  const tbody = document.getElementById('tableKegiatanBody');
  tbody.innerHTML = '';

  if (activities.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:var(--text-muted);">Belum ada kegiatan harian tercatat untuk tanggal/filter ini.</td></tr>`;
    return;
  }

  activities.forEach(act => {
    const tr = document.createElement('tr');
    
    // Find photo if exists
    const photo = photos.find(p => p.activityId === act.id);
    const photoBtnHtml = photo ? 
      `<button class="btn btn-secondary btn-sm" onclick="viewPhoto('${photo.id}')" title="Lihat Foto Bukti"><i class="fa-solid fa-image" style="color:var(--accent-gold);"></i> Foto</button>` :
      `<span style="color:var(--text-muted); font-size:0.75rem;">-</span>`;

    // Dynamic Special Sub-Details
    let specialHtml = '-';
    if (act.type === 'Panen') {
      const h = harvestRecords.find(hr => hr.activityId === act.id);
      if (h) {
        specialHtml = `<small style="line-height:1.3; display:block;">
          <strong>${h.bunchCount} Janjang</strong> (BJR ${h.bjr} kg)<br>
          <span style="color:var(--accent-gold); font-weight:700;">Total: ${h.totalTbsWeight.toLocaleString('id-ID')} Kg TBS</span><br>
          TPH: ${h.tphCount} | Ancak: ${h.ancakCount}
        </small>`;
      }
    } else if (act.type === 'Pemupukan') {
      const f = fertRecords.find(fr => fr.activityId === act.id);
      if (f) {
        specialHtml = `<small style="line-height:1.3; display:block;">
          Pupuk: <strong>${f.fertilizerType}</strong><br>
          Dosis: ${f.dosage} | Total: ${f.totalFertilizerUsed} Kg<br>
          Areal: ${f.areaSize} Ha (${f.palmTrees} Pokok)
        </small>`;
      }
    } else if (act.type === 'Pengendalian gulma') {
      const w = weedRecords.find(wr => wr.activityId === act.id);
      if (w) {
        specialHtml = `<small style="line-height:1.3; display:block;">
          Metode: <strong>${w.method}</strong><br>
          Herbisida: ${w.herbicideUsed} (${w.dosage})<br>
          Gulma: ${w.weedType}
        </small>`;
      }
    }

    const statusBadge = act.status === 'Selesai' ? 'badge-selesai' : (act.status === 'Berjalan' ? 'badge-berjalan' : 'badge-belum');

    tr.innerHTML = `
      <td><span style="font-family:var(--font-mono); font-weight:700;">${act.date}</span><br><small style="color:var(--text-muted);">${act.startTime} - ${act.endTime}</small></td>
      <td><strong>${act.type}</strong></td>
      <td><small style="font-weight:700; color:var(--primary-light);">${act.team}</small><br><small style="color:var(--text-muted);">${act.workerNames || '-'}</small></td>
      <td><span class="badge badge-izin">${act.locationBlock}</span></td>
      <td>Tgt: ${act.targetArea} ${act.unit}<br><strong style="color:var(--accent-gold);">Real: ${act.result} ${act.unit}</strong></td>
      <td>${specialHtml}</td>
      <td><small>${act.toolsUsed || '-'}<br>${act.materialsUsed || '-'}</small></td>
      <td>${photoBtnHtml}</td>
      <td><span class="badge ${statusBadge}">${act.status}</span></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteKegiatan('${act.id}')" title="Hapus"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleSubtypeForms(typeVal) {
  document.getElementById('subformPanen').style.display = typeVal === 'Panen' ? 'block' : 'none';
  document.getElementById('subformPemupukan').style.display = typeVal === 'Pemupukan' ? 'block' : 'none';
  document.getElementById('subformGulma').style.display = typeVal === 'Pengendalian gulma' ? 'block' : 'none';

  if (typeVal === 'Panen') {
    document.getElementById('kegiatanUnit').value = 'Kg TBS';
  } else if (typeVal === 'Pemupukan') {
    document.getElementById('kegiatanUnit').value = 'Kg Pupuk';
  } else {
    document.getElementById('kegiatanUnit').value = 'Ha';
  }
}

function populatePekerjaCheckboxes() {
  const filterRegu = document.getElementById('modalFilterRegu') ? document.getElementById('modalFilterRegu').value : 'all';
  const searchTerm = document.getElementById('modalSearchWorker') ? document.getElementById('modalSearchWorker').value.toLowerCase().trim() : '';

  let workers = db.getAll('workers').filter(w => w.status === 'aktif');

  if (filterRegu && filterRegu !== 'all') {
    workers = workers.filter(w => w.team === filterRegu);
  }

  if (searchTerm) {
    workers = workers.filter(w => 
      w.name.toLowerCase().includes(searchTerm) || 
      w.workerId.toLowerCase().includes(searchTerm) || 
      w.team.toLowerCase().includes(searchTerm)
    );
  }

  const container = document.getElementById('containerPekerjaCheckboxes');
  if (!container) return;
  container.innerHTML = '';

  if (workers.length === 0) {
    container.innerHTML = `<span style="color:var(--text-muted); font-size:0.8rem; grid-column: 1 / -1;">Tidak ada pekerja aktif yang cocok dengan pencarian ini.</span>`;
    updateSelectedWorkerCounter();
    return;
  }

  const mainTeam = document.getElementById('kegiatanRegu') ? document.getElementById('kegiatanRegu').value : '';

  workers.forEach(w => {
    const isSameTeam = w.team === mainTeam || mainTeam === 'Gabungan / Lintas Regu';
    const lbl = document.createElement('label');
    lbl.style.cssText = 'display:flex; align-items:center; gap:8px; font-size:0.83rem; cursor:pointer; color:var(--text-main); padding:6px 8px; border-radius:6px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05);';
    lbl.innerHTML = `
      <input type="checkbox" class="cb-worker" value="${w.workerId}" data-name="${w.name}" ${isSameTeam ? 'checked' : ''} onchange="updateSelectedWorkerCounter()">
      <div style="line-height:1.2;">
        <strong>${w.name}</strong> <small style="color:var(--text-muted);">(${w.workerId})</small>
        <br><span style="font-size:0.72rem; color:var(--primary-light);">${w.team}</span>
      </div>
    `;
    container.appendChild(lbl);
  });

  updateSelectedWorkerCounter();
}

function filterModalWorkersByRegu() {
  const selectedRegu = document.getElementById('kegiatanRegu').value;
  const modalFilterSelect = document.getElementById('modalFilterRegu');
  if (modalFilterSelect) {
    if (selectedRegu !== 'Gabungan / Lintas Regu') {
      modalFilterSelect.value = selectedRegu;
    } else {
      modalFilterSelect.value = 'all';
    }
  }
  populatePekerjaCheckboxes();
}

function selectAllModalWorkers(status) {
  const checkboxes = document.querySelectorAll('.cb-worker');
  checkboxes.forEach(cb => { cb.checked = status; });
  updateSelectedWorkerCounter();
}

function updateSelectedWorkerCounter() {
  const selectedCount = document.querySelectorAll('.cb-worker:checked').length;
  const totalInList = document.querySelectorAll('.cb-worker').length;
  const badge = document.getElementById('modalWorkerCountBadge');
  if (badge) {
    badge.textContent = `${selectedCount} terpilih dari ${totalInList} total anggota`;
  }
}

function calculatePanenTotalWeight() {
  const janjang = Number(document.getElementById('panenJanjang').value) || 0;
  const bjr = Number(document.getElementById('panenBjr').value) || 0;
  const total = Math.round(janjang * bjr);
  document.getElementById('panenCalcTotalWeight').textContent = total.toLocaleString('id-ID') + ' Kg';
  document.getElementById('kegiatanResultVal').value = total;
}

function calculatePupukTotal() {
  const dosis = Number(document.getElementById('pupukDosis').value) || 0;
  const pokok = Number(document.getElementById('pupukPokok').value) || 0;
  const total = Math.round(dosis * pokok);
  document.getElementById('pupukCalcTotal').textContent = total.toLocaleString('id-ID') + ' Kg';
  document.getElementById('kegiatanResultVal').value = total;
}

function previewPhotoInput(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('photoPreviewImg').src = e.target.result;
      document.getElementById('photoPreviewBox').style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function handleSaveKegiatan(e) {
  e.preventDefault();

  const date = document.getElementById('kegiatanDate').value;
  const team = document.getElementById('kegiatanRegu').value;
  const type = document.getElementById('kegiatanType').value;
  const locationBlock = document.getElementById('kegiatanBlok').value.trim();
  const targetArea = Number(document.getElementById('kegiatanTargetVal').value) || 0;
  const unit = document.getElementById('kegiatanUnit').value.trim();
  const result = Number(document.getElementById('kegiatanResultVal').value) || 0;
  const startTime = document.getElementById('kegiatanStartTime').value;
  const endTime = document.getElementById('kegiatanEndTime').value;
  const status = document.getElementById('kegiatanStatus').value;
  const toolsUsed = document.getElementById('kegiatanTools').value.trim();
  const materialsUsed = document.getElementById('kegiatanMaterials').value.trim();
  const notes = document.getElementById('kegiatanNotes').value.trim();

  // Selected Workers
  const checkedBoxes = document.querySelectorAll('.cb-worker:checked');
  const workerIds = Array.from(checkedBoxes).map(cb => cb.value);
  const workerNames = Array.from(checkedBoxes).map(cb => cb.getAttribute('data-name')).join(', ');

  if (!date || !locationBlock || !unit) {
    showToast('Gagal: Tanggal, Blok, dan Satuan Wajib Diisi!', 'danger');
    return;
  }

  const actId = 'ACT-' + Date.now().toString().slice(-6);

  const activityPayload = {
    id: actId,
    date,
    time: startTime,
    workerNames,
    workerIds,
    team,
    type,
    locationBlock,
    targetArea,
    unit,
    result,
    startTime,
    endTime,
    toolsUsed,
    materialsUsed,
    notes,
    status
  };

  db.insert('activities', activityPayload);

  // Save Special Subforms Data
  if (type === 'Panen') {
    const janjang = Number(document.getElementById('panenJanjang').value) || 0;
    const bjr = Number(document.getElementById('panenBjr').value) || 0;
    const totalTbsWeight = Math.round(janjang * bjr);
    db.insert('harvest_records', {
      activityId: actId,
      block: locationBlock,
      blockArea: Number(document.getElementById('panenLuasBlok').value) || 0,
      workerCount: workerIds.length,
      palmTrees: Number(document.getElementById('panenJumlahPokok').value) || 0,
      bunchCount: janjang,
      bjr: bjr,
      totalTbsWeight: totalTbsWeight,
      tphCount: Number(document.getElementById('panenTph').value) || 0,
      ancakCount: Number(document.getElementById('panenAncak').value) || 0,
      notes: notes
    });
  } else if (type === 'Pemupukan') {
    const dosis = Number(document.getElementById('pupukDosis').value) || 0;
    const pokok = Number(document.getElementById('pupukPokok').value) || 0;
    db.insert('fertilizer_records', {
      activityId: actId,
      fertilizerType: document.getElementById('pupukJenis').value,
      dosage: `${dosis} Kg / Pokok`,
      workerCount: workerIds.length,
      areaSize: Number(document.getElementById('pupukLuas').value) || 0,
      palmTrees: pokok,
      totalFertilizerUsed: Math.round(dosis * pokok),
      block: locationBlock,
      result: `Selesai ${result} ${unit}`,
      notes: notes
    });
  } else if (type === 'Pengendalian gulma') {
    db.insert('weed_control_records', {
      activityId: actId,
      method: document.getElementById('gulmaMetode').value,
      weedType: document.getElementById('gulmaJenis').value,
      areaSize: targetArea,
      block: locationBlock,
      workerCount: workerIds.length,
      herbicideUsed: document.getElementById('gulmaBahan').value,
      dosage: `${document.getElementById('gulmaDosis').value} L/Ha`,
      result: `Realisasi ${result} ${unit}`,
      notes: notes
    });
  }

  // Also Auto Create / Update Target Entry
  const pct = targetArea > 0 ? Math.round((result / targetArea) * 100 * 10) / 10 : 0;
  let targetStatus = 'Belum tercapai';
  if (pct >= 100) targetStatus = 'Tercapai';
  else if (pct >= 70) targetStatus = 'Hampir tercapai';

  db.insert('targets', {
    date,
    activityType: type,
    targetValue: targetArea,
    realizationValue: result,
    unit: unit,
    percentage: pct,
    status: targetStatus,
    block: locationBlock
  });

  // Photo Upload Check
  const photoInput = document.getElementById('kegiatanPhotoInput');
  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      db.insert('activity_photos', {
        activityId: actId,
        photoData: e.target.result,
        timestamp: `${date} ${startTime}:00`,
        caption: `Foto Bukti Kegiatan ${type} di ${locationBlock}`
      });
      renderKegiatanTable();
    };
    reader.readAsDataURL(photoInput.files[0]);
  }

  showToast(`Kegiatan ${type} di ${locationBlock} berhasil disimpan!`, 'success');
  closeModal('modalInputKegiatan');
  renderKegiatanTable();
  renderDashboard();
  updateCharts();
}

function deleteKegiatan(id) {
  if (!checkUserPermission('delete')) return;
  if (confirm('Apakah Anda yakin ingin menghapus catatan kegiatan lapangan ini?')) {
    db.delete('activities', id);
    showToast('Kegiatan telah dihapus.', 'info');
    renderKegiatanTable();
    renderDashboard();
    updateCharts();
  }
}

function viewPhoto(photoId) {
  const p = db.getById('activity_photos', photoId);
  if (!p) return;
  document.getElementById('lightboxImg').src = p.photoData;
  document.getElementById('lightboxCaption').textContent = p.caption;
  document.getElementById('lightboxTimestamp').textContent = `Waktu Pengambilan: ${p.timestamp}`;
  openModal('modalPhotoViewer');
}


/* ==========================================================================
   MODULE 5: TARGET & REALISASI RENDERER
   ========================================================================== */
function renderTargetTable() {
  const targets = db.getAll('targets');
  const tbody = document.getElementById('tableTargetBody');
  tbody.innerHTML = '';

  if (targets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--text-muted);">Belum ada target pekerjaan yang dimasukkan.</td></tr>`;
    return;
  }

  targets.forEach(t => {
    const tr = document.createElement('tr');
    
    let badgeStyle = 'badge-belum';
    let progressColor = '#EF5350';
    if (t.status === 'Tercapai') {
      badgeStyle = 'badge-tercapai';
      progressColor = '#4CAF50';
    } else if (t.status === 'Hampir tercapai') {
      badgeStyle = 'badge-hampir';
      progressColor = '#FFCA28';
    }

    const pct = Number(t.percentage) || 0;

    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700;">${t.date}</td>
      <td><strong>${t.activityType}</strong></td>
      <td><span class="badge badge-izin">${t.block}</span></td>
      <td>${t.targetValue.toLocaleString('id-ID')}</td>
      <td style="font-weight:700; color:var(--accent-gold);">${t.realizationValue.toLocaleString('id-ID')}</td>
      <td>${t.unit}</td>
      <td style="font-family:var(--font-mono); font-weight:800;">${pct}%</td>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="flex:1; background:rgba(255,255,255,0.1); height:8px; border-radius:4px; overflow:hidden; min-width:80px;">
            <div style="width: ${Math.min(pct, 100)}%; background:${progressColor}; height:100%;"></div>
          </div>
          <span class="badge ${badgeStyle}">${t.status}</span>
        </div>
      </td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteTarget('${t.id}')"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleSaveTarget(e) {
  e.preventDefault();
  const date = document.getElementById('targetDate').value;
  const activityType = document.getElementById('targetType').value;
  const block = document.getElementById('targetBlock').value.trim();
  const unit = document.getElementById('targetUnit').value.trim();
  const targetValue = Number(document.getElementById('targetVal').value) || 0;
  const realizationValue = Number(document.getElementById('realizationVal').value) || 0;

  const pct = targetValue > 0 ? Math.round((realizationValue / targetValue) * 100 * 10) / 10 : 0;
  let status = 'Belum tercapai';
  if (pct >= 100) status = 'Tercapai';
  else if (pct >= 70) status = 'Hampir tercapai';

  db.insert('targets', {
    date, activityType, block, unit, targetValue, realizationValue, percentage: pct, status
  });

  showToast('Target Pekerjaan berhasil ditambahkan!', 'success');
  closeModal('modalInputTarget');
  renderTargetTable();
  updateCharts();
}

function deleteTarget(id) {
  if (!checkUserPermission('delete')) return;
  if (confirm('Hapus target pekerjaan ini?')) {
    db.delete('targets', id);
    renderTargetTable();
    updateCharts();
  }
}


/* ==========================================================================
   MODULE 6: ALAT & BAHAN RENDERER
   ========================================================================== */
function switchAlatBahanTab(tab) {
  activeAlatBahanTab = tab;
  document.getElementById('btnTabAlat').className = tab === 'alat' ? 'btn btn-secondary active' : 'btn btn-secondary';
  document.getElementById('btnTabBahan').className = tab === 'bahan' ? 'btn btn-secondary active' : 'btn btn-secondary';
  
  document.getElementById('containerDataAlat').style.display = tab === 'alat' ? 'block' : 'none';
  document.getElementById('containerDataBahan').style.display = tab === 'bahan' ? 'block' : 'none';
}

function renderAlatBahanTables() {
  const tools = db.getAll('tools');
  const materials = db.getAll('materials');

  // Render Tools
  const tbodyAlat = document.getElementById('tableAlatBody');
  tbodyAlat.innerHTML = '';
  tools.forEach(tl => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700;">${tl.id}</td>
      <td><strong>${tl.name}</strong></td>
      <td>${tl.type}</td>
      <td style="font-weight:800; color:var(--primary-light);">${tl.quantity}</td>
      <td>${tl.unit}</td>
      <td><span class="badge ${tl.condition === 'Baik' || tl.condition === 'Sangat Baik' ? 'badge-aktif' : 'badge-sakit'}">${tl.condition}</span></td>
      <td>${tl.usage}</td>
      <td>${tl.lastUsed}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteAlatBahan('tools', '${tl.id}')"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tbodyAlat.appendChild(tr);
  });

  // Render Materials
  const tbodyBahan = document.getElementById('tableBahanBody');
  tbodyBahan.innerHTML = '';
  materials.forEach(mt => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-weight:700;">${mt.id}</td>
      <td><strong>${mt.name}</strong></td>
      <td>${mt.type}</td>
      <td style="font-weight:800; color:var(--accent-gold);">${mt.quantity.toLocaleString('id-ID')}</td>
      <td>${mt.unit}</td>
      <td><span class="badge badge-aktif">${mt.condition}</span></td>
      <td>${mt.usage}</td>
      <td>${mt.lastUsed}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteAlatBahan('materials', '${mt.id}')"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tbodyBahan.appendChild(tr);
  });
}

function openModalAlatBahan() {
  document.getElementById('modalAlatBahanTitle').textContent = activeAlatBahanTab === 'alat' ? 'Tambah Data Alat Kerja' : 'Tambah Data Bahan & Pupuk';
  document.getElementById('abCategory').value = activeAlatBahanTab;
  openModal('modalInputAlatBahan');
}

function handleSaveAlatBahan(e) {
  e.preventDefault();
  const category = document.getElementById('abCategory').value;
  const name = document.getElementById('abNama').value.trim();
  const type = document.getElementById('abJenis').value.trim();
  const quantity = Number(document.getElementById('abJumlah').value) || 0;
  const unit = document.getElementById('abSatuan').value.trim();
  const condition = document.getElementById('abKondisi').value;
  const usage = document.getElementById('abPenggunaan').value.trim();

  const payload = { name, type, quantity, unit, condition, usage, lastUsed: getTodayStr(), notes: '' };

  if (category === 'alat') {
    db.insert('tools', payload);
    showToast(`Alat ${name} berhasil ditambahkan!`, 'success');
  } else {
    db.insert('materials', payload);
    showToast(`Bahan ${name} berhasil ditambahkan!`, 'success');
  }

  closeModal('modalInputAlatBahan');
  renderAlatBahanTables();
}

function deleteAlatBahan(tableName, id) {
  if (!checkUserPermission('delete')) return;
  if (confirm('Hapus inventaris ini?')) {
    db.delete(tableName, id);
    renderAlatBahanTables();
  }
}


/* ==========================================================================
   MODULE 7: LAPORAN HARIAN, EXPORT EXCEL, & PRINT PDF
   ========================================================================== */
function generateReportView() {
  const dateVal = document.getElementById('laporanDate').value || getTodayStr();
  const user = db.getCurrentUser();

  document.getElementById('repDateVal').textContent = formatDateIndo(dateVal);
  document.getElementById('repMandorVal').textContent = `Mandor: ${user.name}`;
  document.getElementById('repSubtitle').textContent = `${user.afdeling} - Buku Catatan Digital Mandor Lapangan`;
  document.getElementById('repSigMandor').textContent = `${user.name} (Mandor)`;

  // Rekap Presensi
  const attendance = db.getAll('attendance').filter(a => a.date === dateVal);
  const totalPekerja = db.getAll('workers').filter(w => w.status === 'aktif').length;
  const hadir = attendance.filter(a => a.status === 'Hadir').length;
  const izin = attendance.filter(a => a.status === 'Izin').length;
  const sakit = attendance.filter(a => a.status === 'Sakit').length;
  const alpha = attendance.filter(a => a.status === 'Alpha').length;
  const pctPresence = totalPekerja > 0 ? Math.round((hadir / totalPekerja) * 100) : 0;

  document.getElementById('repAttendanceRow').innerHTML = `
    <td><strong>${totalPekerja} orang</strong></td>
    <td style="color:#2E7D32; font-weight:700;">${hadir} orang</td>
    <td style="color:#F57F17;">${izin} orang</td>
    <td style="color:#D84315;">${sakit} orang</td>
    <td style="color:#C62828;">${alpha} orang</td>
    <td style="font-weight:800; color:#1B5E20;">${pctPresence}%</td>
  `;

  // Daftar Kegiatan & Hasil
  const activities = db.getAll('activities').filter(a => a.date === dateVal);
  const tbody = document.getElementById('repKegiatanTableBody');
  tbody.innerHTML = '';

  if (activities.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Tidak ada data kegiatan pada tanggal ini.</td></tr>`;
  } else {
    activities.forEach((act, idx) => {
      const tr = document.createElement('tr');
      const toolMat = [act.toolsUsed, act.materialsUsed].filter(Boolean).join(', ');
      const workerCount = act.workerIds ? act.workerIds.length : 1;

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><strong>${act.type}</strong> (${act.team})</td>
        <td>${act.locationBlock}</td>
        <td>${workerCount} org</td>
        <td>${act.targetArea} ${act.unit}</td>
        <td style="font-weight:700; color:#1B5E20;">${act.result} ${act.unit}</td>
        <td>${toolMat || '-'}</td>
        <td>${act.notes || act.status}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Always update charts dynamically when report date changes
  updateCharts();
}

function printLaporan() {
  window.print();
}

function exportToExcel() {
  const dateVal = document.getElementById('laporanDate').value || getTodayStr();
  const activities = db.getAll('activities').filter(a => a.date === dateVal);
  const attendance = db.getAll('attendance').filter(a => a.date === dateVal);

  if (activities.length === 0 && attendance.length === 0) {
    showToast('Tidak ada data untuk diexport pada tanggal ini.', 'warning');
    return;
  }

  const wb = XLSX.utils.book_new();

  // Sheet 1: Kegiatan
  const actData = activities.map(a => ({
    'Tanggal': a.date,
    'Jam': a.time,
    'Jenis Pekerjaan': a.type,
    'Regu': a.team,
    'Pekerja': a.workerNames,
    'Blok': a.locationBlock,
    'Target': a.targetArea,
    'Satuan': a.unit,
    'Realisasi Hasil': a.result,
    'Alat': a.toolsUsed,
    'Bahan': a.materialsUsed,
    'Status': a.status
  }));
  const wsAct = XLSX.utils.json_to_sheet(actData);
  XLSX.utils.book_append_sheet(wb, wsAct, 'Kegiatan Harian');

  // Sheet 2: Absensi
  const attData = attendance.map(a => ({
    'Tanggal': a.date,
    'ID Pekerja': a.workerId,
    'Status Kehadiran': a.status,
    'Jam Masuk': a.checkIn,
    'Jam Selesai': a.checkOut,
    'Keterangan': a.notes
  }));
  const wsAtt = XLSX.utils.json_to_sheet(attData);
  XLSX.utils.book_append_sheet(wb, wsAtt, 'Presensi Pekerja');

  XLSX.writeFile(wb, `Laporan_Mandor_${dateVal}.xlsx`);
  showToast(`File Excel Laporan_Mandor_${dateVal}.xlsx berhasil di-download!`, 'success');
}


/* ==========================================================================
   MODULE 8: REKAP CHARTS & AUDIT LOGS
   ========================================================================== */
function initCharts() {
  const ctxK = document.getElementById('chartKehadiran');
  const ctxP = document.getElementById('chartProduktivitas');
  if (!ctxK || !ctxP) return;

  chartKehadiranInst = new Chart(ctxK, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'Hadir', data: [], borderColor: '#52B788', backgroundColor: 'rgba(82, 183, 136, 0.2)', fill: true, tension: 0.3 },
        { label: 'Absen/Izin/Sakit/Alpha', data: [], borderColor: '#E76F51', backgroundColor: 'rgba(231, 111, 81, 0.1)', tension: 0.3 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#EDF7F3' } } },
      scales: {
        x: { ticks: { color: '#8EAA9E' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#8EAA9E', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });

  chartProduktivitasInst = new Chart(ctxP, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        { label: 'Target TBS (Kg)', data: [], backgroundColor: 'rgba(233, 196, 106, 0.5)', borderColor: '#E9C46A', borderWidth: 1 },
        { label: 'Realisasi TBS (Kg)', data: [], backgroundColor: 'rgba(45, 106, 79, 0.8)', borderColor: '#52B788', borderWidth: 1 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#EDF7F3' } } },
      scales: {
        x: { ticks: { color: '#8EAA9E' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#8EAA9E' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });

  updateCharts();
}

function updateCharts() {
  if (!chartKehadiranInst || !chartProduktivitasInst) return;

  // Reference date from the date picker in Laporan section
  const refDateStr = document.getElementById('laporanDate') ? (document.getElementById('laporanDate').value || getTodayStr()) : getTodayStr();
  const refParts = refDateStr.split('-');
  const refDate = refParts.length === 3 ? new Date(refParts[0], refParts[1] - 1, refParts[2]) : new Date();

  // 1. DYNAMIC REKAP PRESENSI HARIAN MINGGUAN (7 Hari Terakhir dari Tanggal Laporan yang Dipilih)
  const attendanceList = db.getAll('attendance');
  const daysName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  
  const labelsPresensi = [];
  const dataHadir = [];
  const dataAbsen = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(refDate);
    d.setDate(refDate.getDate() - i);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayLabel = `${daysName[d.getDay()]} (${day}/${month})`;
    labelsPresensi.push(dayLabel);

    const dayAtt = attendanceList.filter(a => a.date === dateStr);
    const hadirCount = dayAtt.filter(a => a.status === 'Hadir').length;
    const absenCount = dayAtt.filter(a => a.status !== 'Hadir').length;

    dataHadir.push(hadirCount);
    dataAbsen.push(absenCount);
  }

  chartKehadiranInst.data.labels = labelsPresensi;
  chartKehadiranInst.data.datasets[0].data = dataHadir;
  chartKehadiranInst.data.datasets[1].data = dataAbsen;
  chartKehadiranInst.update();

  // 2. DYNAMIC PRODUKTIVITAS TBS VS TARGET PER BLOK (Mengikuti Tanggal Laporan yang Dipilih)
  const allTargets = db.getAll('targets').filter(t => t.activityType === 'Panen');
  const allHarvestRecords = db.getAll('harvest_records');
  const allActivities = db.getAll('activities').filter(a => a.type === 'Panen');

  // Filter records specifically for the chosen date
  const dateTargets = allTargets.filter(t => t.date === refDateStr);
  const dateActivities = allActivities.filter(a => a.date === refDateStr);
  const dateActivityIds = dateActivities.map(a => a.id);
  const dateHarvestRecords = allHarvestRecords.filter(h => dateActivityIds.includes(h.activityId) || h.date === refDateStr);

  const blockSet = new Set();
  
  // Collect blocks active on the selected date
  dateTargets.forEach(t => { if (t.block) blockSet.add(t.block); });
  dateHarvestRecords.forEach(h => { if (h.block) blockSet.add(h.block); });
  dateActivities.forEach(a => { if (a.locationBlock) blockSet.add(a.locationBlock); });

  // If no specific activity on selected date, show all registered blocks for visibility
  if (blockSet.size === 0) {
    allTargets.forEach(t => { if (t.block) blockSet.add(t.block); });
    allActivities.forEach(a => { if (a.locationBlock) blockSet.add(a.locationBlock); });
  }

  let blocks = Array.from(blockSet);
  if (blocks.length === 0) {
    blocks = ['Blok A12', 'Blok B05', 'Blok C02'];
  }

  const targetData = [];
  const realData = [];

  blocks.forEach(blk => {
    // Target for this block on selected date
    let blkTargets = dateTargets.filter(t => t.block === blk);
    if (blkTargets.length === 0) {
      blkTargets = allTargets.filter(t => t.block === blk);
    }
    const totalTarget = blkTargets.reduce((sum, t) => sum + (Number(t.targetValue) || 0), 0);

    // Harvest realization for this block on selected date
    const blkHarvests = dateHarvestRecords.filter(h => h.block === blk);
    let totalReal = blkHarvests.reduce((sum, h) => sum + (Number(h.totalTbsWeight) || 0), 0);

    if (totalReal === 0) {
      const blkActs = dateActivities.filter(a => a.locationBlock === blk);
      totalReal = blkActs.reduce((sum, a) => sum + (Number(a.result) || 0), 0);
    }

    targetData.push(totalTarget);
    realData.push(totalReal);
  });

  chartProduktivitasInst.data.labels = blocks;
  chartProduktivitasInst.data.datasets[0].data = targetData;
  chartProduktivitasInst.data.datasets[1].data = realData;
  chartProduktivitasInst.update();
}

function renderAuditLogsTable() {
  const logs = db.getAll('activity_logs');
  const tbody = document.getElementById('tableAuditLogsBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  logs.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family:var(--font-mono); font-size:0.8rem;">${log.timestamp}</td>
      <td><strong>${log.user}</strong></td>
      <td><span class="badge badge-izin">${log.role}</span></td>
      <td><span class="badge badge-tercapai">${log.action}</span></td>
      <td><small>${log.details}</small></td>
    `;
    tbody.appendChild(tr);
  });
}

function updateUserSettings() {
  const name = document.getElementById('settingMandorName').value.trim();
  const afdeling = document.getElementById('settingAfdeling').value.trim();

  const user = db.getCurrentUser();
  user.name = name;
  user.afdeling = afdeling;
  db.setCurrentUser(user);

  syncUserProfileUI(user);
  renderDashboard();
  generateReportView();
  showToast('Pengaturan nama & afdeling berhasil diperbarui!', 'success');
}

function resetDatabaseToSeed() {
  if (confirm('Apakah Anda benar-benar yakin ingin mereset seluruh data aplikasi ke data awal (Seed Sample)? Data yang baru diinput akan terhapus.')) {
    db.resetToDefault();
    showToast('Database berhasil di-reset ke data seed default.', 'info');
    initApp();
  }
}


/* ==========================================================================
   UTILITY HELPERS (MODALS, TOASTS, DATE FORMAT)
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    if (modalId === 'modalInputKegiatan') {
      populatePekerjaCheckboxes();
      toggleSubtypeForms(document.getElementById('kegiatanType').value);
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';
  if (type === 'danger') icon = 'fa-circle-xmark';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function getTodayStr() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const day = parseInt(parts[2], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const year = parts[0];
  return `${day} ${months[monthIdx]} ${year}`;
}
