/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables class-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary))',
        'primary-foreground': 'rgb(var(--color-primary-foreground))',
        secondary: 'rgb(var(--color-secondary))',
        'secondary-foreground': 'rgb(var(--color-secondary-foreground))',
        background: 'rgb(var(--color-background))',
        foreground: 'rgb(var(--color-foreground))',
        border: 'rgb(var(--color-border))',
        accent: 'rgb(var(--color-accent))',
        'accent-foreground': 'rgb(var(--color-accent-foreground))',
        lightViolet: 'rgb(139, 92, 246)',
        darkMagenta: 'rgb(204, 51, 153)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
