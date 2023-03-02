import visualizer from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

const babel = require('@rollup/plugin-babel').default

const folder = process.env.BUILD_FILE

const analyzer = process.env.ANALYZE
let vis = false
if (analyzer) {
  vis = visualizer({
    filename: 'report.html',
    open: false,
    gzipSize: true,
    emitFile: false,
  })
}
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {},
  },
  build: {
    lib: {
      entry: `./packages/${folder}/src/index.ts`,
      name: 'XverseJS',
      fileName: 'bundle',
    },
    outDir: `packages/${folder}/lib`,
  },
  plugins: [vis],
})
