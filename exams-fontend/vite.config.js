// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: 'exams_fontend', // Thay thế <repository-name> bằng tên kho lưu trữ GitHub của bạn
})
