/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#1B1C1D', // Dark mode background
        sidebar: '#202123', // Dark sidebar
        accent: '#06DF72', // Green for logo and accents
        'accent-secondary': '#0644C5', // Blue accent 
        'accent-tertiary': '#0614DF', // Deep blue accent
        'text-primary': '#FFFFFF',
        'text-secondary': '#E2E2E2',
        'gray-accent': '#6F788A',
        'input-bg': '#282A2C'
      },
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans)'],
        arabic: ['var(--font-ibm-plex-sans-arabic)'],
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(90deg, #06DF72 0%, #0644C5 76.5%, #0614DF 100%)',
      },
    },
  },
  plugins: [],
}
