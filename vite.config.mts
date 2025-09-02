import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodecg from './vite-nodecg.mjs';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: { tsconfigPath: './tsconfig.browser.json' } }),
    nodecg({
      bundleName: 'nodecg-foobar2000-controlle',
      graphics: './src/browser/graphics/*.tsx',
      dashboard: './src/browser/dashboard/*.tsx',
    }),
  ],
});
