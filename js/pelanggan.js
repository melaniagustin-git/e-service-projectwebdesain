document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'nanda_service_data';
    let serviceList = [];

    const activeUser = localStorage.getItem('nanda_active_user') || 'Pelanggan';

    function initPelanggan() {
        const userNameSpan = document.querySelector('.user-name');
        if (userNameSpan) {
            userNameSpan.textContent = `Selamat datang, ${activeUser}!`;
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            serviceList = JSON.parse(saved);
        }
        renderMonitoring();
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serviceList));
    }

    function generateNomorNota() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const urutan = String(serviceList.length + 1).padStart(3, '0');
        return `SRV-${yyyy}${mm}${dd}-${urutan}`;
    }

    // Fungsi Modern Popup Modal
    function showModal(title, message) {
        const modal = document.getElementById('customModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        
        if (modal && modalTitle && modalMessage) {
            modalTitle.textContent = title;
            modalMessage.innerHTML = message;
            modal.classList.remove('hidden');
        }
    }

    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            const modal = document.getElementById('customModal');
            if (modal) modal.classList.add('hidden');
        });
    }

    const formPendaftaranOnline = document.getElementById('formPendaftaranOnline');
    const inputNama = document.getElementById('namaPelanggan');
    if (inputNama && activeUser !== 'Pelanggan') {
        inputNama.value = activeUser;
    }

    if (formPendaftaranOnline) {
        // Hapus duplikasi dengan memastikan hanya ada 1 event listener submit
        formPendaftaranOnline.onsubmit = function(e) {
            e.preventDefault();

            const now = new Date().toISOString().split('T')[0];
            const newNota = generateNomorNota();
            const namaPelangganInput = inputNama ? inputNama.value.trim() : activeUser;

            const newItem = {
                noNota: newNota,
                sumber: 'online',
                tanggal: now,
                nama: namaPelangganInput,
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

            formPendaftaranOnline.reset();
            if (inputNama) inputNama.value = activeUser; 
            renderMonitoring();

            // Tampilkan Custom Modal Popup yang modern
            showModal(
                "Pendaftaran Servis Berhasil!", 
                `Nomor Nota Anda: <strong style="color: var(--blue-primary); font-family: monospace;">${newNota}</strong><br>Silakan simpan nomor nota untuk memantau status perbaikan.`
            );
        };
    }

   function renderMonitoring() {
        const tbody = document.getElementById('tabelMonitoringBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        // Ambil input nama di form atau gunakan activeUser yang sedang login
        const inputNamaElem = document.getElementById('namaPelanggan');
        const currentTypeName = inputNamaElem ? inputNamaElem.value.trim().toLowerCase() : '';

        // Filter data: Tampilkan jika nama pada data cocok dengan activeUser, 
        // atau jika activeUser adalah 'Pelanggan' (supaya semua data uji coba terlihat), 
        // atau cocok dengan yang sedang diketik di form.
        const personalData = serviceList.filter(item => {
            const itemNama = item.nama ? item.nama.toLowerCase() : '';
            if (activeUser.toLowerCase() === 'pelanggan') return true;
            return itemNama === activeUser.toLowerCase() || (currentTypeName && itemNama.includes(currentTypeName));
        });

        if (personalData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 32px; color: var(--text-muted); font-style: italic;">
                        Belum ada riwayat pendaftaran servis atas nama <strong>${activeUser}</strong>.
                    </td>
                </tr>
            `;
            return;
        }

        personalData.forEach((item) => {
            let badgeClass = '';
            if (item.status === 'Menunggu Diagnosa') badgeClass = 'status-menunggu';
            else if (item.status === 'Siap Diambil') badgeClass = 'status-siap';
            else badgeClass = 'status-lunas';

            const sumberBadge = '<span class="source-badge">Online</span>';

            const row = `
                <tr>
                    <td>
                        <strong style="font-family: monospace; color: var(--text-dark);">${item.noNota}</strong>
                        ${item.sumber === 'online' ? sumberBadge : ''}
                        <span style="display: block; font-size: 10px; color: var(--text-muted);">${item.tanggal}</span>
                    </td>
                    <td>
                        <strong style="color: var(--text-dark);">${item.nama}</strong>
                        <span style="display: block; font-size: 11px; color: var(--text-muted);">${item.jenis} • ${item.merkTipe}</span>
                        <span style="display: block; font-size: 10px; color: #64748B;">Keluhan: ${item.keluhan}</span>
                    </td>
                    <td>
                        <span style="display: block; color: #475569; font-size: 11px;">${item.tindakan}</span>
                        <strong style="font-family: monospace; font-size: 12px; color: var(--blue-primary);">Rp ${item.totalBiaya.toLocaleString('id-ID')}</strong>
                    </td>
                    <td>
                        <span class="badge-status ${badgeClass}">${item.status}</span>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nanda_active_user');
            localStorage.removeItem('nanda_active_role');
            window.location.href = 'index.html';
        });
    }

    initPelanggan();
});