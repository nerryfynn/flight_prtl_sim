import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ana-blue': '#003399',
        'ana-blue-dark': '#002266',
        'ana-light-blue': '#e6edf7',
      },
    },
  },
  plugins: [],
}
export default config
