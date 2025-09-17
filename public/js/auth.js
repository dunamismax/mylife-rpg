document.addEventListener('DOMContentLoaded', () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    const currentPage = window.location.pathname;

    if (token && (currentPage.includes('signin') || currentPage.includes('register'))) {
        window.location.href = '/dashboard';
    }

    if (!token && currentPage.includes('dashboard')) {
        window.location.href = '/signin';
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (res.ok) {
                    window.location.href = '/dashboard';
                } else {
                    const data = await res.json();
                    errorMessage.textContent = data.message;
                }
            } catch (error) {
                errorMessage.textContent = 'An error occurred. Please try again.';
            }
        });
    }

    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (res.ok) {
                    window.location.href = '/dashboard';
                } else {
                    const data = await res.json();
                    errorMessage.textContent = data.message;
                }
            } catch (error) {
                errorMessage.textContent = 'An error occurred. Please try again.';
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/signin';
            } catch (error) {
                console.error('Logout failed', error);
            }
        });
    }
});
