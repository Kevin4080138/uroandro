import { defineConfig } from 'vitest/config'
import path from 'node:path'

// Sof hisoblash funksiyalari uchun testlar (DOM kerak emas).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
