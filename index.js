const debug = require('debug')('yeps:mysql');
const mongoose = require('mongoose');
const config = require('config');

debug(config.mongoose);

mongoose.connect(config.mongoose.uri, config.mongoose.parameters);
mongoose.Promise = global.Promise;
