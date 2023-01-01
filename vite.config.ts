import {defineConfig} from 'vite'
import * as path from 'node:path'
import {viteMockServe} from 'vite-plugin-mock'
import react from '@vitejs/plugin-react'

export default defineConfig({
    server: {
        port: 8900,
        proxy: {
            '/api':{
                changeOrigin:true,
                target:'http://localhost:8089',
            }
        }
    },
    plugins: [
        react(),
        viteMockServe({
            mockPath: 'mock',
            localEnabled: true,
            prodEnabled: false,
            supportTs: false,
            watchFiles: true,
            injectCode: `
        import {setupProdMockServer} from './mockProdServer';
        setupProdMockServer();
      `
        })
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
                additionalData: `@import "${path.resolve(__dirname, "src/styles/variable.less")}";`,
                javascriptEnabled: true
            }
        }
    }
})
