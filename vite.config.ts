import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { ViteSSG } from 'vite-ssg';
import tailwindcss from 'tailwindcss';
import getVCData from './scripts/fetchData.mjs';

export default defineConfig({
  plugins: [react()],
  base: "./",
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  // SSG Options
  ssgOptions: {
    // This async function is the core of the static generation process
    dynamicRoutes: async () => {
      console.log('Generating dynamic routes...');
      const vcs = await getVCData();
      const routes = vcs.map(vc => `/vcs/${vc.id}`);
      console.log(`Found ${routes.length} routes to generate.`);
      return routes;
    },
  },
});