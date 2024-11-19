/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
      boxShadow: {
        table: "0 0px 100px 50px rgb(0 0 0 / 0.25)",
      },
      aspectRatio: {
        card: "1024/1820", // or approximately '16/9'
      },
      fontFamily: {
        chokokutai: ["Chokokutai", "serif"],
        merriweather: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};
