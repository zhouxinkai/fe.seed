const path = require('path');
module.exports = {
  port: 9090,
  isDev: false,
  isProd: false,
  isMock: true,
  feDebug: true,
  root: path.resolve(__dirname, '..'),
  webpack: {
    port: 9091
  },
  onlineHost: '//s0.test.net/bs/fe.seed'
};
