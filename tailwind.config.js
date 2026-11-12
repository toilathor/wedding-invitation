/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: "#2F4A38",
          secondary: "#DCE5D3",
          bg: "#F6F4EC",
          accent: "#C8B273",
          dark: "#17241B",
          text: "#333333",
          muted: "#666666",
        },
        'dark-200': '#17241B',
        // Bảng màu lấy từ ảnh cưới trong vườn: xanh lá đậm, xanh xô thơm, ngà của váy cưới
        garden: {
          950: '#0F1A13',
          900: '#17241B',
          800: '#233A2B',
          700: '#2F4A38',
          500: '#5F7D63',
          300: '#A9BBA0',
          200: '#C5D1B8',
          100: '#DCE5D3',
          50: '#EEF2E8',
        },
        ivory: '#F6F4EC',
        champagne: '#C8B273',
      },
      fontFamily: {
        playfair: ['PlayfairDisplay', 'Playfair Display', 'serif'],
        birthstone: ['Birthstone', 'cursive'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'BeVietnamPro', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
        vietnam: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'BeVietnamPro', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
        beVietnamPro: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'BeVietnamPro', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
        phudu: ['Phudu', 'sans-serif'],
        pinyon: ['PinyonScript', 'Pinyon Script', 'cursive'],
        pinyonScript: ['PinyonScript', 'Pinyon Script', 'cursive'],
        prata: ['Prata', 'serif'],
        corinthia: ['Corinthia', 'cursive'],
        muli: ['MuliDisplayVN', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 36, 27, 0.04), 0 12px 32px -12px rgba(23, 36, 27, 0.14)',
        float: '0 2px 6px rgba(23, 36, 27, 0.08), 0 18px 48px -12px rgba(23, 36, 27, 0.28)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'fadeIn': 'fadeIn 0.4s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
