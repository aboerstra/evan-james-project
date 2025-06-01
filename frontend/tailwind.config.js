/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0a192f',
        'sapphire': '#2a3b90',
        'electric-blue': '#0047AB',
        'ice-blue': '#a3c2d9',
        'chrome': '#c0c0c0',
      },
      fontFamily: {
        'serif': ['EB Garamond', 'Canela', 'serif'],
        'sans': ['Inter', 'Neue Haas Grotesk', 'sans-serif'],
        'mulish': ['Mulish', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 60s linear infinite',
        'spin-slow-reverse': 'spin 40s linear infinite reverse',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      transitionDelay: {
        '400': '400ms',
        '700': '700ms',
        '1000': '1000ms',
        '1500': '1500ms',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.white'),
            a: {
              color: theme('colors.electric-blue'),
              '&:hover': {
                color: theme('colors.ice-blue'),
              },
            },
            h1: {
              color: theme('colors.ice-blue'),
              fontFamily: theme('fontFamily.mulish'),
            },
            h2: {
              color: theme('colors.electric-blue'),
              fontFamily: theme('fontFamily.mulish'),
            },
            h3: {
              color: theme('colors.white'),
              fontFamily: theme('fontFamily.mulish'),
            },
            strong: {
              color: theme('colors.ice-blue'),
            },
            blockquote: {
              color: theme('colors.ice-blue'),
              borderLeftColor: theme('colors.sapphire'),
            },
            code: {
              color: theme('colors.ice-blue'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 