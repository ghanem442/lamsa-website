/**
 * LAMSA Security Helpers
 * Loaded before all other scripts to prevent XSS attacks
 */

/**
 * Escape HTML special characters to prevent XSS
 * Use for ANY text from database/API/user before innerHTML
 */
function escapeHtml(text) {
  if (text == null || text === undefined) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;'
  };
  return String(text).replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validate and sanitize URLs for href/src attributes
 * Only allows http/https protocols
 */
function sanitizeUrl(url) {
  if (!url) return '';
  const urlStr = String(url).trim();
  
  // Allow relative URLs
  if (urlStr.startsWith('/') || urlStr.startsWith('./') || urlStr.startsWith('../')) {
    return escapeHtml(urlStr);
  }
  
  // Allow tel: and mailto: for contact links
  if (urlStr.startsWith('tel:') || urlStr.startsWith('mailto:')) {
    return escapeHtml(urlStr);
  }
  
  // Allow WhatsApp URLs
  if (urlStr.startsWith('https://wa.me/') || urlStr.startsWith('https://api.whatsapp.com/')) {
    return escapeHtml(urlStr);
  }
  
  // Only allow http/https for external URLs
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return escapeHtml(urlStr);
    }
  } catch (e) {
    // Invalid URL
  }
  
  // Default: return empty to prevent javascript: or data: URLs
  return '';
}

/**
 * Sanitize URL for display (shows full URL but escaped)
 */
function sanitizeUrlForDisplay(url) {
  if (!url) return '';
  return escapeHtml(String(url).trim());
}

// Make functions available globally
window.escapeHtml = escapeHtml;
window.sanitizeUrl = sanitizeUrl;
window.sanitizeUrlForDisplay = sanitizeUrlForDisplay;
