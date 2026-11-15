document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'nanda_service_data';

    // Data Dummy Awal jika localStorage masih kosong
    const defaultData = [
        {
            noNota: 'SRV-20261113-001',
            sumber: 'offline', // offline atau online
            tanggal: '2026-11-13',
            nama: 'Baskara Putra',
            noHp: '081298765432',
            alamat: 'Telukjambe, Karawang',
            jenis: 'Laptop',
            merkTipe: 'ASUS ExpertBook P3',
            nomorSeri: 'SN-EXP39921',
            keluhan: 'Blue screen saat buka aplikasi berat',
            tindakan: '-',
            biayaJasa: 0,
            biayaSparepart: 0,
            totalBiaya: 0,
            status: 'Menunggu Diagnosa'
        },
        {
            noNota: 'SRV-20261113-002',
            sumber: 'online', // Contoh data yang didaftarkan lewat web oleh pelanggan
            tanggal: '2026-11-13',
            nama: 'Meidiana',
            noHp: '085712349876',
            alamat: 'Klari, Karawang',
            jenis: 'Laptop',
            merkTipe: 'Lenovo IdeaPad Slim 3',
            nomorSeri: 'SN-LNV88210',
            keluhan: 'Minta upgrade SSD NVMe 512GB',
            tindakan: 'Pemasangan SSD NVMe 512GB + Install Ulang',
            biayaJasa: 100000,
            biayaSparepart: 650000,
            totalBiaya: 750000,
            status: 'Siap Diambil'
        }
    ];

    let serviceList = [];
    let activePaymentIndex = null;

    // Inisialisasi Data
    function initKasir() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            serviceList = JSON.parse(saved);
        } else {
            serviceList = defaultData;
            saveData();
        }

        // Tampilkan Tanggal Hari Ini
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('id-ID', options);

        updatePreviewNota();
        renderTabel();
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serviceList));
    }

    // Generator Nomor Nota Otomatis
    function generateNomorNota() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const urutan = String(serviceList.length + 1).padStart(3, '0');
        return `SRV-${yyyy}${mm}${dd}-${urutan}`;
    }

    function updatePreviewNota() {
        const preview = document.getElementById('previewNota');
        if (preview) preview.textContent = generateNomorNota();
    }

    // Form Pendaftaran Offline oleh Kasir
    const formPendaftaran = document.getElementById('formPendaftaran');
    if (formPendaftaran) {
        formPendaftaran.addEventListener('submit', (e) => {
            e.preventDefault();

            const now = new Date().toISOString().split('T')[0];
            const newNota = generateNomorNota();

            const newItem = {
                noNota: newNota,
                sumber: 'offline', // Ditandai sebagai pendaftaran offline oleh kasir
                tanggal: now,
                nama: document.getElementById('namaPelanggan').value.trim(),
                noHp: document.getElementById('noHp').value.trim(),
                alamat: document.getElementById('alamat').value.trim(),
                jenis: document.getElementById('jenisPerangkat').value,
                merkTipe: document.getElementById('merkTipe').value.trim(),
                nomorSeri: document.getElementById('nomorSeri').value.trim(),
                keluhan: document.getElementById('keluhan').value.trim(),
                tindakan: '-',
                biayaJasa: 0,
                biayaSparepart: 0,
                totalBiaya: 0,
                status: 'Menunggu Diagnosa'
            };

            serviceList.unshift(newItem);
            saveData();

            formPendaftaran.reset();
            updatePreviewNota();
            renderTabel();

            // Cetak Nota Awal Otomatis
            cetakNota(0, 'awal');
        });
    }

    // Render Tabel Terpusat (Online & Offline)
    window.renderTabel = function() {
        const tbody = document.getElementById('tabelServisBody');
        const searchInput = document.getElementById('searchInput');
        if (!tbody) return;

        const keyword = searchInput ? searchInput.value.toLowerCase() : '';
        tbody.innerHTML = '';

        let countMenunggu = 0;
        let countSiap = 0;
        let countLunas = 0;

        serviceList.forEach((item, index) => {
            if (item.status === 'Menunggu Diagnosa') countMenunggu++;
            if (item.status === 'Siap Diambil') countSiap++;
            if (item.status === 'Selesai & Lunas') countLunas++;

            if (keyword && !item.noNota.toLowerCase().includes(keyword) && !item.nama.toLowerCase().includes(keyword)) {
                return;
            }

            // Badge status
            let badgeClass = '';
            let statusText = item.status;
            if (item.status === 'Menunggu Diagnosa') badgeClass = 'status-menunggu';
            else if (item.status === 'Siap Diambil') badgeClass = 'status-siap';
            else badgeClass = 'status-lunas';

            // Badge sumber (Offline / Online)
            const sumberBadge = item.sumber === 'online' 
                ? '<span class="source-badge source-online">Online</span>' 
                : '<span class="source-badge source-offline">Offline</span>';

            // Tombol Aksi
            let actionButtons = '';
            if (item.status === 'Menunggu Diagnosa') {
                actionButtons = `<button onclick="cetakNota(${index}, 'awal')" class="btn-secondary" style="padding: 6px 12px; font-size: 11px;">🖨️ Nota Awal</button>`;
            } else if (item.status === 'Siap Diambil') {
                actionButtons = `<button onclick="bukaModalBayar(${index})" class="btn-primary" style="padding: 6px 14px; font-size: 11px;">💳 Bayar</button>`;
            } else {
                actionButtons = `<button onclick="cetakNota(${index}, 'lunas')" class="btn-secondary" style="padding: 6px 12px; font-size: 11px;">🖨️ Nota Lunas</button>`;
            }

            const row = `
                <tr>
                    <td>
                        <strong style="font-family: monospace; color: var(--text-dark);">${item.noNota}</strong>
                        ${sumberBadge}
                        <span style="display: block; font-size: 10px; color: var(--text-muted);">${item.tanggal}</span>
                    </td>
                    <td>
                        <strong style="color: var(--text-dark);">${item.nama}</strong>
                        <span style="display: block; font-size: 11px; color: var(--text-muted);">${item.jenis} • ${item.merkTipe}</span>
                    </td>
                    <td style="max-width: 180px;">
                        <span style="color: #475569;">${item.tindakan}</span>
                    </td>
                    <td><strong style="font-family: monospace;">Rp ${item.totalBiaya.toLocaleString('id-ID')}</strong></td>
                    <td><span class="badge-status ${badgeClass}">${statusText}</span></td>
                    <td class="text-center">${actionButtons}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        // Update Statistik KPI
        const statM = document.getElementById('statMenunggu');
        const statS = document.getElementById('statSiap');
        const statL = document.getElementById('statLunas');
        if (statM) statM.textContent = countMenunggu;
        if (statS) statS.textContent = countSiap;
        if (statL) statL.textContent = countLunas;
    };

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', renderTabel);
    }
// Modal Pembayaran & Kalkulator Kembalian
    window.bukaModalBayar = function(index) {
        activePaymentIndex = index;
        const item = serviceList[index];

        document.getElementById('modalNotaTitle').textContent = item.noNota;
        document.getElementById('modalNama').textContent = item.nama;
        document.getElementById('modalUnit').textContent = `${item.jenis} ${item.merkTipe}`;
        document.getElementById('modalTindakan').textContent = item.tindakan;
        document.getElementById('modalTagihan').textContent = `Rp ${item.totalBiaya.toLocaleString('id-ID')}`;

        // Reset input form modal dengan aman
        const inputUang = document.getElementById('inputUangBayar');
        const inputMetode = document.getElementById('inputMetodeBayar');
        const display = document.getElementById('displayKembalian');
        const btn = document.getElementById('btnKonfirmasiBayar');
        const uangBayarGroup = inputUang.closest('.form-group');

        inputUang.value = '';
        inputUang.readOnly = false;
        uangBayarGroup.style.opacity = '1';
        inputMetode.value = 'Tunai (Cash)';
        display.textContent = 'Rp 0';
        btn.disabled = true;

        // Tampilkan modal
        document.getElementById('modalBayar').classList.remove('hidden');
    };

    function tutupModalBayar() {
        document.getElementById('modalBayar').classList.add('hidden');
        activePaymentIndex = null;
    }

    // Perbaikan Event Listener Tombol Tutup & Batal yang Aman
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelModalBtn');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            tutupModalBayar();
        };
    }
    if (cancelBtn) {
        cancelBtn.onclick = function() {
            tutupModalBayar();
        };
    }

    // Logika Perubahan Metode Pembayaran (Tunai vs Cashless)
    const inputMetodeBayar = document.getElementById('inputMetodeBayar');
    const inputUangBayar = document.getElementById('inputUangBayar');

    if (inputMetodeBayar && inputUangBayar) {
        inputMetodeBayar.addEventListener('change', () => {
            if (activePaymentIndex === null) return;
            const tagihan = serviceList[activePaymentIndex].totalBiaya;
            const display = document.getElementById('displayKembalian');
            const btn = document.getElementById('btnKonfirmasiBayar');
            const uangBayarGroup = inputUangBayar.closest('.form-group');

            if (inputMetodeBayar.value.includes('Cashless')) {
                // Jika QRIS/Transfer, otomatis dianggap pas
                inputUangBayar.value = tagihan;
                display.textContent = 'Rp 0 (Non-Tunai)';
                btn.disabled = false;
                uangBayarGroup.style.opacity = '0.6';
                inputUangBayar.readOnly = true;
            } else {
                // Jika Tunai, aktifkan kembali input manual dengan bersih
                inputUangBayar.value = '';
                display.textContent = 'Rp 0';
                btn.disabled = true;
                uangBayarGroup.style.opacity = '1';
                inputUangBayar.readOnly = false;
                inputUangBayar.focus();
            }
        });

        inputUangBayar.addEventListener('input', () => {
            if (activePaymentIndex === null) return;
            const metode = inputMetodeBayar.value;
            
            // Jika cashless, abaikan perhitungan manual
            if (metode.includes('Cashless')) return;

            const tagihan = serviceList[activePaymentIndex].totalBiaya;
            const bayar = parseFloat(inputUangBayar.value) || 0;
            const kembali = bayar - tagihan;

            const display = document.getElementById('displayKembalian');
            const btn = document.getElementById('btnKonfirmasiBayar');

            if (bayar >= tagihan) {
                display.textContent = `Rp ${kembali.toLocaleString('id-ID')}`;
                btn.disabled = false; // Tombol aktif kembali!
            } else {
                display.textContent = 'Uang Kurang';
                btn.disabled = true;
            }
        });
    }

    const formPembayaran = document.getElementById('formPembayaran');
    if (formPembayaran) {
        formPembayaran.addEventListener('submit', (e) => {
            e.preventDefault();
            if (activePaymentIndex === null) return;

            const bayar = parseFloat(inputUangBayar.value) || serviceList[activePaymentIndex].totalBiaya;
            const tagihan = serviceList[activePaymentIndex].totalBiaya;
            const metodeBayar = inputMetodeBayar ? inputMetodeBayar.value : 'Tunai (Cash)';

            serviceList[activePaymentIndex].status = 'Selesai & Lunas';
            serviceList[activePaymentIndex].metodeBayar = metodeBayar;
            serviceList[activePaymentIndex].uangBayar = bayar;
            serviceList[activePaymentIndex].kembalian = metodeBayar.includes('Cashless') ? 0 : (bayar - tagihan);

            saveData();
            const idxToPrint = activePaymentIndex;
            tutupModalBayar();
            renderTabel();

            // Cetak Nota Pelunasan Resmi
            cetakNota(idxToPrint, 'lunas');
        });
    }

    // Fungsi Cetak Nota (Update bagian pelunasan)
    window.cetakNota = function(index, tipe) {
        const item = serviceList[index];
        document.getElementById('cetakNota').textContent = item.noNota;
        document.getElementById('cetakSumber').textContent = (item.sumber || 'offline').toUpperCase();
        document.getElementById('cetakTanggal').textContent = item.tanggal;
        document.getElementById('cetakNama').textContent = item.nama;
        document.getElementById('cetakHp').textContent = item.noHp;
        document.getElementById('cetakUnit').textContent = `${item.jenis} ${item.merkTipe}`;
        document.getElementById('cetakSn').textContent = item.nomorSeri;
        document.getElementById('cetakKeluhan').textContent = item.keluhan;
        document.getElementById('cetakStatus').textContent = item.status.toUpperCase();

        // Elemen cetak metode bayar jika ada di HTML
        const cetakMetode = document.getElementById('cetakMetode');
        if (cetakMetode) {
            cetakMetode.textContent = item.metodeBayar || 'Tunai (Cash)';
        }

        if (tipe === 'awal') {
            document.getElementById('notaJenisJudul').textContent = 'NOTA TANDA TERIMA SERVIS';
            document.getElementById('cetakTindakan').textContent = 'Menunggu Pengecekan Teknisi';
            document.getElementById('cetakJasa').textContent = 'Rp 0';
            document.getElementById('cetakSparepart').textContent = 'Rp 0';
            document.getElementById('cetakTotal').textContent = 'Rp 0 (Estimasi menyusul)';
            document.getElementById('cetakRowBayar').style.display = 'none';
            document.getElementById('cetakRowKembali').style.display = 'none';
        } else {
            document.getElementById('notaJenisJudul').textContent = 'NOTA PELUNASAN RESMI';
            document.getElementById('cetakTindakan').textContent = item.tindakan;
            document.getElementById('cetakJasa').textContent = `Rp ${item.biayaJasa.toLocaleString('id-ID')}`;
            document.getElementById('cetakSparepart').textContent = `Rp ${item.biayaSparepart.toLocaleString('id-ID')}`;
            document.getElementById('cetakTotal').textContent = `Rp ${item.totalBiaya.toLocaleString('id-ID')}`;
            document.getElementById('cetakRowBayar').style.display = 'block';
            document.getElementById('cetakRowKembali').style.display = 'block';
            document.getElementById('cetakBayar').textContent = `Rp ${(item.uangBayar || item.totalBiaya).toLocaleString('id-ID')}`;
            document.getElementById('cetakKembali').textContent = `Rp ${(item.kembalian || 0).toLocaleString('id-ID')}`;
        }

        const printArea = document.getElementById('printArea');
        printArea.classList.remove('hidden');
        window.print();
        printArea.classList.add('hidden');
    };

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nanda_active_user');
            localStorage.removeItem('nanda_active_role');
            window.location.href = 'index.html';
        });
    }

    initKasir();
});

document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.mouse-glow');
    if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    }
});