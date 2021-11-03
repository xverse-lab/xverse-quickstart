const { resolve } = require('path')

module.exports = {
    root: './src',
    server: {
        port: 4500,
        host: true
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                select: resolve(__dirname, 'src/select.html'),
            },
        },
        outDir: 'dist',
    },
    base: "./"
}