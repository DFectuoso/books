module.exports = {
  apiPort: parseInt(process.env.API_PORT) || 3000,
  apiHost: process.env.API_HOST || 'http://localhost:3000',
  appPort: parseInt(process.env.APP_PORT) || 4000,
  appHost: process.env.APP_HOST || 'http://localhost:4000',
  adminPort: parseInt(process.env.ADMIN_PORT) || 5000,
  adminHost: process.env.ADMIN_HOST || 'http://localhost:5000',
  adminPrefix: process.env.ADMIN_PREFIX || '/admin',
  static: process.env.WEBPACK_PUBLIC_PATH
}
