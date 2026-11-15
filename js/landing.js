document.addEventListener('DOMContentLoaded', () => {
    const trackBtn = document.getElementById('trackBtn');
    const notaInput = document.getElementById('quickNotaInput');
    const resultModal = document.getElementById('trackingResultModal');
    const resultBody = document.getElementById('resultBodyContent');
    const closeBtn = document.getElementById('closeResultBtn');

    if (trackBtn && notaInput) {
        trackBtn.addEventListener('click', () => {
            const noNota = notaInput.value.trim().toUpperCase();

            if (!noNota) {
                alert('Silakan masukkan nomor nota terlebih dahulu!');
                return;
            }

            // 1. Ambil data transaksi dari localStorage yang diinput oleh Kasir
            // (Pastikan key localStorage di kasir menggunakan nama yang sama, misal 'nanda_transaksi' atau kita gabung dengan database cadangan)
            let databaseServis = JSON.parse(localStorage.getItem('nanda_transaksi_list')) || {};

            // Jika localStorage masih kosong (untuk jaga-jaga saat pertama kali dibuka), 
            // kita sediakan data default termasuk Baskara Putra (Offline) & Bpk Hidayat
            const defaultDatabase = {
                "SRV-20261113-001": {
                    nama: "Baskara Putra",
                    perangkat: "Laptop • ASUS ExpertBook P3 (Offline)",
                    kerusakan: "Install Ulang",
                    status: "Selesai & Lunas",
                    estimasi: "Perangkat sudah dapat diambil di toko."
                },
                "SRV-20261113-007": {
                    nama: "Bpk Hidayat (SMA 5 Karawang)",
                    perangkat: "Printer • Canon",
                    kerusakan: "Cleaning Printer",
                    status: "Selesai & Lunas",
                    estimasi: "Perangkat sudah dapat diambil di toko."
                }
            };

                // Gabungkan data localStorage dengan default database
            const mergedDB = { ...defaultDatabase, ...databaseServis };
            const dataNota = mergedDB[noNota];

            let statusHTML = '';
            if (dataNota) {
                statusHTML = `
                    <p><strong>No. Nota:</strong> ${noNota}</p>
                    <p><strong>Pelanggan:</strong> ${dataNota.nama}</p>
                    <p><strong>Perangkat:</strong> ${dataNota.perangkat}</p>
                    <p><strong>Kerusakan:</strong> ${dataNota.kerusakan}</p>
                    <p><strong>Status Terkini:</strong> <span class="badge-status proses">${dataNota.status}</span></p>
                    <p class="est-text">${dataNota.estimasi || 'Perangkat sedang diproses.'}</p>
                `;
            } else {
                statusHTML = `
                    <p><strong>No. Nota:</strong> ${noNota}</p>
                    <p><strong>Status:</strong> <span class="badge-status notfound">Tidak Ditemukan</span></p>
                    <p style="font-size: 12px; color: #64748B; margin-top: 8px;">Pastikan nomor nota sesuai dengan bukti servis dari kasir.</p>
                `;
            }

            resultBody.innerHTML = statusHTML;
            resultModal.style.display = 'block';
        });
    }

    if (closeBtn && resultModal) {
        closeBtn.addEventListener('click', () => {
            resultModal.style.display = 'none';
        });
    }
});