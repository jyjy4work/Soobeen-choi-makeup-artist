import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50:  '#f0ebe3',   // warm ivory — primary text
          100: '#c9a878',   // champagne gold — accent
          200: '#b0a294',   // warm secondary text
          300: '#736860',   // muted text
          400: '#3d3530',   // visible border
          500: '#262019',   // subtle border / card-2
          600: '#1c1714',   // card background
          700: '#141110',   // surface
          800: '#0e0b09',   // page background
          900: '#080503',   // deepest
        },
      },
    },
  },
  plugins: [],
}

export default config
