import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('tailwindcss').Config} */
export default {
  preprocess: vitePreprocess(),
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
