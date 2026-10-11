/**
 * Escape HTML special characters to prevent XSS attacks
 * Use this for ANY user-provided or database-provided text before inserting into innerHTML
 * 
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text safe for HTML insertion
 */
function escapeHtml(text) {
  if (text == null) return '';
  
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

module.exports = { escapeHtml };
