document.addEventListener('DOMContentLoaded', () => {
    const formPelanggan = document.getElementById('loginPelangganForm');
    
    if (formPelanggan) {
        formPelanggan.addEventListener('submit', (e) => {
            e.preventDefault();
            const namaInput = document.getElementById('namaPelanggan');
            const nama = namaInput ? namaInput.value.trim() : 'Pelanggan';
            const btnSubmit = formPelanggan.querySelector('.btn-submit');

            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.style.opacity = '0.8';
                btnSubmit.textContent = 'Memverifikasi...';
            }

            setTimeout(() => {
                localStorage.setItem('nanda_active_user', nama);
                localStorage.setItem('nanda_active_role', 'pelanggan');
                window.location.href = 'dashboard-pelanggan.html';
            }, 800);
        });
    }
});