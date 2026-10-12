/**
 * Shared perfume constants for backend and frontend validation
 */

const PERFUME_SIZES = ['30ml', '50ml', '100ml'];
const PERFUME_CONCENTRATIONS = ['edt', 'edp', 'ext'];
const PERFUME_SETTINGS_KEY = 'perfume_prices';

// Concentration labels for display
const CONCENTRATION_LABELS = {
  edt: 'خفيف (EDT)',
  edp: 'متوسط (EDP)',
  ext: 'قوي مكثف (Extrait)'
};

// Size labels for display
const SIZE_LABELS = {
  '30ml': '30 مل',
  '50ml': '50 مل',
  '100ml': '100 مل'
};

// Default prices (fallback)
const DEFAULT_PERFUME_PRICES = {
  '30ml': { edt: 250, edp: 350, ext: 450 },
  '50ml': { edt: 400, edp: 500, ext: 650 },
  '100ml': { edt: 600, edp: 750, ext: 950 },
};

// Allowed scent names (from perfume.html presets)
const ALLOWED_SCENTS = [
  'سوفاج الملكي (Sauvage Blend)',
  'كريد أفينتوس الأرستقراطي (Aventus)',
  'توم فورد توباكو فانيلا (Tobacco Vanilla)',
  'سكاندال وزهور شرقية (Scandal Gold)',
  'بلاك أوبيوم (Black Opium)',
  'مسك الطهارة والرمان الملكي'
];

// Length limits
const MAX_CUSTOM_NAME_LENGTH = 100;
const MAX_NOTES_LENGTH = 500;

module.exports = {
  PERFUME_SIZES,
  PERFUME_CONCENTRATIONS,
  PERFUME_SETTINGS_KEY,
  CONCENTRATION_LABELS,
  SIZE_LABELS,
  DEFAULT_PERFUME_PRICES,
  ALLOWED_SCENTS,
  MAX_CUSTOM_NAME_LENGTH,
  MAX_NOTES_LENGTH,
};
