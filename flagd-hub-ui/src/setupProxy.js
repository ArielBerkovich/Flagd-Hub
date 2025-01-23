const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  if (process.env.NODE_ENV === 'development') {
  app.use(
    '/flagd-hub',
    createProxyMiddleware({
      target: process.env.REACT_APP_SERVER_URL+'/flagd-hub',
      changeOrigin: true,
    })
  );
  }
};