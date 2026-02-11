module.exports = {
    '/api': {
        target: 'http://localhost:8081',
        secure: false,
        changeOrigin: true,
        configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
                proxyReq.removeHeader('origin');
                proxyReq.removeHeader('referer');
            });
        }
    }
};
