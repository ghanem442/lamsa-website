/**
 * Auth Guard - Protect Pages
 * Redirects to /auth if user is not logged in
 */
(function() {
  const token = localStorage.getItem('lamsa_token');
  const currentPage = window.location.pathname;
  
  // Protected pages that require authentication (Clean URLs)
  const protectedPages = [
    '/shop',
    '/account',
    '/routine-finder',
    '/gift-designer',
    '/perfume-studio',
    '/admin'
  ];
  
  // Check if current page is protected
  if (protectedPages.includes(currentPage) && !token) {
    // Save current page to return after login
    sessionStorage.setItem('lamsa_auth_redirect', currentPage);
    window.location.href = '/auth';
  }
})();
