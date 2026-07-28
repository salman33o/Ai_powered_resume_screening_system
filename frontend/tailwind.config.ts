/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a2e',
        'ink-raised': '#16213e',
        'primary-brass': '#e9c46a',
        'secondary-blue': '#2a9d8f',
        'accent-red': '#e76f51',
        slate: {
          300: '#94a3b8',
          400: '#64748b',
          700: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
