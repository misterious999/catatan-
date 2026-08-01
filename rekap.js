import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const keuanganRef = ref(db, 'keuangan');
const filterBulan = document.getElementById('filter-bulan');

// Set ke bulan saat ini
const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
filterBulan.value = currentMonth;

let dataKeuangan = [];

onValue(keuanganRef, (snapshot) => {
    dataKeuangan = [];
    snapshot.forEach(child => { dataKeuangan.push(child.val()); });
    kalkulasiRekap(); 
});

filterBulan.addEventListener('change', kalkulasiRekap);

function kalkulasiRekap() {
    const bulanDipilih = filterBulan.value;
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
    
    // Warna saldo bersih
    if (saldo > 0) {
        saldoEl.style.color = '#69f0ae'; // hijau
    } else if (saldo < 0) {
        saldoEl.style.color = '#ff5252'; // merah
    } else {
        saldoEl.style.color = '#ffffff'; // putih
    }
}
