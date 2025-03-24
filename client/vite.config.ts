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
    host: '192.168.1.12',
    // host: '127.0.0.1',
    allowedHosts: [
      'd9ff-2401-4900-1cbd-680f-5c5e-94dd-d452-4966.ngrok-free.app'
    ]
  },
  build: {
    sourcemap: true, //Generate sourcemap for debugging
  },
})
