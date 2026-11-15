document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'nanda_service_data';
    let serviceList = [];
    let selectedIndex = null;

    function initTeknisi() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            serviceList = JSON.parse(saved);
        }
        renderAntrian();
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serviceList));
    }

    // Render Tabel khusus status "Menunggu Diagnosa"
    function renderAntrian() {
        const tbody = document.getElementById('tabelAntrianBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        let count = 0;

        serviceList.forEach((item, index) => {
            if (item.status === 'Menunggu Diagnosa') {
                count++;
                const sumberBadge = item.sumber === 'online' 
                    ? '<span class="source-badge source-online">Online</span>' 
                    : '<span class="source-badge source-offline">Offline</span>';

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
                        <td style="max-width: 160px;">
                            <span style="color: #475569;">${item.keluhan}</span>
                        </td>
                        <td class="text-center">
                            <button onclick="pilihPerangkat(${index})" class="btn-primary" style="padding: 6px 14px; font-size: 11px;">Pilih & Proses</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            }
        });

        if (count === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 32px; color: var(--text-muted); font-style: italic;">
                        Tidak ada antrian perangkat yang menunggu diagnosa saat ini.
                    </td>
                </tr>
            `;
        }

        const statCount = document.getElementById('statAntrianCount');
        if (statCount) statCount.textContent = count + " Unit";
    }

    // Pilih perangkat untuk didiagnosa
    window.pilihPerangkat = function(index) {
        selectedIndex = index;
        const item = serviceList[index];

        const badge = document.getElementById('badgeNotaAktif');
        badge.textContent = item.noNota;
        badge.className = 'nota-badge-active';

        document.getElementById('infoUnit').value = `${item.nama} — ${item.jenis} (${item.merkTipe})`;
        document.getElementById('tindakanInput').value = '';
        document.getElementById('biayaJasa').value = 0;
        document.getElementById('biayaSparepart').value = 0;
        document.getElementById('displayTotalBiaya').textContent = 'Rp 0';

        document.getElementById('btnSimpanDiagnosa').disabled = false;
    };

    // Kalkulator Otomatis Biaya
    function hitungTotal() {
        const jasa = parseFloat(document.getElementById('biayaJasa').value) || 0;
        const sparepart = parseFloat(document.getElementById('biayaSparepart').value) || 0;
        const total = jasa + sparepart;
        document.getElementById('displayTotalBiaya').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    const inputJasa = document.getElementById('biayaJasa');
    const inputSparepart = document.getElementById('biayaSparepart');
    if (inputJasa) inputJasa.addEventListener('input', hitungTotal);
    if (inputSparepart) inputSparepart.addEventListener('input', hitungTotal);

    // Form Submit Diagnosa
    const formTeknisi = document.getElementById('formTeknisi');
    if (formTeknisi) {
        formTeknisi.addEventListener('submit', (e) => {
            e.preventDefault();
            if (selectedIndex === null) return;

            const jasa = parseFloat(inputJasa.value) || 0;
            const sparepart = parseFloat(inputSparepart.value) || 0;

            serviceList[selectedIndex].tindakan = document.getElementById('tindakanInput').value.trim();
            serviceList[selectedIndex].biayaJasa = jasa;
            serviceList[selectedIndex].biayaSparepart = sparepart;
            serviceList[selectedIndex].totalBiaya = jasa + sparepart;
            serviceList[selectedIndex].status = 'Siap Diambil'; // Mengubah status agar muncul di kasir

            saveData();
            alert(`Diagnosa Berhasil Disimpan!\nNo Nota: ${serviceList[selectedIndex].noNota}\nStatus diubah menjadi: SIAP DIAMBIL`);

            selectedIndex = null;
            formTeknisi.reset();
            const badge = document.getElementById('badgeNotaAktif');
            badge.textContent = 'Belum Dipilih';
            badge.className = 'nota-badge-inactive';
            document.getElementById('displayTotalBiaya').textContent = 'Rp 0';
            document.getElementById('btnSimpanDiagnosa').disabled = true;

            renderAntrian();
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nanda_active_user');
            localStorage.removeItem('nanda_active_role');
            window.location.href = 'index.html';
        });
    }

    initTeknisi();
});