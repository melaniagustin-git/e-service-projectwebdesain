document.addEventListener('DOMContentLoaded', () => {
    const formStaf = document.getElementById('loginStafForm');
    
    if (formStaf) {
        formStaf.addEventListener('submit', (e) => {
            e.preventDefault();
            const userInput = document.getElementById('usernameStaf');
            const user = userInput ? userInput.value.trim().toLowerCase() : '';
            const btnSubmit = formStaf.querySelector('.btn-submit');

            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.style.opacity = '0.8';
                btnSubmit.textContent = 'Memverifikasi...';
            }

            setTimeout(() => {
                localStorage.setItem('nanda_active_user', user);
                localStorage.setItem('nanda_active_role', user);

                if (user === 'admin') {
                    window.location.href = 'dashboard-admin.html';
                } else if (user === 'kasir') {
                    window.location.href = 'dashboard-kasir.html';
                } else if (user === 'teknisi') {
                    window.location.href = 'dashboard-teknisi.html';
                } else {
                    alert('Username staf tidak dikenali! Gunakan: admin, kasir, atau teknisi.');
                    if (btnSubmit) {
                        btnSubmit.disabled = false;
                        btnSubmit.style.opacity = '1';
                        btnSubmit.textContent = 'Masuk ke Dashboard';
                    }
                }
            }, 800);
        });
    }
});