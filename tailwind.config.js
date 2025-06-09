/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        clap: {
          '0%, 100%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(-45deg)' },
        },
      },
      animation: {
        'clap': 'clap 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} 