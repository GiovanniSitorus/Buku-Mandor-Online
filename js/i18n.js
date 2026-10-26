/**
 * Internationalization (i18n) Engine - Buku Mandor Digital
 * Bahasa Indonesia (ID) & English (EN) Multi-Language Support
 */

const LANG_KEY = 'buku_mandor_lang_v1';

const translations = {
  id: {
    brand_title: "Buku Mandor",
    brand_subtitle: "Digital Perkebunan",
    nav_dashboard: "Dashboard",
    nav_pekerja: "Data Pekerja",
    nav_presensi: "Presensi",
    nav_kegiatan: "Kegiatan Harian",
    nav_target: "Target & Realisasi",
    nav_alat: "Alat & Bahan",
    nav_laporan: "Laporan Harian",
    nav_pengaturan: "Pengaturan & Audit",
    
    // Headings
    head_dashboard: "Dashboard Utama",
    sub_dashboard: "Overview kegiatan & produktivitas lapangan hari ini",
    head_pekerja: "Data Pekerja Lapangan",
    sub_pekerja: "Manajemen daftar pekerja, NIK, regu, dan status",
    head_presensi: "Presensi Harian Pekerja",
    sub_presensi: "Pencatatan kehadiran 1-klik, izin, sakit, dan alpha",
    head_kegiatan: "Buku Kegiatan Harian",
    sub_kegiatan: "Pencatatan hasil panen, pemupukan, gulma, dan lokasi blok",
    head_target: "Target & Realisasi Pekerjaan",
    sub_target: "Pencapaian persentase target vs hasil lapangan",
    head_alat: "Inventaris Alat & Bahan",
    sub_alat: "Stok alat panen, pupuk, dan pestisida afdeling",
    head_laporan: "Laporan Harian Mandor",
    sub_laporan: "Cetak laporan resmi, PDF, dan export Excel",
    head_pengaturan: "Pengaturan & Audit Logs",
    sub_pengaturan: "Riwayat perubahan sistem dan konfigurasi afdeling",

    // Dashboard Banner & Metrics
    dash_welcome: "Mandor Supriatna",
    btn_new_activity: "Catat Kegiatan Baru",
    stat_hadir: "Pekerja Hadir",
    stat_absen: "Tidak Hadir (Izin/Sakit/Alpha)",
    stat_total_pekerja: "Total Pekerja",
    stat_total_pekerjaan: "Total Pekerjaan Hari Ini",
    stat_total_hasil: "Total Hasil TBS Terpanen",
    stat_pending: "Pekerjaan Belum Selesai",
    title_ringkasan_kegiatan: "Ringkasan Kegiatan Hari Ini",
    btn_view_all_kegiatan: "Lihat Semua Kegiatan",

    // Table Headers General
    th_waktu: "Waktu",
    th_jenis_pekerjaan: "Jenis Pekerjaan",
    th_regu: "Regu / Kelompok",
    th_lokasi_blok: "Lokasi / Blok",
    th_target: "Target",
    th_hasil_realisasi: "Hasil Realisasi",
    th_status: "Status",
    th_aksi: "Aksi",
    th_nama_pekerja: "Nama Pekerja",
    th_nik: "NIK / No. Pekerja",
    th_jabatan: "Jabatan",
    th_gender: "L/P",
    th_afdeling: "Afdeling",
    th_kehadiran: "Status Kehadiran",
    th_jam_masuk: "Jam Masuk",
    th_jam_selesai: "Jam Selesai",
    th_keterangan: "Keterangan",

    // Buttons & Labels
    btn_tambah_pekerja: "Tambah Pekerja",
    btn_hadir_semua: "Hadir Semua (1-Klik)",
    btn_simpan_presensi: "Simpan Presensi",
    btn_input_kegiatan: "Input Kegiatan Lapangan",
    btn_tambah_target: "Tambah Target Pekerjaan",
    btn_data_alat: "Data Alat Kerja",
    btn_data_bahan: "Data Bahan & Pupuk/Herbisida",
    btn_tambah_inventaris: "Tambah Inventaris",
    btn_export_excel: "Export Excel",
    btn_cetak_pdf: "Cetak / Download PDF",
    btn_reset_seed: "Reset Ke Seed Data Awal",
    btn_batal: "Batal",
    btn_simpan: "Simpan Data",
    btn_pilih_semua: "Pilih Semua",
    btn_kosongkan: "Kosongkan",

    // Theme & Role labels
    theme_dark: "Mode Gelap",
    theme_light: "Mode Terang",
    role_label: "Role",
    select_all_workers: "Pilih Pekerja Bertugas",
    all_members: "Total Semua Anggota Pekerja",

    // Report Sheet Titles
    rep_main_title: "LAPORAN HARIAN MANDOR PERKEBUNAN",
    rep_sec_1: "I. REKAP PRESENSI & KEHADIRAN TENAGA KERJA",
    rep_sec_2: "II. DAFTAR PEKERJAAN & REALISASI HASIL LAPANGAN",
    rep_chart_1: "Rekap Presensi / Kehadiran Mingguan",
    rep_chart_2: "Produktivitas TBS vs Target",

    // Toast Messages
    toast_role_switched: "Berhasil beralih ke Mode Akses",
    toast_all_present: "Semua pekerja ditandai HADIR!",
    toast_presensi_saved: "Data Presensi berhasil disimpan!",
    toast_kegiatan_saved: "Kegiatan lapangan berhasil disimpan!",
    toast_target_saved: "Target Pekerjaan berhasil ditambahkan!",
    toast_reset_success: "Database berhasil di-reset ke data default.",
    toast_access_denied: "Akses Ditolak: Hak akses terbatas."
  },
  en: {
    brand_title: "Foreman Book",
    brand_subtitle: "Digital Plantation",
    nav_dashboard: "Dashboard",
    nav_pekerja: "Workers Data",
    nav_presensi: "Attendance",
    nav_kegiatan: "Daily Activities",
    nav_target: "Targets & Realization",
    nav_alat: "Tools & Materials",
    nav_laporan: "Daily Reports",
    nav_pengaturan: "Settings & Audit",
    
    // Headings
    head_dashboard: "Main Dashboard",
    sub_dashboard: "Overview of today's field activities & productivity",
    head_pekerja: "Field Workers Data",
    sub_pekerja: "Manage worker roster, NIK, teams, and active status",
    head_presensi: "Daily Worker Attendance",
    sub_presensi: "1-click presence logging, leaves, sick notes, and absences",
    head_kegiatan: "Daily Log Book",
    sub_kegiatan: "Record harvest yields, fertilization, weed control, and blocks",
    head_target: "Job Target & Realization",
    sub_target: "Percentage achievement of targets vs field realization",
    head_alat: "Tools & Materials Inventory",
    sub_alat: "Stock of harvest tools, fertilizers, and herbicides",
    head_laporan: "Foreman Daily Report",
    sub_laporan: "Print official report sheet, download PDF, and export Excel",
    head_pengaturan: "Settings & Audit Logs",
    sub_pengaturan: "System change history and division configuration",

    // Dashboard Banner & Metrics
    dash_welcome: "Foreman Supriatna",
    btn_new_activity: "Record New Activity",
    stat_hadir: "Workers Present",
    stat_absen: "Absent (Leave/Sick/Alpha)",
    stat_total_pekerja: "Total Workers",
    stat_total_pekerjaan: "Total Jobs Today",
    stat_total_hasil: "Total FFB Yield Harvested",
    stat_pending: "Pending / In Progress Jobs",
    title_ringkasan_kegiatan: "Today's Activities Summary",
    btn_view_all_kegiatan: "View All Activities",

    // Table Headers General
    th_waktu: "Time",
    th_jenis_pekerjaan: "Job Type",
    th_regu: "Team / Group",
    th_lokasi_blok: "Location / Block",
    th_target: "Target",
    th_hasil_realisasi: "Yield Realization",
    th_status: "Status",
    th_aksi: "Action",
    th_nama_pekerja: "Worker Name",
    th_nik: "NIK / Employee ID",
    th_jabatan: "Position",
    th_gender: "M/F",
    th_afdeling: "Division",
    th_kehadiran: "Attendance Status",
    th_jam_masuk: "Check In",
    th_jam_selesai: "Check Out",
    th_keterangan: "Notes",

    // Buttons & Labels
    btn_tambah_pekerja: "Add Worker",
    btn_hadir_semua: "Mark All Present (1-Click)",
    btn_simpan_presensi: "Save Attendance",
    btn_input_kegiatan: "Record Field Activity",
    btn_tambah_target: "Add Job Target",
    btn_data_alat: "Tools Data",
    btn_data_bahan: "Materials & Fertilizers Data",
    btn_tambah_inventaris: "Add Inventory Item",
    btn_export_excel: "Export Excel",
    btn_cetak_pdf: "Print / Download PDF",
    btn_reset_seed: "Reset to Default Seed Data",
    btn_batal: "Cancel",
    btn_simpan: "Save Data",
    btn_pilih_semua: "Select All",
    btn_kosongkan: "Clear All",

    // Theme & Role labels
    theme_dark: "Dark Mode",
    theme_light: "Light Mode",
    role_label: "Role",
    select_all_workers: "Select Assigned Workers",
    all_members: "All Active Worker Members",

    // Report Sheet Titles
    rep_main_title: "PLANTATION FOREMAN DAILY REPORT",
    rep_sec_1: "I. WORKFORCE ATTENDANCE SUMMARY",
    rep_sec_2: "II. FIELD ACTIVITIES & YIELD REALIZATION LIST",
    rep_chart_1: "Weekly Attendance Summary",
    rep_chart_2: "FFB Productivity vs Target",

    // Toast Messages
    toast_role_switched: "Switched to Access Mode",
    toast_all_present: "All workers marked PRESENT!",
    toast_presensi_saved: "Attendance data saved successfully!",
    toast_kegiatan_saved: "Field activity saved successfully!",
    toast_target_saved: "Job target added successfully!",
    toast_reset_success: "Database reset to default seed data.",
    toast_access_denied: "Access Denied: Restricted permission."
  }
};

class I18nEngine {
  constructor() {
    this.currentLang = localStorage.getItem(LANG_KEY) || 'id';
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem(LANG_KEY, lang);
      this.applyTranslations();
    }
  }

  t(key) {
    const langDict = translations[this.currentLang] || translations.id;
    return langDict[key] || translations.id[key] || key;
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) {
        if (el.tagName === 'INPUT' && el.type === 'placeholder') {
          el.placeholder = text;
        } else {
          // preserve inner icon if exists
          const icon = el.querySelector('i');
          if (icon) {
            const iconHtml = icon.outerHTML;
            el.innerHTML = `${iconHtml} ${text}`;
          } else {
            el.textContent = text;
          }
        }
      }
    });

    // Sync select dropdown if exists
    const langSelect = document.getElementById('langSelector');
    if (langSelect) {
      langSelect.value = this.currentLang;
    }
  }
}

const i18n = new I18nEngine();
window.i18n = i18n;
