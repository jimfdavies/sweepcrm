/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // High-contrast color palette for accessibility
        primary: '#1f2937',    // dark gray
        accent: '#2563eb',     // bright blue
        success: '#10b981',    // green
        warning: '#f59e0b',    // amber
        danger: '#ef4444'      // red
      }
    }
  },
  plugins: []
}
