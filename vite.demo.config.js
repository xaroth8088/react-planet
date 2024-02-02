import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import basicSsl from '@vitejs/plugin-basic-ssl'

// This is the configuration to build the demo page as a standalone app, suitable for deployment as a static page
// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [react(), basicSsl()],
    build: {
        outDir: 'demo_page_dist',
        target: browserslistToEsbuild()
    },
    server: {
        watch: {
            usePolling: true
        }
    },
})
