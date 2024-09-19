/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // You can extend your theme here if needed
      colors: {
        primary: {
          DEFAULT: 'rgb(34, 197, 94)', // Green
        },
        secondary: {
          DEFAULT: 'rgb(139, 92, 246)', // Violet
        },
        foreground: {
          DEFAULT: 'rgb(255, 255, 255)', // White
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      {
        myCustomTheme: {
          primary: 'rgb(34, 197, 94)', // Green
          secondary: 'rgb(139, 92, 246)', // Violet
          accent: 'rgb(255, 255, 255)', // White
          neutral: '#3d4451', // Optional: Darker neutral color
          'base-100': '#1f1f1f', // Background color for dark theme
          'base-200': '#2a2a2a', // Slightly lighter background
          'base-300': '#3a3a3a', // Even lighter background
          'info': '#3abff8',
          'success': '#36d399',
          'warning': '#fbbd23',
          'error': '#f87272',
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
}
