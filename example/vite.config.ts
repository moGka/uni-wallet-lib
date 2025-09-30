import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'uni-wallet-lib': path.resolve(__dirname, '../packages/core/src')
    }
  },
  optimizeDeps: {
    exclude: ['uni-wallet-lib']
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
