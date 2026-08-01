<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Pencatatan Bulanan</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Catatan Bulanan</h1>
            <p>Sistem Pencatatan Keuangan & Inventaris Barang</p>
        </header>

        <main class="grid-layout">
            <!-- Bagian Keuangan -->
            <section class="card">
                <h2>Pencatatan Keuangan</h2>
                <form id="form-keuangan">
                    <div class="form-group">
                        <label>Tanggal</label>
                        <input type="date" id="tgl-uang" required>
                    </div>
                    <div class="form-group">
                        <label>Jenis</label>
                        <select id="jenis-uang" required>
                            <option value="Masuk">Pemasukan (Masuk)</option>
                            <option value="Keluar">Pengeluaran (Keluar)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Keterangan</label>
                        <input type="text" id="ket-uang" placeholder="Contoh: Gaji, Makan, dll" required>
                    </div>
                    <div class="form-group">
                        <label>Nominal (Rp)</label>
                        <input type="number" id="nominal-uang" placeholder="0" required>
                    </div>
                    <button type="submit" class="btn">Simpan Uang</button>
                </form>

                <div class="table-container">
                    <table id="tabel-keuangan">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Keterangan</th>
                                <th>Jenis</th>
                                <th>Nominal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Data akan dimuat dari Firebase -->
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Bagian Barang -->
            <section class="card">
                <h2>Pencatatan Barang</h2>
                <form id="form-barang">
                    <div class="form-group">
                        <label>Tanggal</label>
                        <input type="date" id="tgl-barang" required>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="jenis-barang" required>
                            <option value="Masuk">Barang Masuk</option>
                            <option value="Keluar">Barang Keluar</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nama Barang</label>
                        <input type="text" id="nama-barang" placeholder="Contoh: Kertas HVS, Tinta" required>
                    </div>
                    <div class="form-group">
                        <label>Jumlah (Qty)</label>
                        <input type="number" id="qty-barang" placeholder="0" required>
                    </div>
                    <button type="submit" class="btn">Simpan Barang</button>
                </form>

                <div class="table-container">
                    <table id="tabel-barang">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Nama Barang</th>
                                <th>Status</th>
                                <th>Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Data akan dimuat dari Firebase -->
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>

    <!-- Gunakan type="module" untuk Firebase SDK v9 -->
    <script type="module" src="app.js"></script>
</body>
</html>
