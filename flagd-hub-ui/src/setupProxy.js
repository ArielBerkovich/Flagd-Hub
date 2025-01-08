const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/flagd-hub',
    createProxyMiddleware({
      target: 'http://localhost:8080/flagd-hub',
      changeOrigin: true,
    })
  );
};