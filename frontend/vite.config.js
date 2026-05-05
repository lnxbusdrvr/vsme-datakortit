import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js'
  },
  // Fix for over 500Kb minify dist-builds. It splits the code into chunks based on the node_modules folder, which can help with caching and load times.
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString() // Convert the id to a string
              .split('node_modules/')[1] // This splits the path at 'node_modules/' and takes the second part, which is the path to the package
              .split('/')[0].toString(); // This splits the package path at '/' and takes the first part, which is the package name. The toString() is added to ensure it's treated as a string for chunk naming.
          }
        }
      }
    }
  }
})
