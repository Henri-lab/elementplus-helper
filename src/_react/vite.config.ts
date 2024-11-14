import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: __dirname,
  build: {
    outDir: '../dist/_react', // Output the build files in a separate folder
  },
  server: {
    port: 3001, // Use a different port from the Vue app to avoid conflicts
  },
});
