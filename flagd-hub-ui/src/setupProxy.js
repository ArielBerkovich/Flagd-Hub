const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/flagd-hub',
    createProxyMiddleware({
      target: process.env.REACT_APP_SERVER_URL+'/flagd-hub',
      changeOrigin: true,
    })
  );
};