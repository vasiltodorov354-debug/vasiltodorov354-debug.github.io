/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0f1115',
        card: '#1b1f2a',
        accent: '#7c5cff',
      },
    },
  },
  plugins: [],
};
