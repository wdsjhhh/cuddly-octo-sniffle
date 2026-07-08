import path from 'path'
import { defineConfig } from '@lark-apaas/coding-preset-vite-react'

const repoName = process.env.REPO_NAME || ''
const basePath = repoName ? `/${repoName}/` : '/'

export default defineConfig({
  base: basePath,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
})
