import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { defineConfig } from 'vite'

export default defineConfig({
    // entry: './src/index.ts',
    css: {
        postcss: {
            plugins: [tailwind(), autoprefixer()],
        },
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/frontend'),
        },
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000', //API-Proxy für H3 Backend
        }
    }
})