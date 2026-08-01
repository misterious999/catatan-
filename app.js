import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
// Tambahkan 'remove' di impor di bawah ini
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

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

// 1. TAMBAH DATA
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
        Swal.fire({
            title: "Tersimpan!",
            text: "Data Keuangan berhasil dicatat.",
            icon: "success",
            background: '#1e272e',
            color: '#fff',
            confirmButtonColor: "#3498db"
        });
        document.getElementById('form-keuangan').reset();
    }).catch((error) => {
        Swal.fire("Error!", "Gagal menyimpan data.", "error");
        console.error("Error:", error);
    });
});

// 2. BACA & TAMPILKAN DATA
onValue(keuanganRef, (snapshot) => {
    const tbody = document.querySelector('#tabel-keuangan tbody');
    tbody.innerHTML = ''; 
    
    snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key; // Kunci unik dari Firebase
        const data = childSnapshot.val();
        const row = document.createElement('tr');
        
        const kelasJenis = data.jenis === 'Masuk' ? 'badge-masuk' : 'badge-keluar';
        
        row.innerHTML = `
            <td>${data.tanggal}</td>
            <td>${data.keterangan}</td>
            <td class="${kelasJenis}">${data.jenis}</td>
            <td>Rp ${parseInt(data.nominal).toLocaleString('id-ID')}</td>
            <td><button class="btn-hapus" data-key="${key}">Hapus</button></td>
        `;
        tbody.prepend(row);
    });
});

// 3. HAPUS DATA
document.querySelector('#tabel-keuangan tbody').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-hapus')) {
        const key = e.target.getAttribute('data-key');
        
        Swal.fire({
            title: 'Hapus Data?',
            text: "Data ini tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            background: '#1e272e',
            color: '#fff',
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#7f8c8d',
            confirmButtonText: 'Ya, Hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                const itemRef = ref(db, 'keuangan/' + key);
                remove(itemRef).then(() => {
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Data berhasil dihapus.',
                        icon: 'success',
                        background: '#1e272e',
                        color: '#fff'
                    });
                });
            }
        });
    }
});
