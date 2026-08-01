// Import Firebase SDK (V9 Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOJ5P8zm0G75YysaYCjCcXUbLfd2tQgW8",
  authDomain: "catatan--bulanan.firebaseapp.com",
  databaseURL: "https://catatan--bulanan-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "catatan--bulanan",
  storageBucket: "catatan--bulanan.firebasestorage.app",
  messagingSenderId: "521314540948",
  appId: "1:521314540948:web:6eb847771a7818aedb8381",
  measurementId: "G-CG0XZ01WJ2"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referensi Database
const keuanganRef = ref(db, 'keuangan');
const barangRef = ref(db, 'barang');

const filterBulan = document.getElementById('filter-bulan');

// Atur filter bulan ke bulan saat ini
const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
filterBulan.value = currentMonth;

let dataKeuangan = [];
let dataBarang = [];

// Ambil data Keuangan
onValue(keuanganRef, (snapshot) => {
    dataKeuangan = [];
    snapshot.forEach(child => { dataKeuangan.push(child.val()); });
    kalkulasiRekap(); 
});

// Ambil data Barang
onValue(barangRef, (snapshot) => {
    dataBarang = [];
    snapshot.forEach(child => { dataBarang.push(child.val()); });
    kalkulasiRekap();
});

filterBulan.addEventListener('change', kalkulasiRekap);

function kalkulasiRekap() {
    const bulanDipilih = filterBulan.value; // Format: YYYY-MM

    // 1. KALKULASI KEUANGAN
    let totalMasuk = 0;
    let totalKeluar = 0;

    dataKeuangan.forEach(item => {
        if (item.tanggal && item.tanggal.startsWith(bulanDipilih)) {
            if (item.jenis === 'Masuk') totalMasuk += parseInt(item.nominal);
            if (item.jenis === 'Keluar') totalKeluar += parseInt(item.nominal);
        }
    });

    const saldo = totalMasuk - totalKeluar;

    document.getElementById('total-masuk').innerText = `Rp ${totalMasuk.toLocaleString('id-ID')}`;
    document.getElementById('total-keluar').innerText = `Rp ${totalKeluar.toLocaleString('id-ID')}`;
    
    const saldoEl = document.getElementById('saldo-bersih');
    saldoEl.innerText = `Rp ${saldo.toLocaleString('id-ID')}`;
    saldoEl.style.color = saldo >= 0 ? '#27ae60' : '#e74c3c';

    // 2. KALKULASI BARANG
    let rekapBarang = {};

    dataBarang.forEach(item => {
        if (item.tanggal && item.tanggal.startsWith(bulanDipilih)) {
            const namaBarang = item.nama.toLowerCase().trim(); 
            
            if (!rekapBarang[namaBarang]) {
                rekapBarang[namaBarang] = { nama: item.nama, masuk: 0, keluar: 0 };
            }

            if (item.jenis === 'Masuk') rekapBarang[namaBarang].masuk += parseInt(item.qty);
            if (item.jenis === 'Keluar') rekapBarang[namaBarang].keluar += parseInt(item.qty);
        }
    });

    const tbodyBarang = document.querySelector('#tabel-rekap-barang tbody');
    tbodyBarang.innerHTML = ''; 
    
    for (let key in rekapBarang) {
        const b = rekapBarang[key];
        const sisaStok = b.masuk - b.keluar;
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td style="text-transform: capitalize;">${b.nama}</td>
            <td class="badge-masuk">${b.masuk}</td>
            <td class="badge-keluar">${b.keluar}</td>
            <td style="font-weight: bold; color: ${sisaStok < 0 ? '#e74c3c' : '#333'}">${sisaStok}</td>
        `;
        tbodyBarang.appendChild(row);
    }

    if (Object.keys(rekapBarang).length === 0) {
        tbodyBarang.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#7f8c8d;">Tidak ada transaksi barang di bulan ini.</td></tr>`;
    }
}
