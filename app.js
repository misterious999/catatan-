// Import Firebase SDK (V9 Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

// Konfigurasi Firebase milikmu (sesuai screenshot)
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

// ==========================================
// LOGIKA PENCATATAN KEUANGAN
// ==========================================
document.getElementById('form-keuangan').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        tanggal: document.getElementById('tgl-uang').value,
        jenis: document.getElementById('jenis-uang').value,
        keterangan: document.getElementById('ket-uang').value,
        nominal: document.getElementById('nominal-uang').value,
        timestamp: Date.now()
    };

    push(keuanganRef, data).then(() => {
        // Pop-up sukses dengan SweetAlert2
        Swal.fire({
            title: "Mantap!",
            text: "Data Keuangan Berhasil Disimpan!",
            icon: "success",
            confirmButtonColor: "#3498db",
            confirmButtonText: "Oke, Lanjut!"
        });
        document.getElementById('form-keuangan').reset();
    }).catch((error) => {
        Swal.fire({
            title: "Waduh!",
            text: "Gagal menyimpan data keuangan.",
            icon: "error"
        });
        console.error("Error:", error);
    });
});

// Menampilkan Data Keuangan (Realtime)
onValue(keuanganRef, (snapshot) => {
    const tbody = document.querySelector('#tabel-keuangan tbody');
    tbody.innerHTML = ''; 
    
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const row = document.createElement('tr');
        
        const kelasJenis = data.jenis === 'Masuk' ? 'badge-masuk' : 'badge-keluar';
        
        row.innerHTML = `
            <td>${data.tanggal}</td>
            <td>${data.keterangan}</td>
            <td class="${kelasJenis}">${data.jenis}</td>
            <td>Rp ${parseInt(data.nominal).toLocaleString('id-ID')}</td>
        `;
        tbody.prepend(row); // Prepend agar data terbaru di atas
    });
});

// ==========================================
// LOGIKA PENCATATAN BARANG
// ==========================================
document.getElementById('form-barang').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        tanggal: document.getElementById('tgl-barang').value,
        jenis: document.getElementById('jenis-barang').value,
        nama: document.getElementById('nama-barang').value,
        qty: document.getElementById('qty-barang').value,
        timestamp: Date.now()
    };

    push(barangRef, data).then(() => {
        // Pop-up sukses dengan SweetAlert2
        Swal.fire({
            title: "Berhasil!",
            text: "Data Barang Berhasil Disimpan!",
            icon: "success",
            confirmButtonColor: "#27ae60",
            confirmButtonText: "Sip!"
        });
        document.getElementById('form-barang').reset();
    }).catch((error) => {
        Swal.fire({
            title: "Waduh!",
            text: "Gagal menyimpan data barang.",
            icon: "error"
        });
        console.error("Error:", error);
    });
});

// Menampilkan Data Barang (Realtime)
onValue(barangRef, (snapshot) => {
    const tbody = document.querySelector('#tabel-barang tbody');
    tbody.innerHTML = ''; 
    
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const row = document.createElement('tr');
        
        const kelasJenis = data.jenis === 'Masuk' ? 'badge-masuk' : 'badge-keluar';
        
        row.innerHTML = `
            <td>${data.tanggal}</td>
            <td>${data.nama}</td>
            <td class="${kelasJenis}">${data.jenis}</td>
            <td>${data.qty}</td>
        `;
        tbody.prepend(row);
    });
});
