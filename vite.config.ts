import {defineConfig} from 'vite'
import * as path from 'node:path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    server: {
        port: 8080,
        proxy: {
            '/api':{
                changeOrigin:true,
                target:'http://127.0.0.1:8900',
            }
        }
    },
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                additionalData: `@import "${path.resolve(__dirname, "src/styles/variable.scss")}";`,
                javascriptEnabled: true
            }
        }
    }
})
