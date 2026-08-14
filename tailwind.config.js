/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Rich charcoal, warm rather than blue-grey — never pure black.
        ink: {
          950: '#0F0F11',
          900: '#18181B',
          800: '#22222B',
          700: '#33333F',
          600: '#4A4A58',
          500: '#6B6B78',
          400: '#8E8E9C',
          300: '#B5B5C0',
          200: '#D8D8DE',
          100: '#E9E9E5',
        },
        // Warm off-white, not cold grey. Never pure white.
        paper: {
          DEFAULT: '#F7F7F5',
          dim: '#F0F0EC',
          line: '#E4E4DD',
        },
        // The one bold accent — deep blue, kept mostly to black/white otherwise.
        flare: {
          50: '#EAF0FD',
          100: '#CBDAFA',
          200: '#9BB8F5',
          300: '#6690EC',
          400: '#3D6EE0',
          500: '#2554E0',
          600: '#1B3FB3',
          700: '#152F86',
          800: '#0F2260',
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
        card: '0 1px 2px rgba(15,15,17,0.03), 0 2px 8px -2px rgba(15,15,17,0.05)',
        lift: '0 24px 48px -16px rgba(15,15,17,0.14), 0 8px 16px -8px rgba(15,15,17,0.07)',
        flare: '0 24px 48px -16px rgba(37,84,224,0.32)',
      },
      fontFamily: {
        // Syne: the "striking display font" — geometric, confident, and
        // distinct from the body face, so headings never read as body text
        // turned up a size.
        display: ['"Syne Variable"', 'Syne', 'system-ui', 'sans-serif'],
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
