import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3100, // You can change the port number
    host: '192.168.1.12'
  },
  build: {
    sourcemap: true, //Generate sourcemap for debugging
  },
})
