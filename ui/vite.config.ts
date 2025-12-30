/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Configures '@' to point to the 'src' folder
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Vitest Configuration
  test: {
    globals: true,            // Allows using describe/it/expect globally
    environment: 'jsdom',     // Simulates browser for React testing
    setupFiles: './src/test/setup.ts', // Points to our TS setup file
    css: true,                // Process CSS during testing
  },
})
