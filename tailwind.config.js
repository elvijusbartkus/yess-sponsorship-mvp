/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Near-black, warm rather than blue-grey.
        ink: {
          950: '#0B0B0F',
          900: '#15151B',
          800: '#22222B',
          700: '#33333F',
          600: '#4A4A58',
          500: '#6B6B78',
          400: '#8E8E9C',
          300: '#B5B5C0',
          200: '#D8D8DE',
          100: '#E9E9E5',
        },
        // Warm off-white, not cold grey.
        paper: {
          DEFAULT: '#FAFAF7',
          dim: '#F3F3EE',
          line: '#E6E6DF',
        },
        // The one bold accent. Used sparingly and with intent.
        flare: {
          50: '#FFF1EB',
          100: '#FFDCCC',
          200: '#FFBB9E',
          300: '#FF9770',
          400: '#FF7442',
          500: '#FF5A1F',
          600: '#E8430A',
          700: '#B93307',
          800: '#8A2605',
        },
        // Verified only — deliberately a different hue from the accent.
        gain: {
          50: '#ECFDF3',
          100: '#D1FADF',
          500: '#12B76A',
          600: '#039855',
          700: '#027A48',
        },
        // shadcn/ui semantic tokens, mapped to the palette above via
        // src/index.css so shadcn primitives inherit the brand instead of
        // shipping their own generic neutral theme.
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        popover: { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' },
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' },
        destructive: { DEFAULT: 'var(--destructive)', foreground: 'var(--destructive-foreground)' },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        // Anti-slop: sharp/subtle radii only, capped well below rounded-full.
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,11,15,0.04), 0 1px 3px rgba(11,11,15,0.06)',
        lift: '0 18px 32px -12px rgba(11,11,15,0.16), 0 6px 12px -6px rgba(11,11,15,0.08)',
        flare: '0 18px 32px -12px rgba(255,90,31,0.35)',
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
