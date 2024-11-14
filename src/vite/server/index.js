export const serverOption = {
    port: 5000,
    host: true,
    open: true,
    proxy: {
        "/dev": {
            target: "http://127.0.0.1:8888",
            changeOrigin: true,
            rewrite: (p) => p.replace(/^\/dev/, ''),
        },
        '/react': {
            target: "http://127.0.0.1:3001",
            changeOrigin: true,
            rewrite: (p) => p.replace(/^\/react/, ''),
        }, //  React subproject
    },
}