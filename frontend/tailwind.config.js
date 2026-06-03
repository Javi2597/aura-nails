/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F6',
          100: '#F4EFEA',
          200: '#EADEC9',
          300: '#DAC0A3',
        },
        sage: {
          50: '#F4F6F4',
          100: '#E1E6E1',
          200: '#C4CDC4',
          500: '#7B8E7B',
        },
        bronze: {
          50: '#FAF7F2',
          100: '#F0E6D8',
          300: '#D4C3B3',
          400: '#BFA893',
          500: '#A3846C',
          600: '#8A6D56',
          700: '#6E533F',
          900: '#3D2F24',
        },
        charcoal: {
          100: '#E5E4E3',
          200: '#C8C7C5',
          700: '#4A4847',
          800: '#2A2928',
          900: '#1A1918',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'Outfit', 'sans-serif'],
        alt: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
