module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {borderColor: ["invalid"]},
  },
  plugins: [require("tailwindcss-invalid-variant-plugin")],
}
