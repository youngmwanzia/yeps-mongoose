const debug = require('debug')('yeps:mongoose');
const mongoose = require('./mongoose');

module.exports = () => (ctx) => {
  debug('Adding mongoose to context...');
  ctx.mongoose = mongoose;
};
