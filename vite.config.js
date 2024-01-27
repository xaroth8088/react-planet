import {defineConfig} from 'vite'
import {resolve} from 'path'
import react from '@vitejs/plugin-react-swc'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), basicSsl()],
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.js'),
            formats: ['es']
        },
        copyPublicDir: false,
        rollupOptions: {
            external: ['react', 'react/jsx-runtime'],
            output: {
                entryFileNames: '[name].js',
            }
        },
        target: browserslistToEsbuild()
    },
    server: {
        watch: {
            usePolling: true
        }
    },
})
