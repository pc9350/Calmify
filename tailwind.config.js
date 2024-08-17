module.exports = {
  content: [
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sage-green': '#8FBC8F',
        'sage-green-dark': '#6B8E6B',
        'rose-300': '#fda4af',
        'rose-400': '#fb7185',
        'rose-500': '#f43f5e',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  variants: {
    extend: {
      scale: ['hover', 'focus'],
      animation: ['hover', 'focus'],
    },
  },
  plugins: [],
};