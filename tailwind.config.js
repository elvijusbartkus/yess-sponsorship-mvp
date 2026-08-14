/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0B1220',
          800: '#131C2E',
          700: '#1E2A42',
          500: '#4A5670',
          400: '#6B7794',
          300: '#98A2B8',
        },
        accent: {
          50: '#EEF6FF',
          100: '#D9EAFF',
          300: '#7DB8FF',
          500: '#1F6FEB',
          600: '#1758C4',
          700: '#12459B',
        },
        gain: {
          50: '#ECFDF3',
          100: '#D1FADF',
          500: '#12B76A',
          600: '#039855',
          700: '#027A48',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.10)',
        lift: '0 12px 24px -6px rgba(16,24,40,0.12), 0 4px 8px -4px rgba(16,24,40,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
