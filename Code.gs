/**
 * 🗄️ Backend Google Sheets — Absen Ustadz
 * ============================================
 * Deploy ke Apps Script, copy URL, paste ke HTML.
 * 
 * Deploy: Deploy → New Deployment → Web App
 * Execute as: Me, Access: Anyone
 */

var SHEET_GURU = 'daftar_guru';
var SHEET_ABSENSI = 'data_absensi';
var SHEET_PENGATURAN = 'pengaturan';

function doGet(e) {
  var a = e && e.parameter && e.parameter.action;
  var out = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  if (a === 'ping') {
    out.setContent(JSON.stringify({status:'ok'}));
  } else if (a === 'get_all') {
    out.setContent(JSON.stringify({
      daftar_guru: getDaftarGuru(),
      data_absensi: getDataAbsensi(),
      pengaturan: getPengaturan()
    }));
  } else {
    out.setContent(JSON.stringify({status:'ok', message:'Gunakan ?action=ping|get_all'}));
  }
  return out;
}

function doPost(e) {
  var out = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  try {
    var b = JSON.parse(e.postData.contents);
    var a = b.action, d = b.data || {};
    if (a === 'save_all') {
      if (d.daftar_guru) simpanDaftarGuru(d.daftar_guru);
      if (d.data_absensi) simpanDataAbsensi(d.data_absensi);
      if (d.pengaturan) simpanPengaturan(d.pengaturan);
      out.setContent(JSON.stringify({success:true}));
    } else {
      out.setContent(JSON.stringify({success:false, message:'Unknown: '+a}));
    }
  } catch(err) {
    out.setContent(JSON.stringify({success:false, message:''+err}));
  }
  return out;
}

function getDaftarGuru() {
  var s = getOrCreateSheet(SHEET_GURU, ['Nama Guru']);
  var d = s.getDataRange().getValues();
  var r = [];
  for (var i = 1; i < d.length; i++) {
    var n = (d[i][0]||'').toString().trim();
    if (n) r.push(n);
  }
  if (r.length === 0) { r = DEFAULT_GURU(); simpanDaftarGuru(r); }
  return r;
}

function simpanDaftarGuru(list) {
  var s = getOrCreateSheet(SHEET_GURU, ['Nama Guru']);
  s.clearContents();
  var rows = [['Nama Guru']];
  for (var i = 0; i < list.length; i++) rows.push([list[i]]);
  if (rows.length > 1) s.getRange(1,1,rows.length,1).setValues(rows);
}

function getDataAbsensi() {
  var s = getOrCreateSheet(SHEET_ABSENSI, ['id','tanggal','guru','jam1','jam2','jam3','jam4','jam5','jam6','jam7','createdAt']);
  var d = s.getDataRange().getValues();
  var r = [];
  for (var i = 1; i < d.length; i++) {
    if (!d[i][1]) continue;
    var jam = {};
    for (var j = 1; j <= 7; j++) jam[j] = d[i][j+2] ? d[i][j+2].toString() : 'Alpha';
    r.push({id:''+d[i][0], tanggal:''+d[i][1], guru:''+d[i][2], jam:jam, createdAt:''+(d[i][10]||'')});
  }
  return r;
}

function simpanDataAbsensi(list) {
  var s = getOrCreateSheet(SHEET_ABSENSI, ['id','tanggal','guru','jam1','jam2','jam3','jam4','jam5','jam6','jam7','createdAt']);
  s.clearContents();
  var h = [['id','tanggal','guru','jam1','jam2','jam3','jam4','jam5','jam6','jam7','createdAt']];
  var rows = [];
  for (var i = 0; i < list.length; i++) {
    var x = list[i];
    rows.push([x.id||'',x.tanggal||'',x.guru||'',
      (x.jam&&x.jam[1])||'Alpha',(x.jam&&x.jam[2])||'Alpha',(x.jam&&x.jam[3])||'Alpha',
      (x.jam&&x.jam[4])||'Alpha',(x.jam&&x.jam[5])||'Alpha',(x.jam&&x.jam[6])||'Alpha',
      (x.jam&&x.jam[7])||'Alpha',x.createdAt||'']);
  }
  if (rows.length > 0) { s.getRange(1,1,1,11).setValues(h); s.getRange(2,1,rows.length,11).setValues(rows); }
}

function getPengaturan() {
  var s = getOrCreateSheet(SHEET_PENGATURAN, ['key','value']);
  var d = s.getDataRange().getValues();
  var r = {};
  for (var i = 1; i < d.length; i++) {
    var k = (d[i][0]||'').toString().trim();
    var v = d[i][1] ? d[i][1].toString() : '';
    if (k) { try { r[k] = JSON.parse(v); } catch(e) { r[k] = v; } }
  }
  return r;
}

function simpanPengaturan(obj) {
  var s = getOrCreateSheet(SHEET_PENGATURAN, ['key','value']);
  var lr = s.getLastRow();
  if (lr > 1) s.getRange(2,1,lr-1,2).clearContent();
  var rows = [['key','value']];
  if (obj.label_jam) rows.push(['label_jam', JSON.stringify(obj.label_jam)]);
  if (obj.admin_password) rows.push(['admin_password', obj.admin_password]);
  if (obj.header_data) rows.push(['header_data', JSON.stringify(obj.header_data)]);
  if (obj.logo_data) rows.push(['logo_data', obj.logo_data]);
  if (rows.length > 1) s.getRange(1,1,rows.length,2).setValues(rows);
}

function DEFAULT_GURU() {
  return ['Ahmad Fauzi, S.Pd.I','Nurul Hidayah, S.Pd','Muhammad Rizki, S.Kom','Siti Aisyah, S.Ag',
    'Bambang Supriyadi, S.Pd','Dewi Sartika, S.Si','Hasan Basri, S.Pd.I','Fitriani Lubis, S.Pd',
    'Rudi Hartono, S.E','Zainab Harahap, S.Ag','Abdul Malik, S.Pd','Rina Marlina, S.Si',
    'Syahrul Ramadhan, S.Kom','Mardiah Nasution, S.Pd.I','Irfan Maulana, S.Pd','Tuti Alawiyah, S.Ag'];
}

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      s.getRange(1,1,1,headers.length).setValues([headers]);
      s.getRange(1,1,1,headers.length).setFontWeight('bold');
    }
  }
  return s;
}
