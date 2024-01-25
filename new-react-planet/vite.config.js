import {defineConfig} from 'vite'
import {resolve} from 'path'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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
        }
    }
})
