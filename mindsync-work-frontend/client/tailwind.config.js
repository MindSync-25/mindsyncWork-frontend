/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        tertiary: '#8B5CF6',
        accent: '#8B5CF6', // Purple for AI/Client widgets
        // Brand Colors
        brand: {
          blue: '#007AFF',
          'blue-light': '#4A9EFF',
          'blue-dark': '#0066CC',
          'blue-bg': '#007AFF20',
        },
        // Light Mode
        light: {
          bg: '#f8f9fa',
          'card-bg': '#ffffff',
          'secondary-bg': '#f5f5f5',
          'text-primary': '#000000',
          'text-secondary': '#666666',
          'text-tertiary': '#888888',
          border: '#e0e0e0',
          'input-bg': '#f0f0f0',
        },
        // Dark Mode
        dark: {
          bg: '#111827',
          'card-bg': '#1f2937',
          'secondary-bg': '#181818',
          'text-primary': '#ffffff',
          'text-secondary': '#9ca3af',
          'text-tertiary': '#666666',
          border: '#374151',
          'input-bg': '#333333',
        },
      },
      borderRadius: {
        'card': '16px',
        'feature': '12px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
      },
    },
  },
  plugins: [],
}
