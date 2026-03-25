/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/user-app/app/**/*.{js,ts,jsx,tsx}",
    "./apps/user-app/components/**/*.{js,ts,jsx,tsx}",

    // (optional but safe)
    "./apps/user-app/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
