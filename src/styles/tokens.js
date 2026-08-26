// Centralized design tokens. Components should reference these (or the
// matching Tailwind classes, which are generated from the same values in
// tailwind.config.js) instead of hard-coding colors, radii, or timings.

export const colors = {
  primary: '#1467D9',
  primaryDeep: '#0B3B78',
  background: '#F5F8FC',
  white: '#FFFFFF',
  textPrimary: '#10243E',
  textSecondary: '#6E7F95',
}

export const radius = {
  sm: '10px',
  md: '16px',
  lg: '24px',
  pill: '9999px',
}

export const spacing = {
  section: {
    mobile: '4rem', // 64px
    desktop: '7rem', // 112px
  },
}

export const glass = {
  blur: '20px',
  surfaceOpacity: 0.62,
  deepOpacity: 0.55,
  borderOpacity: 0.5,
}

export const transitions = {
  fast: '150ms',
  base: '250ms',
  slow: '400ms',
  easingSpring: 'cubic-bezier(0.22, 1, 0.36, 1)',
}

export const weekdayLabels = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
]
