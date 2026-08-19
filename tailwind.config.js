/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        clinical: {
          blue: '#1e40af',
          indigo: '#4338ca',
          teal: '#0d9488',
          cyan: '#0891b2',
          slate: '#0f172a',
          darkBg: '#090d16',
          darkCard: '#111827',
          darkBorder: '#1f2937',
        },
        reagent: {
          glucose: '#3b82f6',
          protein: '#8b5cf6',
          ph: '#ef4444',
          ketones: '#ec4899',
          blood: '#dc2626',
          bilirubin: '#f59e0b',
          urobilinogen: '#eab308',
          nitrite: '#10b981',
          leucocytes: '#6366f1',
          sg: '#06b6d4',
          ascorbic: '#a855f7',
          calcium: '#f97316',
          creatinine: '#14b8a6',
          microalbumin: '#e11d48'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-teal': '0 0 15px rgba(20, 184, 166, 0.35)',
      }
    },
  },
  plugins: [],
}
