/**
 * Navbar Auth State Management
 * Works with the new inline auth buttons: #navLoginBtn, #navAccountBtn, #navLogoutBtn, #navAdminBtn
 */
(function() {
  'use strict';

  function updateNavbarAuthState() {
    const token = localStorage.getItem('lamsa_token');
    const savedUser = JSON.parse(localStorage.getItem('lamsa_user') || 'null');

    const navLoginBtn   = document.getElementById('navLoginBtn');
    const navAccountBtn = document.getElementById('navAccountBtn');
    const navLogoutBtn  = document.getElementById('navLogoutBtn');
    const navAdminBtn   = document.getElementById('navAdminBtn');

    if (token && savedUser) {
      // ── Logged in ──
      if (navLoginBtn) navLoginBtn.style.display = 'none';
      if (navAccountBtn) navAccountBtn.style.display = '';
      if (navLogoutBtn) {
        navLogoutBtn.style.display = '';
        // Remove any existing listener by cloning
        const fresh = navLogoutBtn.cloneNode(true);
        navLogoutBtn.parentNode.replaceChild(fresh, navLogoutBtn);
        fresh.addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            localStorage.removeItem('lamsa_token');
            localStorage.removeItem('lamsa_user');
            sessionStorage.removeItem('lamsa_auth_redirect');
            window.location.href = '/auth';
          }
        });
      }
      if (navAdminBtn) {
        navAdminBtn.style.display = savedUser.role === 'admin' ? '' : 'none';
      }
    } else {
      // ── Logged out ──
      if (navLoginBtn) navLoginBtn.style.display = '';
      if (navAccountBtn) navAccountBtn.style.display = 'none';
      if (navLogoutBtn) navLogoutBtn.style.display = 'none';
      if (navAdminBtn) navAdminBtn.style.display = 'none';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavbarAuthState);
  } else {
    updateNavbarAuthState();
  }

  window.updateNavbarAuthState = updateNavbarAuthState;
})();
