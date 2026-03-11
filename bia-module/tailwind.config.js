/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      colors: {
        // BCM Theme Colors - Dark Blue & White
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        bcm: {
          // Main dark blue (matching the reference sidebar)
          dark: '#2c3e50',
          'dark-hover': '#34495e',
          // Secondary blue
          blue: '#3498db',
          'blue-hover': '#2980b9',
          // Light backgrounds
          light: '#ecf0f1',
          'light-hover': '#d5dbdb',
          // Status colors
          success: '#27ae60',
          warning: '#f39c12',
          danger: '#e74c3c',
          info: '#3498db',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'bcm': '0 2px 4px 0 rgba(44, 62, 80, 0.1)',
        'bcm-lg': '0 4px 6px -1px rgba(44, 62, 80, 0.1), 0 2px 4px -1px rgba(44, 62, 80, 0.06)',
      },
    },
  },
  plugins: [],
}
