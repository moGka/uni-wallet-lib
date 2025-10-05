import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 开发时使用别名引用本地[uni-wallet-lib]，以实现热重载
      'uni-wallet-lib': path.resolve(__dirname, '../core/src')
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
