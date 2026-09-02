/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1930',
          900: '#0F2A4A',
          800: '#163B63',
          700: '#1E4D7B',
        },
        teal: {
          600: '#0E7C86',
          500: '#12959F',
          100: '#DCF1F2',
        },
        amber: {
          600: '#B36B03',
          500: '#D98E04',
          100: '#FBEACB',
        },
        clay: {
          600: '#B4442E',
          500: '#C6543C',
          100: '#F7DFDA',
        },
        ink: {
          900: '#1C2733',
          600: '#4A5768',
          400: '#8592A3',
        },
        canvas: '#F5F6F8',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
