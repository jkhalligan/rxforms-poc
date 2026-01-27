/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rxforms-blue': '#1a56db',
        'rxforms-gold': '#d4a843',
        'security-band': '#8B7355',
      },
    },
  },
  plugins: [],
}
