document.addEventListener('DOMContentLoaded', () => {
    const mouseGlow = document.getElementById('mouseGlow');
    const tiltCard = document.getElementById('tiltCard');
    const loginForm = document.getElementById('loginForm');
    const togglePassBtn = document.getElementById('togglePassBtn');
    const passwordInput = document.getElementById('password');
    const forgotLink = document.getElementById('forgotLink');

    // =========================================================================
    // 1. EVENT ACTION MOUSE: Cahaya mengikuti kursor & Efek 3D Tilt Halus
    // =========================================================================
    document.addEventListener('mousemove', (e) => {
        // Gerakkan cahaya latar belakang mengikuti kursor
        if (mouseGlow) {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        }

        // Efek 3D Tilt halus pada container utama saat di layar desktop
        if (tiltCard && window.innerWidth > 860) {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Maksimal kemiringan 2 derajat agar tetap elegan dan nyaman dibaca
            const rotateX = ((y - centerY) / centerY) * -2;
            const rotateY = ((x - centerX) / centerX) * 2;

            tiltCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });

    // Kembalikan posisi kartu ke normal saat mouse keluar dari area jendela
    document.addEventListener('mouseleave', () => {
        if (tiltCard) {
            tiltCard.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
        }
    });

    // =========================================================================
    // 2. INTERAKSI SHOW / HIDE PASSWORD
    // =========================================================================
    if (togglePassBtn && passwordInput) {
        togglePassBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePassBtn.textContent = isPassword ? '🙈' : '👁️';
        });
    }

    // =========================================================================
    // 3. INTERAKSI LUPA PASSWORD
    // =========================================================================
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Silakan hubungi Admin / Owner Nanda Computer untuk melakukan reset password akun Anda.');
        });
    }

    // =========================================================================
    // 4. LOGIKA OTENTIKASI & ROUTING AKTOR
    // =========================================================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username').value.trim();
            const usernameLower = usernameInput.toLowerCase();
            const password = passwordInput.value.trim();
            const errorAlert = document.getElementById('errorAlert');
            const btnText = document.getElementById('btnText');
            const btnLoader = document.getElementById('btnLoader');
            const submitBtn = document.getElementById('submitBtn');

            // State Loading
            submitBtn.disabled = true;
            btnText.textContent = 'Memverifikasi...';
            btnLoader.classList.remove('hidden');
            errorAlert.classList.add('hidden');

            // Daftar Kredensial untuk Staff Inti (Admin, Kasir, Teknisi)
            const staffDatabase = {
                'owner': { role: 'Admin / Owner', redirect: 'dashboard-admin.html' },
                'admin': { role: 'Admin / Owner', redirect: 'dashboard-admin.html' },
                'kasir': { role: 'Kasir', redirect: 'dashboard-kasir.html' },
                'teknisi': { role: 'Teknisi', redirect: 'dashboard-teknisi.html' }
            };

            setTimeout(() => {
                // 1. Cek apakah yang login adalah Staff (Admin/Kasir/Teknisi) dengan password '123'
                if (staffDatabase[usernameLower] && password === '123') {
                    localStorage.setItem('nanda_active_user', usernameInput);
                    localStorage.setItem('nanda_active_role', staffDatabase[usernameLower].role);
                    window.location.href = staffDatabase[usernameLower].redirect;
                    return;
                }

                // 2. Cek apakah yang login adalah Pelanggan (Menggunakan nama yang diinput)
                if (usernameInput !== '') {
                    localStorage.setItem('nanda_active_user', usernameInput); // Simpan nama asli (misal: Meidiana)
                    localStorage.setItem('nanda_active_role', 'Pelanggan');
                    window.location.href = 'dashboard-pelanggan.html';
                    return;
                } else {
                    // Tampilkan pesan error jika username kosong
                    submitBtn.disabled = false;
                    btnText.textContent = 'Masuk ke Sistem';
                    btnLoader.classList.add('hidden');
                    
                    errorAlert.classList.remove('hidden');
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            }, 700);
        });
    }
});