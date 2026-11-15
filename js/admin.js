document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'nanda_service_data';
    const savedData = localStorage.getItem(STORAGE_KEY);
    const serviceList = savedData ? JSON.parse(savedData) : [];

    const tbody = document.getElementById('tabelAdminBody');
    const searchInput = document.getElementById('adminSearchInput');

    function renderAdminTable(filter = '') {
        if (!tbody) return;
        tbody.innerHTML = '';

        let totalPendapatan = 0;
        let totalUnit = serviceList.length;
        let totalSelesai = 0;

        serviceList.forEach(item => {
            if (item.status === 'Selesai & Lunas') {
                totalPendapatan += (item.totalBiaya || 0);
                totalSelesai++;
            }

            if (filter && !item.noNota.toLowerCase().includes(filter.toLowerCase()) && !item.nama.toLowerCase().includes(filter.toLowerCase())) {
                return;
            }

            // Badge status
            let badgeClass = 'status-menunggu';
            if (item.status === 'Siap Diambil') badgeClass = 'status-siap';
            if (item.status === 'Selesai & Lunas') badgeClass = 'status-lunas';

            // Badge sumber
            const sumberBadge = item.sumber === 'online' 
                ? '<span class="source-badge source-online">Online</span>' 
                : '<span class="source-badge source-offline">Offline</span>';

            const row = `
                <tr>
                    <td>
                        <strong style="font-family: monospace;">${item.noNota}</strong>
                        ${sumberBadge}
                        <span style="display: block; font-size: 10px; color: #64748B;">${item.tanggal}</span>
                    </td>
                    <td>
                        <strong>${item.nama}</strong>
                        <span style="display: block; font-size: 11px; color: #64748B;">${item.jenis} • ${item.merkTipe}</span>
                    </td>
                    <td>${item.tindakan || '-'}</td>
                    <td><span style="font-size: 11px; font-weight: 600; color: #475569;">${item.metodeBayar || '-'}</span></td>
                    <td><strong style="font-family: monospace;">Rp ${(item.totalBiaya || 0).toLocaleString('id-ID')}</strong></td>
                    <td><span class="badge-status ${badgeClass}">${item.status}</span></td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        // Update Statistik KPI Admin
        document.getElementById('statPendapatan').textContent = `Rp ${totalPendapatan.toLocaleString('id-ID')}`;
        document.getElementById('statTotalUnit').textContent = totalUnit;
        document.getElementById('statSelesai').textContent = totalSelesai;
    }

    renderAdminTable();

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderAdminTable(e.target.value);
        });
    }

    // Logout Handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nanda_active_user');
            localStorage.removeItem('nanda_active_role');
            window.location.href = 'index.html';
        });
    }
});

// Efek Mouse Glow Global
document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.mouse-glow');
    if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    }
});